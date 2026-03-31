'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export default function RegisterBusinessPage() {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { data: categories, isLoading: categoriesLoading } = api.categories.list.useQuery()

  const registerMutation = api.businesses.register.useMutation({
    onSuccess: () => {
      toast.success('Bedrijf geregistreerd! Wacht op verificatie door de admin.')
      router.push('/business/vouchers')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleCategoryToggle(categoryId: string) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    registerMutation.mutate({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
      city: (formData.get('city') as string) || undefined,
      postalCode: (formData.get('postalCode') as string) || undefined,
      province: (formData.get('province') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      website: (formData.get('website') as string) || undefined,
      categoryIds: selectedCategories,
    })
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Registreer uw bedrijf</CardTitle>
          <CardDescription>
            Vul de gegevens van uw bedrijf in om vouchers te kunnen aanbieden op het Plattelandsbon platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Bedrijfsnaam *</Label>
              <Input id="name" name="name" required minLength={2} maxLength={100} placeholder="Uw bedrijfsnaam" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea id="description" name="description" maxLength={1000} placeholder="Vertel iets over uw bedrijf..." rows={4} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input id="address" name="address" placeholder="Straat en huisnummer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postcode</Label>
                <Input id="postalCode" name="postalCode" placeholder="1234 AB" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Plaats</Label>
                <Input id="city" name="city" placeholder="Plaats" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Provincie</Label>
                <Input id="province" name="province" placeholder="Provincie" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+31 6 12345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" type="url" placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Categorieën *</Label>
              <p className="text-sm text-muted-foreground">Selecteer minimaal één categorie</p>
              {categoriesLoading ? (
                <p className="text-sm text-muted-foreground">Categorieën laden...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {categories?.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending || selectedCategories.length === 0}
            >
              {registerMutation.isPending ? 'Registreren...' : 'Bedrijf registreren'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
