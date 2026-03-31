'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Phone, Globe, Ticket } from 'lucide-react'
import { api } from '@/trpc/react'
import { RouteModal } from './route-modal'
import { categoryMeta } from '@/components/landing/constants'

export function BusinessModalContent({ id }: { id: string }) {
  const router = useRouter()
  const { data: allBusinesses } = api.businesses.listVerified.useQuery()
  const { data: allVouchers } = api.vouchers.listActive.useQuery()

  // Use placeholderData from cached list so modal renders instantly
  // Fill missing fields with defaults so type matches BusinessResponseDTO
  const { data: business } = api.businesses.getById.useQuery({ id }, {
    placeholderData: () => {
      const cached = allBusinesses?.find((b) => b.id === id)
      if (!cached) return undefined
      return {
        ...cached,
        userId: '',
        address: null,
        postalCode: null,
        status: 'VERIFIED' as const,
        verifiedAt: null,
        verificationNotes: null,
        logo: null,
        categoryIds: cached.categories,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
  })

  // Get category info from the list cache (has slugs + names), since getById only has UUIDs
  const cachedBusiness = allBusinesses?.find((b) => b.id === id)

  const currentIndex = allBusinesses?.findIndex((b) => b.id === id) ?? -1
  const prevId = currentIndex > 0 ? allBusinesses?.[currentIndex - 1]?.id : undefined
  const nextId = allBusinesses && currentIndex < allBusinesses.length - 1 ? allBusinesses[currentIndex + 1]?.id : undefined

  const businessVouchers = allVouchers?.filter((v) => v.businessId === id) ?? []

  if (!business) {
    return (
      <RouteModal title="Laden..." itemId={id} fullPageHref={`/bedrijf/${id}`}>
        <div className="py-12 text-center text-muted-foreground">Bedrijf laden...</div>
      </RouteModal>
    )
  }

  const catSlug = cachedBusiness?.categories[0] ?? 'restaurants'
  const meta = categoryMeta[catSlug] ?? categoryMeta['restaurants']!
  const Icon = meta.icon

  return (
    <RouteModal
      title={business.name}
      itemId={id}
      fullPageHref={`/bedrijf/${id}`}
      hasPrev={!!prevId}
      hasNext={!!nextId}
      onPrev={() => prevId && router.replace(`/bedrijf/${prevId}`)}
      onNext={() => nextId && router.replace(`/bedrijf/${nextId}`)}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{business.name}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {business.city}{business.province ? `, ${business.province}` : ''}
          </div>
        </div>
      </div>

      {business.description && (
        <p className="mt-4 text-sm leading-relaxed">{business.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {business.phone && (
          <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="h-3.5 w-3.5" />
            {business.phone}
          </a>
        )}
        {business.website && (
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
      </div>

      {cachedBusiness?.categoryNames && cachedBusiness.categoryNames.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {cachedBusiness.categoryNames.map((name) => (
            <span key={name} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{name}</span>
          ))}
        </div>
      )}

      {businessVouchers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bonnen ({businessVouchers.length})
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {businessVouchers.map((v) => (
              <Link
                key={v.id}
                href={`/bon/${v.id}`}
                className="flex items-center justify-between rounded-xl bg-muted/50 p-3 hover:bg-muted transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{v.title}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Ticket className="h-3 w-3" />
                  {v.discountType === 'CASH' && v.discountValue ? `\u20AC${v.discountValue}` : v.discountType === 'PERCENTAGE' && v.discountValue ? `${v.discountValue}%` : 'Gratis'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </RouteModal>
  )
}
