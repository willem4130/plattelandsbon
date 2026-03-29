'use client'

import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Ticket } from 'lucide-react'

export default function AdminPendingVouchersPage() {
  const { data: vouchers, isLoading } = api.vouchers.listPending.useQuery()
  const utils = api.useUtils()

  const approveMutation = api.vouchers.approve.useMutation({
    onSuccess: () => {
      toast.success('Voucher goedgekeurd')
      void utils.vouchers.listPending.invalidate()
    },
    onError: (error) => toast.error(error.message),
  })

  const rejectMutation = api.vouchers.reject.useMutation({
    onSuccess: () => {
      toast.success('Voucher afgewezen')
      void utils.vouchers.listPending.invalidate()
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voucher Goedkeuring</h1>
        <p className="text-muted-foreground">Beoordeel ingediende vouchers</p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-8">Laden...</p>
      ) : !vouchers?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Ticket className="mx-auto h-10 w-10 mb-3 opacity-50" />
            <p>Geen vouchers wachten op goedkeuring</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vouchers.map((voucher) => (
            <Card key={voucher.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{voucher.title}</CardTitle>
                <Badge variant="secondary">In beoordeling</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{voucher.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    {voucher.discountType === 'CASH' && `€${voucher.discountValue} korting`}
                    {voucher.discountType === 'PERCENTAGE' && `${voucher.discountValue}% korting`}
                    {voucher.discountType === 'PRODUCT' && voucher.discountDescription}
                    {voucher.discountType === 'SERVICE' && voucher.discountDescription}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Geldig: </span>
                    {new Date(voucher.startDate).toLocaleDateString('nl-NL')} — {new Date(voucher.endDate).toLocaleDateString('nl-NL')}
                  </div>
                  {voucher.maxClaims && (
                    <div>
                      <span className="text-muted-foreground">Max claims: </span>
                      {voucher.maxClaims}
                    </div>
                  )}
                  {voucher.terms && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Voorwaarden: </span>
                      {voucher.terms}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate({ voucherId: voucher.id })}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Goedkeuren
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => rejectMutation.mutate({ voucherId: voucher.id })}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Afwijzen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
