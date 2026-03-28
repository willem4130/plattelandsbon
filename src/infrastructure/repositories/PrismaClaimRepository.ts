import type { PrismaClient, VoucherClaim as PrismaClaimRecord } from '@prisma/client'
import { VoucherClaim } from '@/domain/entities/VoucherClaim'
import type { ClaimStatus } from '@/domain/value-objects/ClaimStatus'
import type { IClaimRepository } from '@/domain/repositories/IClaimRepository'
import type { TransactionContext, PaginationOptions } from '@/domain/types'
import { BaseRepository } from './BaseRepository'

export class PrismaClaimRepository
  extends BaseRepository<VoucherClaim, PrismaClaimRecord>
  implements IClaimRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected toDomain(record: PrismaClaimRecord): VoucherClaim {
    return VoucherClaim.fromProps({
      id: record.id,
      voucherId: record.voucherId,
      userId: record.userId,
      claimCode: record.claimCode,
      status: record.status as ClaimStatus,
      expiresAt: record.expiresAt,
      claimedAt: record.claimedAt,
      redeemedAt: record.redeemedAt,
      cancelledAt: record.cancelledAt,
    })
  }

  async findById(id: string, tx?: TransactionContext): Promise<VoucherClaim | null> {
    const client = this.getClient(tx) as PrismaClient
    const record = await client.voucherClaim.findUnique({ where: { id } })
    return this.mapOrNull(record)
  }

  async findByClaimCode(code: string, tx?: TransactionContext): Promise<VoucherClaim | null> {
    const client = this.getClient(tx) as PrismaClient
    const record = await client.voucherClaim.findUnique({
      where: { claimCode: code },
    })
    return this.mapOrNull(record)
  }

  async findByUserId(
    userId: string,
    options?: PaginationOptions,
    tx?: TransactionContext,
  ): Promise<VoucherClaim[]> {
    const client = this.getClient(tx) as PrismaClient
    const records = await client.voucherClaim.findMany({
      where: { userId },
      orderBy: { claimedAt: 'desc' },
      ...(options?.skip !== undefined && { skip: options.skip }),
      ...(options?.take !== undefined && { take: options.take }),
    })
    return this.mapMany(records)
  }

  async findByVoucherId(
    voucherId: string,
    options?: PaginationOptions,
    tx?: TransactionContext,
  ): Promise<VoucherClaim[]> {
    const client = this.getClient(tx) as PrismaClient
    const records = await client.voucherClaim.findMany({
      where: { voucherId },
      orderBy: { claimedAt: 'desc' },
      ...(options?.skip !== undefined && { skip: options.skip }),
      ...(options?.take !== undefined && { take: options.take }),
    })
    return this.mapMany(records)
  }

  async create(
    data: {
      voucherId: string
      userId: string
      claimCode: string
      expiresAt?: Date
    },
    tx?: TransactionContext,
  ): Promise<VoucherClaim> {
    const client = this.getClient(tx) as PrismaClient
    const record = await client.voucherClaim.create({ data })
    return this.toDomain(record)
  }

  async updateStatus(
    id: string,
    status: ClaimStatus,
    tx?: TransactionContext,
  ): Promise<VoucherClaim> {
    const client = this.getClient(tx) as PrismaClient
    const record = await client.voucherClaim.update({
      where: { id },
      data: {
        status,
        redeemedAt: status === 'REDEEMED' ? new Date() : undefined,
        cancelledAt: status === 'CANCELLED' ? new Date() : undefined,
      },
    })
    return this.toDomain(record)
  }
}
