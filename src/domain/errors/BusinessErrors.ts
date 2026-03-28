import { DomainError } from './DomainError'

export class BusinessNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Business not found: ${id}`)
  }
}

export class BusinessAlreadyExistsError extends DomainError {
  constructor(userId: string) {
    super(`User ${userId} already has a registered business`)
  }
}

export class BusinessNotVerifiedError extends DomainError {
  constructor(id: string) {
    super(`Business ${id} is not verified`)
  }
}

export class BusinessCannotBeVerifiedError extends DomainError {
  constructor(id: string, status: string) {
    super(`Business ${id} cannot be verified (status: ${status})`)
  }
}
