import { UserRole } from '../value-objects/UserRole'

export interface UserProps {
  id: string
  email: string
  name: string | null
  hashedPassword: string | null
  role: UserRole
  image: string | null
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

export class User {
  protected constructor(private props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props)
  }

  static fromProps(props: UserProps): User {
    return new User(props)
  }

  get id() {
    return this.props.id
  }
  get email() {
    return this.props.email
  }
  get name() {
    return this.props.name
  }
  get hashedPassword() {
    return this.props.hashedPassword
  }
  get role() {
    return this.props.role
  }
  get image() {
    return this.props.image
  }
  get emailVerified() {
    return this.props.emailVerified
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN
  }

  isBusiness(): boolean {
    return this.props.role === UserRole.BUSINESS
  }

  isConsumer(): boolean {
    return this.props.role === UserRole.CONSUMER
  }
}
