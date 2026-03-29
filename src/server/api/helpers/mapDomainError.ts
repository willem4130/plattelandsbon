import { TRPCError } from '@trpc/server'
import {
  DomainError,
  BusinessNotFoundError,
  VoucherNotFoundError,
  BusinessNotVerifiedError,
  BusinessCannotBeVerifiedError,
  BusinessAlreadyExistsError,
} from '@/domain/errors'

export function mapDomainError(error: unknown): never {
  if (!(error instanceof DomainError)) throw error

  if (
    error instanceof BusinessNotFoundError ||
    error instanceof VoucherNotFoundError
  ) {
    throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
  }

  if (error instanceof BusinessNotVerifiedError) {
    throw new TRPCError({ code: 'FORBIDDEN', message: error.message })
  }

  if (error instanceof BusinessAlreadyExistsError) {
    throw new TRPCError({ code: 'CONFLICT', message: error.message })
  }

  if (error instanceof BusinessCannotBeVerifiedError) {
    throw new TRPCError({ code: 'PRECONDITION_FAILED', message: error.message })
  }

  // Default: domain validation / business rule errors
  throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
}
