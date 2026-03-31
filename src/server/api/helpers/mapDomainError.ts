import { TRPCError } from '@trpc/server'
import {
  DomainError,
  BusinessNotFoundError,
  VoucherNotFoundError,
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidCredentialsError,
  BusinessNotVerifiedError,
  BusinessCannotBeVerifiedError,
  BusinessAlreadyExistsError,
  ClaimLimitExceededError,
  VoucherNotClaimableError,
  InvalidRedemptionError,
} from '@/domain/errors'

export function mapDomainError(error: unknown): never {
  if (!(error instanceof DomainError)) throw error

  if (
    error instanceof BusinessNotFoundError ||
    error instanceof VoucherNotFoundError ||
    error instanceof UserNotFoundError
  ) {
    throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
  }

  if (error instanceof BusinessNotVerifiedError) {
    throw new TRPCError({ code: 'FORBIDDEN', message: error.message })
  }

  if (error instanceof BusinessAlreadyExistsError || error instanceof UserAlreadyExistsError) {
    throw new TRPCError({ code: 'CONFLICT', message: error.message })
  }

  if (error instanceof InvalidCredentialsError) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message })
  }

  if (
    error instanceof BusinessCannotBeVerifiedError ||
    error instanceof ClaimLimitExceededError ||
    error instanceof VoucherNotClaimableError
  ) {
    throw new TRPCError({ code: 'PRECONDITION_FAILED', message: error.message })
  }

  if (error instanceof InvalidRedemptionError) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
  }

  // Default: domain validation / business rule errors
  throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
}
