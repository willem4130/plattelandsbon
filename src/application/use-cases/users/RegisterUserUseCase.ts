import type { IUseCase } from '@/application/interfaces/IUseCase'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserAlreadyExistsError } from '@/domain/errors'
import { UserRole } from '@/domain/value-objects/UserRole'
import { UserMapper } from '@/application/mappers/UserMapper'
import type { UserResponseDTO } from '@/application/dtos/UserDTO'
import bcrypt from 'bcryptjs'

interface RegisterUserInput {
  name: string
  email: string
  password: string
}

export class RegisterUserUseCase implements IUseCase<RegisterUserInput, UserResponseDTO> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<UserResponseDTO> {
    const existing = await this.userRepo.findByEmail(input.email)
    if (existing) {
      throw new UserAlreadyExistsError(input.email)
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)

    const user = await this.userRepo.create({
      email: input.email,
      name: input.name,
      role: UserRole.CONSUMER,
      hashedPassword,
    })

    return UserMapper.toDTO(user)
  }
}
