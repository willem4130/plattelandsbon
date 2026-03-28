import { DomainError } from './DomainError'

export class VoucherNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Voucher not found: ${id}`)
  }
}

export class VoucherNotClaimableError extends DomainError {
  constructor(id: string) {
    super(`Voucher ${id} cannot be claimed`)
  }
}

export class ClaimLimitExceededError extends DomainError {
  constructor(voucherId: string) {
    super(`Claim limit exceeded for voucher ${voucherId}`)
  }
}

export class InvalidRedemptionError extends DomainError {
  constructor(claimCode: string) {
    super(`Claim ${claimCode} cannot be redeemed`)
  }
}
