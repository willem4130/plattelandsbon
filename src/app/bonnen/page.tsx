import type { Metadata } from 'next'
import { trpc, HydrateClient } from '@/trpc/server'
import { AllVouchersContent } from '@/components/voucher/all-vouchers-content'

export const metadata: Metadata = {
  title: 'Alle bonnen',
  description: 'Bekijk alle gratis kortingsbonnen in de Achterhoek. Van restaurants en wellness tot overnachtingen en activiteiten. Claim direct, geen account nodig.',
  openGraph: {
    title: 'Alle bonnen',
    description: 'Gratis kortingsbonnen voor de Achterhoek. Van Winterswijk tot Zutphen.',
  },
}

export default async function BonnenPage() {
  void trpc.vouchers.listActive.prefetch()

  return (
    <HydrateClient>
      <AllVouchersContent />
    </HydrateClient>
  )
}
