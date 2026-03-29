'use client'

import { useState } from 'react'
import { api } from '@/trpc/react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { VoucherCard } from '@/components/landing/voucher-card'
import { categoryMeta, categoryLabels } from '@/components/landing/constants'

export default function BonnenPage() {
  const { data: vouchers } = api.vouchers.listActive.useQuery()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? vouchers?.filter((v) => v.categories.includes(activeCategory))
    : vouchers

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
      <Navbar />
      <main className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">Alle bonnen</h1>
          <p className="mt-2 text-muted-foreground">{filtered?.length ?? 0} bonnen beschikbaar</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${!activeCategory ? 'bg-primary text-white shadow-md' : 'bg-white/70 text-muted-foreground hover:bg-white'}`}
          >
            Alles
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered?.map((v) => (
            <VoucherCard key={v.id} voucher={v} />
          ))}
        </div>
        {!vouchers && (
          <div className="py-12 text-center text-muted-foreground">Bonnen laden...</div>
        )}
      </main>
      <Footer />
    </div>
  )
}
