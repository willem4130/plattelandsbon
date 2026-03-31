'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Ticket, Building2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { useQueryClient } from '@tanstack/react-query'
import { RouteModal } from './route-modal'

function getDiscountDisplay(v: { discountType: string; discountValue: number | null; discountDescription: string | null }) {
  if (v.discountType === 'CASH' && v.discountValue) return `\u20AC${v.discountValue} korting`
  if (v.discountType === 'PERCENTAGE' && v.discountValue) return `${v.discountValue}%  korting`
  return v.discountDescription ?? 'Gratis'
}

export function VoucherModalContent({ id }: { id: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: allVouchers } = api.vouchers.listActive.useQuery()

  // Use placeholderData from cached list so modal renders instantly
  // getById still fetches in background for extra fields (minimumPurchase, remainingClaims)
  const { data: voucher } = api.vouchers.getById.useQuery({ id }, {
    placeholderData: () => {
      const cached = allVouchers?.find((v) => v.id === id)
      if (!cached) return undefined
      return {
        ...cached,
        minimumPurchase: null,
        remainingClaims: cached.maxClaims !== null ? cached.maxClaims - cached.claimsCount : null,
        status: 'ACTIVE' as const,
        slug: cached.slug ?? '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    },
  })

  const currentIndex = allVouchers?.findIndex((v) => v.id === id) ?? -1
  const prevId = currentIndex > 0 ? allVouchers?.[currentIndex - 1]?.id : undefined
  const nextId = allVouchers && currentIndex < allVouchers.length - 1 ? allVouchers[currentIndex + 1]?.id : undefined

  if (!voucher) {
    return (
      <RouteModal title="Laden..." itemId={id} fullPageHref={`/bon/${id}`}>
        <div className="py-12 text-center text-muted-foreground">Bon laden...</div>
      </RouteModal>
    )
  }

  const discountDisplay = getDiscountDisplay(voucher)

  return (
    <RouteModal
      title={voucher.title}
      itemId={id}
      fullPageHref={`/bon/${id}`}
      hasPrev={!!prevId}
      hasNext={!!nextId}
      onPrev={() => prevId && router.replace(`/bon/${prevId}`)}
      onNext={() => nextId && router.replace(`/bon/${nextId}`)}
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
        <Ticket className="h-3.5 w-3.5" />
        {discountDisplay}
      </div>

      <h2 className="mt-4 text-2xl font-bold">{voucher.title}</h2>

      <Link href={`/bedrijf/${voucher.businessId}`} className="mt-3 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">{voucher.businessName}</span>
        {voucher.city && (
          <>
            <MapPin className="ml-1 h-3.5 w-3.5" />
            <span className="text-sm">{voucher.city}</span>
          </>
        )}
      </Link>

      {voucher.description && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Beschrijving</h3>
          <p className="mt-2 text-sm leading-relaxed">{voucher.description}</p>
        </div>
      )}

      {voucher.terms && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Voorwaarden</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{voucher.terms}</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {voucher.minimumPurchase && (
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Minimale besteding</p>
            <p className="mt-0.5 text-base font-bold">&euro;{voucher.minimumPurchase}</p>
          </div>
        )}
        {voucher.remainingClaims !== null && (
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Nog beschikbaar</p>
            <p className="mt-0.5 text-base font-bold">{voucher.remainingClaims}x</p>
          </div>
        )}
        {voucher.startDate && (
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Geldig vanaf
            </div>
            <p className="mt-0.5 text-sm font-medium">{new Date(voucher.startDate).toLocaleDateString('nl-NL')}</p>
          </div>
        )}
        {voucher.endDate && (
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Geldig t/m
            </div>
            <p className="mt-0.5 text-sm font-medium">{new Date(voucher.endDate).toLocaleDateString('nl-NL')}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          className="w-full shadow-lg shadow-primary/25"
          onClick={() => { window.location.href = `/bon/${id}` }}
        >
          <Ticket className="mr-2 h-4 w-4" />
          Claim deze bon
        </Button>
      </div>
    </RouteModal>
  )
}
