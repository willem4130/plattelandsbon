import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categoryMeta, getDiscountLabel } from './constants'
import type { VoucherItem } from './types'

export function VoucherCard({ voucher, className }: { voucher: VoucherItem; className?: string }) {
  const label = getDiscountLabel(voucher)
  const catSlug = voucher.categories[0] ?? 'restaurants'
  const meta = categoryMeta[catSlug] ?? categoryMeta['restaurants']!

  return (
    <Link href={`/bon/${voucher.id}`} className={cn('block', className)}>
      <div className="glass group cursor-pointer overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-2xl">
        <div className={`h-1.5 bg-gradient-to-r ${meta.gradient}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">{voucher.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{voucher.businessName}</p>
            </div>
            <div className={`shrink-0 rounded-lg bg-gradient-to-br ${meta.gradient} px-2.5 py-1.5 text-center shadow-md`}>
              <span className="block text-sm font-bold leading-none text-white">{label.text}</span>
              <span className="block text-[9px] font-medium uppercase tracking-wide text-white/80">{label.sub}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {voucher.city}
          </div>
        </div>
      </div>
    </Link>
  )
}
