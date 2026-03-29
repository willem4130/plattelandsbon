import { randomUUID } from 'crypto'

export class SlugService {
  static generate(title: string): string {
    return title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // strip diacritics
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80)
  }

  static makeUnique(slug: string): string {
    const suffix = randomUUID().substring(0, 8)
    return `${slug}-${suffix}`
  }
}
