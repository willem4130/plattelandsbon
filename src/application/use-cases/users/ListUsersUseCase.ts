import type { IUseCase } from '@/application/interfaces'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { UserRole } from '@/domain/value-objects/UserRole'
import { UserMapper } from '../../mappers/UserMapper'
import type { PaginatedUsersDTO } from '../../dtos/UserDTO'

export interface ListUsersInput {
  page?: number
  limit?: number
  role?: UserRole
  search?: string
}

export class ListUsersUseCase implements IUseCase<ListUsersInput | undefined, PaginatedUsersDTO> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input?: ListUsersInput): Promise<PaginatedUsersDTO> {
    const page = input?.page ?? 1
    const limit = input?.limit ?? 50
    const skip = (page - 1) * limit

    const { users, total } = await this.userRepo.findAll(
      { role: input?.role, search: input?.search },
      { skip, take: limit },
    )

    return {
      users: users.map(UserMapper.toDTO),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
