import { VoucherModalContent } from '@/components/modal/voucher-modal-content'

export default async function VoucherModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <VoucherModalContent id={id} />
}
