import type { PrismaClient, Prisma } from '@prisma/client'
import { type DiscountType as PrismaDiscountType, type VoucherStatus as PrismaVoucherStatus } from '@prisma/client'
import { Voucher } from '@/domain/entities/Voucher'
import type { DiscountType } from '@/domain/value-objects/DiscountType'
import type { VoucherStatus } from '@/domain/value-objects/VoucherStatus'
import type {
  IVoucherRepository,
  VoucherSearchFilters,
} from '@/domain/repositories/IVoucherRepository'

function toDomain(
  record: NonNullable<Awaited<ReturnType<PrismaClient['voucher']['findFirst']>>>,
): Voucher {
  return new Voucher({
    id: record.id,
    businessId: record.businessId,
    title: record.title,
    description: record.description,
    discountType: record.discountType as DiscountType,
    discountValue: record.discountValue,
    discountDescription: record.discountDescription,
    terms: record.terms,
    minimumPurchase: record.minimumPurchase,
    startDate: record.startDate,
    endDate: record.endDate,
    maxClaims: record.maxClaims,
    claimsCount: record.claimsCount,
    status: record.status as VoucherStatus,
    approvedAt: record.approvedAt,
    rejectedAt: record.rejectedAt,
    rejectionReason: record.rejectionReason,
    image: record.image,
    slug: record.slug,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  })
}

export class PrismaVoucherRepository implements IVoucherRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Voucher | null> {
    const record = await this.prisma.voucher.findUnique({ where: { id } })
    return record ? toDomain(record) : null
  }

  async findBySlug(slug: string): Promise<Voucher | null> {
    const record = await this.prisma.voucher.findUnique({ where: { slug } })
    return record ? toDomain(record) : null
  }

  async findByBusinessId(businessId: string): Promise<Voucher[]> {
    const records = await this.prisma.voucher.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    })
    return records.map(toDomain)
  }

  async findByStatus(status: VoucherStatus): Promise<Voucher[]> {
    const records = await this.prisma.voucher.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    })
    return records.map(toDomain)
  }

  async search(
    filters: VoucherSearchFilters,
  ): Promise<{ vouchers: Voucher[]; total: number }> {
    const where: Prisma.VoucherWhereInput = {
      status: filters.status ?? 'ACTIVE',
    }

    if (filters.categoryId || filters.city) {
      where.business = {
        ...(filters.categoryId
          ? { businessCategories: { some: { categoryId: filters.categoryId } } }
          : {}),
        ...(filters.city ? { city: filters.city } : {}),
      }
    }
    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' as const } },
        { description: { contains: filters.query, mode: 'insensitive' as const } },
      ]
    }

    const [records, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit ?? 20,
        skip: filters.offset ?? 0,
      }),
      this.prisma.voucher.count({ where }),
    ])

    return { vouchers: records.map(toDomain), total }
  }

  async create(data: {
    businessId: string
    title: string
    description: string
    discountType: string
    discountValue?: number
    discountDescription?: string
    terms?: string
    minimumPurchase?: number
    startDate: Date
    endDate: Date
    maxClaims?: number
    image?: string
    slug: string
    status?: VoucherStatus
  }): Promise<Voucher> {
    const record = await this.prisma.voucher.create({
      data: {
        businessId: data.businessId,
        title: data.title,
        description: data.description,
        discountType: data.discountType as PrismaDiscountType,
        discountValue: data.discountValue,
        discountDescription: data.discountDescription,
        terms: data.terms,
        minimumPurchase: data.minimumPurchase,
        startDate: data.startDate,
        endDate: data.endDate,
        maxClaims: data.maxClaims,
        image: data.image,
        slug: data.slug,
        status: (data.status ?? 'DRAFT') as PrismaVoucherStatus,
      },
    })
    return toDomain(record)
  }

  async updateStatus(
    id: string,
    status: VoucherStatus,
    reason?: string,
  ): Promise<Voucher> {
    const record = await this.prisma.voucher.update({
      where: { id },
      data: {
        status,
        approvedAt: status === 'ACTIVE' ? new Date() : undefined,
        rejectedAt: status === 'REJECTED' ? new Date() : undefined,
        rejectionReason: status === 'REJECTED' ? reason : undefined,
      },
    })
    return toDomain(record)
  }

  async incrementClaimCount(id: string): Promise<void> {
    await this.prisma.voucher.update({
      where: { id },
      data: { claimsCount: { increment: 1 } },
    })
  }
}
