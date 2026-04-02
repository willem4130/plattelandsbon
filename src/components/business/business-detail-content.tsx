'use client'

import Link from 'next/link'
import { use } from 'react'
import { api } from '@/trpc/react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { VoucherCard } from '@/components/landing/voucher-card'
import { categoryMeta } from '@/components/landing/constants'
import {
  MapPin,
  Phone,
  Globe,
  Ticket,
  ArrowLeft,
} from 'lucide-react'

export function BusinessDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: business, isLoading } = api.businesses.getById.useQuery({ id })
  const { data: allBusinesses } = api.businesses.listVerified.useQuery()
  const { data: allVouchers } = api.vouchers.listActive.useQuery()

  // Category info from browse cache (has slugs + names)
  const cachedBusiness = allBusinesses?.find((b) => b.id === id)
  const businessVouchers = allVouchers?.filter((v) => v.businessId === id) ?? []

  const catSlug = cachedBusiness?.categories[0] ?? 'restaurants'
  const meta = categoryMeta[catSlug] ?? categoryMeta['restaurants']!
  const Icon = meta.icon

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Bedrijf laden...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold">Bedrijf niet gevonden</p>
          <Link href="/bedrijven" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Terug naar bedrijven
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description ?? undefined,
    address: business.address ? {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      postalCode: business.postalCode ?? undefined,
      addressLocality: business.city ?? undefined,
      addressRegion: business.province ?? undefined,
      addressCountry: 'NL',
    } : undefined,
    telephone: business.phone ?? undefined,
    url: business.website ?? undefined,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="container mx-auto max-w-4xl px-4 py-12 lg:py-16">
        {/* Back link */}
        <Link href="/bedrijven" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Alle bedrijven
        </Link>

        {/* Business header */}
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{business.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {business.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {business.city}{business.province ? `, ${business.province}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category badges */}
        {cachedBusiness?.categoryNames && cachedBusiness.categoryNames.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cachedBusiness.categoryNames.map((name) => (
              <span key={name} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {business.description && (
          <div className="mt-8 glossy-card">
            <p className="leading-relaxed text-gray-700">{business.description}</p>
          </div>
        )}

        {/* Contact & address */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(business.address || business.postalCode) && (
            <div className="glossy-card">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Adres</h2>
              <p className="mt-2 text-sm">
                {business.address}
                {business.postalCode && <><br />{business.postalCode} {business.city}</>}
              </p>
            </div>
          )}

          {(business.phone || business.website) && (
            <div className="glossy-card">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</h2>
              <div className="mt-2 flex flex-col gap-2">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {business.phone}
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {business.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vouchers */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Ticket className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Bonnen van {business.name}</h2>
          </div>

          {businessVouchers.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {businessVouchers.map((v) => (
                <VoucherCard key={v.id} voucher={v} />
              ))}
            </div>
          ) : (
            <div className="glossy-card text-center py-8">
              <Ticket className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                Geen bonnen beschikbaar op dit moment.
              </p>
              <Link href="/bonnen" className="mt-3 inline-block text-sm text-primary hover:underline">
                Bekijk alle bonnen
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
