import { BusinessModalContent } from '@/components/modal/business-modal-content'

export default async function BusinessModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BusinessModalContent id={id} />
}
