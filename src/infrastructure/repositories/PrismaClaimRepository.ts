import type { PrismaClient } from '@prisma/client'
import { VoucherClaim } from '@/domain/entities/VoucherClaim'
import type { ClaimStatus } from '@/domain/value-objects/ClaimStatus'
import type { IClaimRepository } from '@/domain/repositories/IClaimRepository'

function toDomain(
  record: NonNullable<Awaited<ReturnType<PrismaClient['voucherClaim']['findFirst']>>>,
): VoucherClaim {
  return new VoucherClaim({
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

export class PrismaClaimRepository implements IClaimRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<VoucherClaim | null> {
    const record = await this.prisma.voucherClaim.findUnique({ where: { id } })
    return record ? toDomain(record) : null
  }

  async findByClaimCode(code: string): Promise<VoucherClaim | null> {
    const record = await this.prisma.voucherClaim.findUnique({
      where: { claimCode: code },
    })
    return record ? toDomain(record) : null
  }

  async findByUserId(userId: string): Promise<VoucherClaim[]> {
    const records = await this.prisma.voucherClaim.findMany({
      where: { userId },
      orderBy: { claimedAt: 'desc' },
    })
    return records.map(toDomain)
  }

  async findByVoucherId(voucherId: string): Promise<VoucherClaim[]> {
    const records = await this.prisma.voucherClaim.findMany({
      where: { voucherId },
      orderBy: { claimedAt: 'desc' },
    })
    return records.map(toDomain)
  }

  async create(data: {
    voucherId: string
    userId: string
    claimCode: string
    expiresAt?: Date
  }): Promise<VoucherClaim> {
    const record = await this.prisma.voucherClaim.create({ data })
    return toDomain(record)
  }

  async updateStatus(id: string, status: ClaimStatus): Promise<VoucherClaim> {
    const record = await this.prisma.voucherClaim.update({
      where: { id },
      data: {
        status,
        redeemedAt: status === 'REDEEMED' ? new Date() : undefined,
        cancelledAt: status === 'CANCELLED' ? new Date() : undefined,
      },
    })
    return toDomain(record)
  }
}
