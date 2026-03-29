'use client'

import Link from 'next/link'
import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  DRAFT: { label: 'Concept', variant: 'outline' },
  PENDING: { label: 'In beoordeling', variant: 'secondary' },
  ACTIVE: { label: 'Actief', variant: 'default' },
  PAUSED: { label: 'Gepauzeerd', variant: 'secondary' },
  EXPIRED: { label: 'Verlopen', variant: 'destructive' },
  REJECTED: { label: 'Afgewezen', variant: 'destructive' },
}

export default function BusinessVouchersPage() {
  const { data: vouchers, isLoading } = api.vouchers.listMine.useQuery()
  const utils = api.useUtils()

  const submitMutation = api.vouchers.submit.useMutation({
    onSuccess: () => {
      toast.success('Voucher ingediend ter beoordeling')
      void utils.vouchers.listMine.invalidate()
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mijn Vouchers</h1>
          <p className="text-muted-foreground">Beheer uw vouchers en aanbiedingen</p>
        </div>
        <Button asChild>
          <Link href="/business/vouchers/create">
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Voucher
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-8">Laden...</p>
      ) : !vouchers?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">U heeft nog geen vouchers aangemaakt</p>
            <Button asChild>
              <Link href="/business/vouchers/create">Eerste voucher aanmaken</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vouchers.map((voucher) => {
            const config = statusLabels[voucher.status] ?? { label: voucher.status, variant: 'outline' as const }
            return (
              <Card key={voucher.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{voucher.title}</CardTitle>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {voucher.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {voucher.discountType === 'CASH' && `€${voucher.discountValue} korting`}
                      {voucher.discountType === 'PERCENTAGE' && `${voucher.discountValue}% korting`}
                      {voucher.discountType === 'PRODUCT' && voucher.discountDescription}
                      {voucher.discountType === 'SERVICE' && voucher.discountDescription}
                    </span>
                    {voucher.maxClaims && (
                      <span>{voucher.claimsCount}/{voucher.maxClaims} claims</span>
                    )}
                  </div>
                  {voucher.status === 'DRAFT' && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        onClick={() => submitMutation.mutate({ voucherId: voucher.id })}
                        disabled={submitMutation.isPending}
                      >
                        Indienen ter beoordeling
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
