import type { PrismaClient, Prisma, Voucher as PrismaVoucherRecord } from '@prisma/client'
import { type DiscountType as PrismaDiscountType, type VoucherStatus as PrismaVoucherStatus } from '@prisma/client'
import { Voucher } from '@/domain/entities/Voucher'
import type { DiscountType } from '@/domain/value-objects/DiscountType'
import type { VoucherStatus } from '@/domain/value-objects/VoucherStatus'
import type {
  IVoucherRepository,
  VoucherSearchFilters,
} from '@/domain/repositories/IVoucherRepository'
import type { TransactionContext, PaginationOptions } from '@/domain/types'
import { BaseRepository } from './BaseRepository'

export class PrismaVoucherRepository
  extends BaseRepository<Voucher, PrismaVoucherRecord>
  implements IVoucherRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected toDomain(record: PrismaVoucherRecord): Voucher {
    return Voucher.fromProps({
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

  async findById(id: string, tx?: TransactionContext): Promise<Voucher | null> {
    const client = this.getClient(tx)
    const record = await client.voucher.findUnique({ where: { id } })
    return this.mapOrNull(record)
  }

  async findBySlug(slug: string, tx?: TransactionContext): Promise<Voucher | null> {
    const client = this.getClient(tx)
    const record = await client.voucher.findUnique({ where: { slug } })
    return this.mapOrNull(record)
  }

  async findByBusinessId(
    businessId: string,
    options?: PaginationOptions,
    tx?: TransactionContext,
  ): Promise<Voucher[]> {
    const client = this.getClient(tx)
    const records = await client.voucher.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      ...(options?.skip !== undefined && { skip: options.skip }),
      ...(options?.take !== undefined && { take: options.take }),
    })
    return this.mapMany(records)
  }

  async findByStatus(
    status: VoucherStatus,
    options?: PaginationOptions,
    tx?: TransactionContext,
  ): Promise<Voucher[]> {
    const client = this.getClient(tx)
    const records = await client.voucher.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      ...(options?.skip !== undefined && { skip: options.skip }),
      ...(options?.take !== undefined && { take: options.take }),
    })
    return this.mapMany(records)
  }

  async search(
    filters: VoucherSearchFilters,
    tx?: TransactionContext,
  ): Promise<{ vouchers: Voucher[]; total: number }> {
    const client = this.getClient(tx)
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
      client.voucher.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit ?? 20,
        skip: filters.offset ?? 0,
      }),
      client.voucher.count({ where }),
    ])

    return { vouchers: this.mapMany(records), total }
  }

  async create(
    data: {
      businessId: string
      title: string
      description: string
      discountType: DiscountType
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
    },
    tx?: TransactionContext,
  ): Promise<Voucher> {
    const client = this.getClient(tx)
    const record = await client.voucher.create({
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
    return this.toDomain(record)
  }

  async updateStatus(
    id: string,
    status: VoucherStatus,
    reason?: string,
    tx?: TransactionContext,
  ): Promise<Voucher> {
    const client = this.getClient(tx)
    const record = await client.voucher.update({
      where: { id },
      data: {
        status,
        approvedAt: status === 'ACTIVE' ? new Date() : undefined,
        rejectedAt: status === 'REJECTED' ? new Date() : undefined,
        rejectionReason: status === 'REJECTED' ? reason : undefined,
      },
    })
    return this.toDomain(record)
  }

  async incrementClaimCount(id: string, tx?: TransactionContext): Promise<boolean> {
    const client = this.getClient(tx)
    // Atomic conditional increment: only increment if maxClaims is null OR claimsCount < maxClaims
    const result = await client.$executeRaw`
      UPDATE "Voucher"
      SET "claimsCount" = "claimsCount" + 1, "updatedAt" = NOW()
      WHERE "id" = ${id}
      AND ("maxClaims" IS NULL OR "claimsCount" < "maxClaims")
    `
    return result > 0
  }

  async countActiveByBusinessIds(
    businessIds: string[],
    tx?: TransactionContext,
  ): Promise<Map<string, number>> {
    const client = this.getClient(tx)
    const counts = await client.voucher.groupBy({
      by: ['businessId'],
      where: { businessId: { in: businessIds }, status: 'ACTIVE' },
      _count: true,
    })
    return new Map(counts.map((c) => [c.businessId, c._count]))
  }
}
