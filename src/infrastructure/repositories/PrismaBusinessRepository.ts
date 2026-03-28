import type { PrismaClient } from '@prisma/client'
import { Business } from '@/domain/entities/Business'
import type { BusinessStatus } from '@/domain/value-objects/BusinessStatus'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'

function toDomain(
  record: Awaited<ReturnType<PrismaClient['business']['findFirst']>> & {
    businessCategories?: { categoryId: string }[]
  },
): Business {
  if (!record) throw new Error('Business record is null')
  return new Business({
    id: record.id,
    userId: record.userId,
    name: record.name,
    description: record.description,
    address: record.address,
    city: record.city,
    postalCode: record.postalCode,
    province: record.province,
    phone: record.phone,
    website: record.website,
    status: record.status as BusinessStatus,
    verifiedAt: record.verifiedAt,
    verificationNotes: record.verificationNotes,
    logo: record.logo,
    categoryIds: record.businessCategories?.map((bc) => bc.categoryId) ?? [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  })
}

const includeCategories = { businessCategories: { select: { categoryId: true } } }

export class PrismaBusinessRepository implements IBusinessRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Business | null> {
    const record = await this.prisma.business.findUnique({
      where: { id },
      include: includeCategories,
    })
    return record ? toDomain(record) : null
  }

  async findByUserId(userId: string): Promise<Business | null> {
    const record = await this.prisma.business.findUnique({
      where: { userId },
      include: includeCategories,
    })
    return record ? toDomain(record) : null
  }

  async findByStatus(status: BusinessStatus): Promise<Business[]> {
    const records = await this.prisma.business.findMany({
      where: { status },
      include: includeCategories,
      orderBy: { createdAt: 'desc' },
    })
    return records.map(toDomain)
  }

  async findAll(): Promise<Business[]> {
    const records = await this.prisma.business.findMany({
      include: includeCategories,
      orderBy: { createdAt: 'desc' },
    })
    return records.map(toDomain)
  }

  async create(data: {
    userId: string
    name: string
    description?: string
    address?: string
    city?: string
    postalCode?: string
    province?: string
    phone?: string
    website?: string
    categoryIds: string[]
  }): Promise<Business> {
    const { categoryIds, ...businessData } = data
    const record = await this.prisma.business.create({
      data: {
        ...businessData,
        businessCategories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
      include: includeCategories,
    })
    return toDomain(record)
  }

  async updateStatus(
    id: string,
    status: BusinessStatus,
    notes?: string,
  ): Promise<Business> {
    const record = await this.prisma.business.update({
      where: { id },
      data: {
        status,
        verificationNotes: notes,
        verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
      },
      include: includeCategories,
    })
    return toDomain(record)
  }
}
