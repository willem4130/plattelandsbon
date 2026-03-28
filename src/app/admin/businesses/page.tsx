'use client'

import { useState } from 'react'
import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react'

const statusConfig = {
  PENDING: { label: 'In afwachting', variant: 'secondary' as const, icon: Clock },
  VERIFIED: { label: 'Geverifieerd', variant: 'default' as const, icon: CheckCircle2 },
  SUSPENDED: { label: 'Opgeschort', variant: 'destructive' as const, icon: XCircle },
  REJECTED: { label: 'Afgewezen', variant: 'destructive' as const, icon: XCircle },
}

export default function AdminBusinessesPage() {
  const [activeTab, setActiveTab] = useState('PENDING')
  const utils = api.useUtils()

  const { data: businesses, isLoading } = api.businesses.list.useQuery(
    { status: activeTab as 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED' },
  )

  const verifyMutation = api.businesses.verify.useMutation({
    onSuccess: () => {
      toast.success('Bedrijfsstatus bijgewerkt')
      void utils.businesses.list.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleVerify(businessId: string, approve: boolean) {
    verifyMutation.mutate({ businessId, approve })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bedrijven</h1>
        <p className="text-muted-foreground">
          Beheer bedrijfsregistraties en verificaties
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="PENDING">In afwachting</TabsTrigger>
          <TabsTrigger value="VERIFIED">Geverifieerd</TabsTrigger>
          <TabsTrigger value="SUSPENDED">Opgeschort</TabsTrigger>
          <TabsTrigger value="REJECTED">Afgewezen</TabsTrigger>
        </TabsList>

        {['PENDING', 'VERIFIED', 'SUSPENDED', 'REJECTED'].map((status) => (
          <TabsContent key={status} value={status}>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Laden...</p>
            ) : !businesses?.length ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Building2 className="mx-auto h-10 w-10 mb-3 opacity-50" />
                  <p>Geen bedrijven gevonden met status &quot;{statusConfig[status as keyof typeof statusConfig].label}&quot;</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {businesses.map((business) => {
                  const config = statusConfig[business.status]
                  return (
                    <Card key={business.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg">{business.name}</CardTitle>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {business.city && (
                            <div>
                              <span className="text-muted-foreground">Plaats: </span>
                              {business.city}
                            </div>
                          )}
                          {business.province && (
                            <div>
                              <span className="text-muted-foreground">Provincie: </span>
                              {business.province}
                            </div>
                          )}
                          {business.phone && (
                            <div>
                              <span className="text-muted-foreground">Telefoon: </span>
                              {business.phone}
                            </div>
                          )}
                          {business.website && (
                            <div>
                              <span className="text-muted-foreground">Website: </span>
                              <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                {business.website}
                              </a>
                            </div>
                          )}
                        </div>
                        {business.description && (
                          <p className="mt-3 text-sm text-muted-foreground">{business.description}</p>
                        )}

                        {business.status === 'PENDING' && (
                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleVerify(business.id, true)}
                              disabled={verifyMutation.isPending}
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Goedkeuren
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleVerify(business.id, false)}
                              disabled={verifyMutation.isPending}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Afwijzen
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
