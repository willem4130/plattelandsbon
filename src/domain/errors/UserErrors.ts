import { DomainError } from './DomainError'

export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User niet gevonden: ${identifier}`)
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Er bestaat al een account met ${email}`)
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Ongeldig e-mailadres of wachtwoord')
  }
}
