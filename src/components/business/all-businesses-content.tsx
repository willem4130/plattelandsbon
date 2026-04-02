'use client'

import { useState, useMemo } from 'react'
import { MapPin } from 'lucide-react'
import { api } from '@/trpc/react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { BusinessCard } from '@/components/landing/business-card'
import { categoryMeta, categoryLabels } from '@/components/landing/constants'

export function AllBusinessesContent() {
  const { data: businesses } = api.businesses.listVerified.useQuery()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeCity, setActiveCity] = useState<string | null>(null)

  const cities = useMemo(() => {
    if (!businesses) return []
    return [...new Set(businesses.map((b) => b.city))].sort()
  }, [businesses])

  const filtered = useMemo(() => {
    let result = businesses
    if (activeCategory) {
      result = result?.filter((b) => b.categories.includes(activeCategory))
    }
    if (activeCity) {
      result = result?.filter((b) => b.city === activeCity)
    }
    return result
  }, [businesses, activeCategory, activeCity])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
      <Navbar />
      <main className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">Alle bedrijven</h1>
          <p className="mt-2 text-muted-foreground">{filtered?.length ?? 0} bedrijven in de Achterhoek</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${!activeCategory ? 'bg-primary text-white shadow-md' : 'bg-white/70 text-muted-foreground hover:bg-white'}`}
          >
            Alle types
          </button>
          {Object.entries(categoryMeta).map(([slug, meta]) => {
            const Icon = meta.icon
            return (
              <button
                key={slug}
                onClick={() => setActiveCategory(activeCategory === slug ? null : slug)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeCategory === slug ? 'bg-primary text-white shadow-md' : 'bg-white/70 text-muted-foreground hover:bg-white'}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {categoryLabels[slug]}
              </button>
            )
          })}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCity(null)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${!activeCity ? 'bg-primary text-white shadow-md' : 'bg-white/70 text-muted-foreground hover:bg-white'}`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Alle plaatsen
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(activeCity === city ? null : city)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeCity === city ? 'bg-primary text-white shadow-md' : 'bg-white/70 text-muted-foreground hover:bg-white'}`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered?.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
        {!businesses && (
          <div className="py-12 text-center text-muted-foreground">Bedrijven laden...</div>
        )}
        {businesses && filtered?.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Geen bedrijven gevonden met deze filters.
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
