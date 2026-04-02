import type { Metadata } from 'next'
import { trpc, HydrateClient } from '@/trpc/server'
import { AllBusinessesContent } from '@/components/business/all-businesses-content'

export const metadata: Metadata = {
  title: 'Alle bedrijven',
  description: 'Ontdek restaurants, cafes, wellness, overnachtingen en activiteiten in de Achterhoek. Van Winterswijk tot Zutphen — de beste plekjes van het platteland.',
  openGraph: {
    title: 'Alle bedrijven',
    description: 'Ontdek de beste bedrijven in de Achterhoek op Plattelandsbon.',
  },
}

export default async function BedrijvenPage() {
  void trpc.businesses.listVerified.prefetch()

  return (
    <HydrateClient>
      <AllBusinessesContent />
    </HydrateClient>
  )
}
