'use client'

import Link from 'next/link'
import { use } from 'react'
import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import {
  TreePine,
  ArrowLeft,
  MapPin,
  Calendar,
  Ticket,
  Building2,
} from 'lucide-react'

export default function VoucherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: voucher, isLoading } = api.vouchers.getById.useQuery({ id })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <p className="text-muted-foreground">Bon laden...</p>
      </div>
    )
  }

  if (!voucher) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <p className="text-lg font-semibold">Bon niet gevonden</p>
        <Link href="/"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Terug naar overzicht</Button></Link>
      </div>
    )
  }

  const discountDisplay = voucher.discountType === 'CASH' && voucher.discountValue
    ? `€${voucher.discountValue} korting`
    : voucher.discountType === 'PERCENTAGE' && voucher.discountValue
    ? `${voucher.discountValue}% korting`
    : voucher.discountDescription ?? 'Gratis'

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="container mx-auto flex h-14 items-center gap-4 px-4">
          <Link href="/#bonnen" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Alle bonnen
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <TreePine className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Oom Gerrit</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Discount badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Ticket className="h-4 w-4" />
          {discountDisplay}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold md:text-4xl">{voucher.title}</h1>

        {/* Business info */}
        <Link href={`/bedrijf/${voucher.businessId}`} className="mt-4 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Building2 className="h-4 w-4" />
          <span className="text-sm font-medium">{voucher.businessName}</span>
          {voucher.city && (
            <>
              <MapPin className="ml-2 h-3.5 w-3.5" />
              <span className="text-sm">{voucher.city}</span>
            </>
          )}
        </Link>

        {/* Description */}
        <div className="mt-8 glossy-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Beschrijving</h2>
          <p className="mt-2 leading-relaxed">{voucher.description}</p>
        </div>

        {/* Terms */}
        {voucher.terms && (
          <div className="mt-4 glossy-card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Voorwaarden</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{voucher.terms}</p>
          </div>
        )}

        {/* Details grid */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {voucher.minimumPurchase && (
            <div className="glossy-card">
              <p className="text-xs text-muted-foreground">Minimale besteding</p>
              <p className="mt-1 text-lg font-bold">€{voucher.minimumPurchase}</p>
            </div>
          )}
          {voucher.remainingClaims !== null && (
            <div className="glossy-card">
              <p className="text-xs text-muted-foreground">Nog beschikbaar</p>
              <p className="mt-1 text-lg font-bold">{voucher.remainingClaims}x</p>
            </div>
          )}
          {voucher.startDate && (
            <div className="glossy-card">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Geldig vanaf
              </div>
              <p className="mt-1 text-sm font-medium">{new Date(voucher.startDate).toLocaleDateString('nl-NL')}</p>
            </div>
          )}
          {voucher.endDate && (
            <div className="glossy-card">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Geldig t/m
              </div>
              <p className="mt-1 text-sm font-medium">{new Date(voucher.endDate).toLocaleDateString('nl-NL')}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button size="lg" className="w-full shadow-lg shadow-primary/25 text-lg py-6">
            Claim deze bon
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Gratis — je ontvangt een unieke code om te tonen bij de ondernemer
          </p>
        </div>
      </div>
    </div>
  )
}
