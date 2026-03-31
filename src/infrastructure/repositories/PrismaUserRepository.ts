import type { PrismaClient, Prisma, User as PrismaUserRecord } from '@prisma/client'
import { User } from '@/domain/entities/User'
import type { UserRole } from '@/domain/value-objects/UserRole'
import type { IUserRepository, UserSearchFilters } from '@/domain/repositories/IUserRepository'
import type { TransactionContext, PaginationOptions } from '@/domain/types'
import { BaseRepository } from './BaseRepository'

export class PrismaUserRepository
  extends BaseRepository<User, PrismaUserRecord>
  implements IUserRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected toDomain(record: PrismaUserRecord): User {
    return User.fromProps({
      id: record.id,
      email: record.email,
      name: record.name,
      role: record.role as UserRole,
      image: record.image,
      emailVerified: record.emailVerified,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  async findById(id: string, tx?: TransactionContext): Promise<User | null> {
    const client = this.getClient(tx) as PrismaClient
    const record = await client.user.findUnique({ where: { id } })
    return this.mapOrNull(record)
  }

  async findByEmail(email: string, tx?: TransactionContext): Promise<User | null> {
    const client = this.getClient(tx) as PrismaClient
    const record = await client.user.findUnique({ where: { email } })
    return this.mapOrNull(record)
  }

  async findAll(
    filters?: UserSearchFilters,
    options?: PaginationOptions,
    tx?: TransactionContext,
  ): Promise<{ users: User[]; total: number }> {
    const client = this.getClient(tx) as PrismaClient

    const where: Prisma.UserWhereInput = {}

    if (filters?.role) {
      where.role = filters.role
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' as const } },
        { email: { contains: filters.search, mode: 'insensitive' as const } },
      ]
    }

    const [records, total] = await Promise.all([
      client.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...(options?.skip !== undefined && { skip: options.skip }),
        ...(options?.take !== undefined && { take: options.take }),
      }),
      client.user.count({ where }),
    ])

    return { users: this.mapMany(records), total }
  }

  async create(
    data: { email: string; name: string; role: UserRole },
    tx?: TransactionContext,
  ): Promise<User> {
    const client = this.getClient(tx) as PrismaClient
    const record = await client.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
      },
    })
    return this.toDomain(record)
  }

  async countByRole(
    tx?: TransactionContext,
  ): Promise<{ total: number; admins: number; businesses: number; consumers: number }> {
    const client = this.getClient(tx) as PrismaClient

    const [total, admins, businesses, consumers] = await Promise.all([
      client.user.count(),
      client.user.count({ where: { role: 'ADMIN' } }),
      client.user.count({ where: { role: 'BUSINESS' } }),
      client.user.count({ where: { role: 'CONSUMER' } }),
    ])

    return { total, admins, businesses, consumers }
  }

  async countRecent(days: number, tx?: TransactionContext): Promise<number> {
    const client = this.getClient(tx) as PrismaClient
    const since = new Date()
    since.setDate(since.getDate() - days)

    return client.user.count({
      where: { createdAt: { gte: since } },
    })
  }
}
