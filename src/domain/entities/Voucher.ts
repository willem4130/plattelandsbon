import { DiscountType } from '../value-objects/DiscountType'
import { VoucherStatus } from '../value-objects/VoucherStatus'

export interface VoucherProps {
  id: string
  businessId: string
  title: string
  description: string
  discountType: DiscountType
  discountValue: number | null
  discountDescription: string | null
  terms: string | null
  minimumPurchase: number | null
  startDate: Date
  endDate: Date
  maxClaims: number | null
  claimsCount: number
  status: VoucherStatus
  approvedAt: Date | null
  rejectedAt: Date | null
  rejectionReason: string | null
  image: string | null
  slug: string | null
  createdAt: Date
  updatedAt: Date
}

export class Voucher {
  protected constructor(private props: VoucherProps) {}

  static create(props: VoucherProps): Voucher {
    return new Voucher(props)
  }

  static fromProps(props: VoucherProps): Voucher {
    return new Voucher(props)
  }

  get id() {
    return this.props.id
  }
  get businessId() {
    return this.props.businessId
  }
  get title() {
    return this.props.title
  }
  get description() {
    return this.props.description
  }
  get discountType() {
    return this.props.discountType
  }
  get discountValue() {
    return this.props.discountValue
  }
  get discountDescription() {
    return this.props.discountDescription
  }
  get terms() {
    return this.props.terms
  }
  get minimumPurchase() {
    return this.props.minimumPurchase
  }
  get startDate() {
    return this.props.startDate
  }
  get endDate() {
    return this.props.endDate
  }
  get maxClaims() {
    return this.props.maxClaims
  }
  get claimsCount() {
    return this.props.claimsCount
  }
  get status() {
    return this.props.status
  }
  get image() {
    return this.props.image
  }
  get slug() {
    return this.props.slug
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  isActive(): boolean {
    return this.props.status === VoucherStatus.ACTIVE
  }

  isExpired(): boolean {
    return new Date() > this.props.endDate
  }

  hasStarted(): boolean {
    return new Date() >= this.props.startDate
  }

  isClaimable(): boolean {
    if (!this.isActive()) return false
    if (this.isExpired()) return false
    if (!this.hasStarted()) return false
    if (this.props.maxClaims !== null && this.props.claimsCount >= this.props.maxClaims) return false
    return true
  }

  canBeApproved(): boolean {
    return this.props.status === VoucherStatus.PENDING
  }

  canBeRejected(): boolean {
    return this.props.status === VoucherStatus.PENDING
  }

  canBePaused(): boolean {
    return this.props.status === VoucherStatus.ACTIVE
  }

  remainingClaims(): number | null {
    if (this.props.maxClaims === null) return null
    return Math.max(0, this.props.maxClaims - this.props.claimsCount)
  }
}
