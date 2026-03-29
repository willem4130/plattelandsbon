import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categoryMeta } from './constants'
import type { BusinessItem } from './types'

export function BusinessCard({ business, className }: { business: BusinessItem; className?: string }) {
  const catSlug = business.categories[0] ?? 'restaurants'
  const meta = categoryMeta[catSlug] ?? categoryMeta['restaurants']!
  const Icon = meta.icon

  return (
    <Link href={`/bedrijf/${business.id}`} className={cn('block', className)}>
      <div className="glossy-card group cursor-pointer transition-shadow duration-300 hover:shadow-2xl">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{business.name}</p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {business.city}
            </div>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{business.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {business.categoryNames.map((name: string) => (
              <span key={name} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{name}</span>
            ))}
          </div>
          <span className="text-xs font-medium text-primary">{business.activeVoucherCount} bonnen</span>
        </div>
      </div>
    </Link>
  )
}
