import { ClaimStatus } from '../value-objects/ClaimStatus'

export interface VoucherClaimProps {
  id: string
  voucherId: string
  userId: string
  claimCode: string
  status: ClaimStatus
  expiresAt: Date | null
  claimedAt: Date
  redeemedAt: Date | null
  cancelledAt: Date | null
}

export class VoucherClaim {
  constructor(private props: VoucherClaimProps) {}

  get id() {
    return this.props.id
  }
  get voucherId() {
    return this.props.voucherId
  }
  get userId() {
    return this.props.userId
  }
  get claimCode() {
    return this.props.claimCode
  }
  get status() {
    return this.props.status
  }
  get expiresAt() {
    return this.props.expiresAt
  }
  get claimedAt() {
    return this.props.claimedAt
  }
  get redeemedAt() {
    return this.props.redeemedAt
  }
  get cancelledAt() {
    return this.props.cancelledAt
  }

  isRedeemable(): boolean {
    if (this.props.status !== ClaimStatus.CLAIMED) return false
    if (this.props.expiresAt && new Date() > this.props.expiresAt) return false
    return true
  }

  isExpired(): boolean {
    if (!this.props.expiresAt) return false
    return new Date() > this.props.expiresAt
  }

  isCancellable(): boolean {
    return this.props.status === ClaimStatus.CLAIMED
  }
}
