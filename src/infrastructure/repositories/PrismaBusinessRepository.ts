import type { PrismaClient, Business as PrismaBusinessRecord, BusinessCategory } from '@prisma/client'
import { Business } from '@/domain/entities/Business'
import type { BusinessStatus } from '@/domain/value-objects/BusinessStatus'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import type { TransactionContext, PaginationOptions } from '@/domain/types'
import { BaseRepository } from './BaseRepository'

type BusinessWithCategories = PrismaBusinessRecord & {
  businessCategories: Pick<BusinessCategory, 'categoryId'>[]
}

const includeCategories = { businessCategories: { select: { categoryId: true } } } as const

export class PrismaBusinessRepository
  extends BaseRepository<Business, BusinessWithCategories>
  implements IBusinessRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected toDomain(record: BusinessWithCategories): Business {
    return Business.fromProps({
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
      categoryIds: record.businessCategories.map((bc) => bc.categoryId),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  async findById(id: string, tx?: TransactionContext): Promise<Business | null> {
    const client = this.getClient(tx)
    const record = await client.business.findUnique({
      where: { id },
      include: includeCategories,
    })
    return this.mapOrNull(record)
  }

  async findByUserId(userId: string, tx?: TransactionContext): Promise<Business | null> {
    const client = this.getClient(tx)
    const record = await client.business.findUnique({
      where: { userId },
      include: includeCategories,
    })
    return this.mapOrNull(record)
  }

  async findByStatus(
    status: BusinessStatus,
    options?: PaginationOptions,
    tx?: TransactionContext,
  ): Promise<Business[]> {
    const client = this.getClient(tx)
    const records = await client.business.findMany({
      where: { status },
      include: includeCategories,
      orderBy: { createdAt: 'desc' },
      ...(options?.skip !== undefined && { skip: options.skip }),
      ...(options?.take !== undefined && { take: options.take }),
    })
    return this.mapMany(records)
  }

  async findAll(options?: PaginationOptions, tx?: TransactionContext): Promise<Business[]> {
    const client = this.getClient(tx)
    const records = await client.business.findMany({
      include: includeCategories,
      orderBy: { createdAt: 'desc' },
      ...(options?.skip !== undefined && { skip: options.skip }),
      ...(options?.take !== undefined && { take: options.take }),
    })
    return this.mapMany(records)
  }

  async create(
    data: {
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
    },
    tx?: TransactionContext,
  ): Promise<Business> {
    const client = this.getClient(tx)
    const { categoryIds, ...businessData } = data
    const record = await client.business.create({
      data: {
        ...businessData,
        businessCategories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
      include: includeCategories,
    })
    return this.toDomain(record)
  }

  async findByIds(ids: string[], tx?: TransactionContext): Promise<Business[]> {
    const client = this.getClient(tx)
    const records = await client.business.findMany({
      where: { id: { in: ids } },
      include: includeCategories,
    })
    return this.mapMany(records)
  }

  async updateStatus(
    id: string,
    status: BusinessStatus,
    notes?: string,
    tx?: TransactionContext,
  ): Promise<Business> {
    const client = this.getClient(tx)
    const record = await client.business.update({
      where: { id },
      data: {
        status,
        verificationNotes: notes,
        verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
      },
      include: includeCategories,
    })
    return this.toDomain(record)
  }
}
