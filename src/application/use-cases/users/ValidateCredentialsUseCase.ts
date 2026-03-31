import type { IUseCase } from '@/application/interfaces/IUseCase'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { InvalidCredentialsError } from '@/domain/errors'
import { UserMapper } from '@/application/mappers/UserMapper'
import type { UserResponseDTO } from '@/application/dtos/UserDTO'
import bcrypt from 'bcryptjs'

interface ValidateCredentialsInput {
  email: string
  password: string
}

export class ValidateCredentialsUseCase
  implements IUseCase<ValidateCredentialsInput, UserResponseDTO>
{
  constructor(private userRepo: IUserRepository) {}

  async execute(input: ValidateCredentialsInput): Promise<UserResponseDTO> {
    const user = await this.userRepo.findByEmailWithPassword(input.email)
    if (!user || !user.hashedPassword) {
      throw new InvalidCredentialsError()
    }

    const valid = await bcrypt.compare(input.password, user.hashedPassword)
    if (!valid) {
      throw new InvalidCredentialsError()
    }

    return UserMapper.toDTO(user)
  }
}
