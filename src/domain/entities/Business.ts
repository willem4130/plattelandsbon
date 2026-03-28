import { BusinessStatus } from '../value-objects/BusinessStatus'

export interface BusinessProps {
  id: string
  userId: string
  name: string
  description: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  province: string | null
  phone: string | null
  website: string | null
  status: BusinessStatus
  verifiedAt: Date | null
  verificationNotes: string | null
  logo: string | null
  categoryIds: string[]
  createdAt: Date
  updatedAt: Date
}

export class Business {
  constructor(private props: BusinessProps) {}

  get id() {
    return this.props.id
  }
  get userId() {
    return this.props.userId
  }
  get name() {
    return this.props.name
  }
  get description() {
    return this.props.description
  }
  get address() {
    return this.props.address
  }
  get city() {
    return this.props.city
  }
  get postalCode() {
    return this.props.postalCode
  }
  get province() {
    return this.props.province
  }
  get phone() {
    return this.props.phone
  }
  get website() {
    return this.props.website
  }
  get status() {
    return this.props.status
  }
  get verifiedAt() {
    return this.props.verifiedAt
  }
  get verificationNotes() {
    return this.props.verificationNotes
  }
  get logo() {
    return this.props.logo
  }
  get categoryIds() {
    return this.props.categoryIds
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  isPending(): boolean {
    return this.props.status === BusinessStatus.PENDING
  }

  isVerified(): boolean {
    return this.props.status === BusinessStatus.VERIFIED
  }

  isSuspended(): boolean {
    return this.props.status === BusinessStatus.SUSPENDED
  }

  canCreateVouchers(): boolean {
    return this.props.status === BusinessStatus.VERIFIED
  }

  canBeVerified(): boolean {
    return this.props.status === BusinessStatus.PENDING
  }

  canBeRejected(): boolean {
    return this.props.status === BusinessStatus.PENDING
  }

  canBeSuspended(): boolean {
    return this.props.status === BusinessStatus.VERIFIED
  }
}
