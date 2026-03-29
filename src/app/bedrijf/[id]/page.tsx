'use client'

import Link from 'next/link'
import { use } from 'react'
import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import {
  TreePine,
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Ticket,
} from 'lucide-react'

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business, isLoading } = api.businesses.getById.useQuery({ id })
  const { data: allVouchers } = api.vouchers.listActive.useQuery()

  const businessVouchers = allVouchers?.filter((v) => v.businessId === id)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <p className="text-muted-foreground">Bedrijf laden...</p>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <p className="text-lg font-semibold">Bedrijf niet gevonden</p>
        <Link href="/"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Terug naar overzicht</Button></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="container mx-auto flex h-14 items-center gap-4 px-4">
          <Link href="/bedrijven" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Alle bedrijven
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <TreePine className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Oom Gerrit</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        {/* Business header */}
        <h1 className="text-3xl font-bold md:text-4xl">{business.name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {business.city && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {business.city}{business.province ? `, ${business.province}` : ''}
            </span>
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              {business.phone}
            </a>
          )}
          {business.website && (
            <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Globe className="h-4 w-4" />
              Website
            </a>
          )}
        </div>

        {/* Description */}
        {business.description && (
          <div className="mt-6 glossy-card">
            <p className="leading-relaxed">{business.description}</p>
          </div>
        )}

        {/* Address */}
        {business.address && (
          <div className="mt-4 glossy-card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Adres</h2>
            <p className="mt-1 text-sm">
              {business.address}
              {business.postalCode ? `, ${business.postalCode}` : ''} {business.city}
            </p>
          </div>
        )}

        {/* Vouchers */}
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">
              Bonnen van {business.name}
            </h2>
          </div>

          {businessVouchers && businessVouchers.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {businessVouchers.map((v) => {
                const discount = v.discountType === 'CASH' && v.discountValue
                  ? `€${v.discountValue}`
                  : v.discountType === 'PERCENTAGE' && v.discountValue
                  ? `${v.discountValue}%`
                  : 'Gratis'
                return (
                  <Link key={v.id} href={`/bon/${v.id}`}>
                    <div className="glass group overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer">
                      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-600" />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold leading-tight">{v.title}</p>
                          <span className="shrink-0 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 px-2.5 py-1 text-sm font-bold text-white shadow-md">
                            {discount}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{v.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Geen bonnen beschikbaar op dit moment.</p>
          )}
        </div>
      </div>
    </div>
  )
}
