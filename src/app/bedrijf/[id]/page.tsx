import type { Metadata } from 'next'
import { api, trpc, HydrateClient } from '@/trpc/server'
import { BusinessDetailContent } from '@/components/business/business-detail-content'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const business = await api.businesses.getById({ id })

  if (!business) {
    return { title: 'Bedrijf niet gevonden' }
  }

  const description = business.description
    ? business.description.slice(0, 155)
    : `${business.name} in ${business.city ?? 'de Achterhoek'} — bekijk bonnen en kortingen op Plattelandsbon.`

  return {
    title: business.name,
    description,
    openGraph: {
      title: business.name,
      description,
    },
  }
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params

  void trpc.businesses.getById.prefetch({ id })
  void trpc.businesses.listVerified.prefetch()
  void trpc.vouchers.listActive.prefetch()

  return (
    <HydrateClient>
      <BusinessDetailContent params={params} />
    </HydrateClient>
  )
}
