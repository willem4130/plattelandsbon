export interface CategoryProps {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sortOrder: number
}

export class Category {
  protected constructor(private props: CategoryProps) {}

  static create(props: CategoryProps): Category {
    return new Category(props)
  }

  static fromProps(props: CategoryProps): Category {
    return new Category(props)
  }

  get id() {
    return this.props.id
  }
  get name() {
    return this.props.name
  }
  get slug() {
    return this.props.slug
  }
  get description() {
    return this.props.description
  }
  get icon() {
    return this.props.icon
  }
  get sortOrder() {
    return this.props.sortOrder
  }
}
