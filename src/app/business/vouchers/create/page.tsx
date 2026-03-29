'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const createVoucherSchema = z.object({
  title: z.string().min(3, 'Titel moet minimaal 3 tekens zijn').max(200),
  description: z.string().min(10, 'Beschrijving moet minimaal 10 tekens zijn').max(2000),
  discountType: z.enum(['CASH', 'PERCENTAGE', 'PRODUCT', 'SERVICE']),
  discountValue: z.string().optional(),
  discountDescription: z.string().max(500).optional(),
  terms: z.string().max(2000).optional(),
  minimumPurchase: z.string().optional(),
  startDate: z.string().min(1, 'Startdatum is verplicht'),
  endDate: z.string().min(1, 'Einddatum is verplicht'),
  maxClaims: z.string().optional(),
})

type CreateVoucherForm = z.infer<typeof createVoucherSchema>

export default function CreateVoucherPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateVoucherForm>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: {
      discountType: 'CASH',
    },
  })

  const discountType = watch('discountType')
  const showValueField = discountType === 'CASH' || discountType === 'PERCENTAGE'
  const showDescriptionField = discountType === 'PRODUCT' || discountType === 'SERVICE'

  const createMutation = api.vouchers.create.useMutation({
    onSuccess: () => {
      toast.success('Voucher aangemaakt als concept')
      router.push('/business/vouchers')
    },
    onError: (error) => toast.error(error.message),
  })

  function onSubmit(data: CreateVoucherForm) {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    if (startDate >= endDate) {
      toast.error('Startdatum moet voor einddatum liggen')
      return
    }
    createMutation.mutate({
      title: data.title,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue ? Number(data.discountValue) : undefined,
      discountDescription: data.discountDescription || undefined,
      terms: data.terms || undefined,
      minimumPurchase: data.minimumPurchase ? Number(data.minimumPurchase) : undefined,
      startDate,
      endDate,
      maxClaims: data.maxClaims ? Number(data.maxClaims) : undefined,
    })
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Nieuwe Voucher</CardTitle>
          <CardDescription>
            Maak een nieuwe voucher aan. Deze wordt opgeslagen als concept totdat u hem indient ter beoordeling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input id="title" {...register('title')} placeholder="bijv. €10 korting op lunch menu" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschrijving *</Label>
              <Textarea id="description" {...register('description')} rows={4} placeholder="Beschrijf uw aanbieding..." />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Type korting *</Label>
              <Select value={discountType} onValueChange={(val) => setValue('discountType', val as CreateVoucherForm['discountType'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Vast bedrag (€)</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="PRODUCT">Gratis product</SelectItem>
                  <SelectItem value="SERVICE">Gratis dienst</SelectItem>
                </SelectContent>
              </Select>
              {errors.discountType && <p className="text-sm text-destructive">{errors.discountType.message}</p>}
            </div>

            {showValueField && (
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  {discountType === 'CASH' ? 'Kortingsbedrag (€)' : 'Kortingspercentage (%)'}
                </Label>
                <Input id="discountValue" type="number" step="0.01" {...register('discountValue')} placeholder={discountType === 'CASH' ? '10.00' : '20'} />
                {errors.discountValue && <p className="text-sm text-destructive">{errors.discountValue.message}</p>}
              </div>
            )}

            {showDescriptionField && (
              <div className="space-y-2">
                <Label htmlFor="discountDescription">Beschrijving korting *</Label>
                <Input id="discountDescription" {...register('discountDescription')} placeholder="bijv. 2e biertje gratis" />
                {errors.discountDescription && <p className="text-sm text-destructive">{errors.discountDescription.message}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="terms">Voorwaarden</Label>
              <Textarea id="terms" {...register('terms')} rows={3} placeholder="Eventuele voorwaarden..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumPurchase">Minimale besteding (��)</Label>
              <Input id="minimumPurchase" type="number" step="0.01" {...register('minimumPurchase')} placeholder="Optioneel" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Startdatum *</Label>
                <Input id="startDate" type="date" {...register('startDate')} />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Einddatum *</Label>
                <Input id="endDate" type="date" {...register('endDate')} />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxClaims">Maximaal aantal claims</Label>
              <Input id="maxClaims" type="number" {...register('maxClaims')} placeholder="Onbeperkt" />
            </div>

            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Aanmaken...' : 'Voucher aanmaken (concept)'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
