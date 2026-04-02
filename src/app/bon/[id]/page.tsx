import type { Metadata } from 'next'
import { api, trpc, HydrateClient } from '@/trpc/server'
import { VoucherDetailContent } from '@/components/voucher/voucher-detail-content'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const voucher = await api.vouchers.getById({ id })

  if (!voucher) {
    return { title: 'Bon niet gevonden' }
  }

  const discount = voucher.discountType === 'CASH' && voucher.discountValue
    ? `\u20AC${voucher.discountValue} korting`
    : voucher.discountType === 'PERCENTAGE' && voucher.discountValue
    ? `${voucher.discountValue}% korting`
    : 'Korting'

  const description = `${discount} bij ${voucher.businessName}${voucher.city ? ` in ${voucher.city}` : ''}. ${voucher.description.slice(0, 120)}`

  return {
    title: voucher.title,
    description,
    openGraph: {
      title: `${voucher.title} — ${discount}`,
      description,
    },
  }
}

export default async function VoucherDetailPage({ params }: Props) {
  const { id } = await params

  void trpc.vouchers.getById.prefetch({ id })

  return (
    <HydrateClient>
      <VoucherDetailContent params={params} />
    </HydrateClient>
  )
}
