'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BusinessCard } from './business-card'
import { categoryMeta, categoryLabels } from './constants'
import type { BusinessItem } from './types'

function pairItems<T>(items: T[]): [T, T | undefined][] {
  const pairs: [T, T | undefined][] = []
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i]!, items[i + 1]])
  }
  return pairs
}

export function FeaturedBusinesses({ businesses }: { businesses?: BusinessItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? businesses?.filter((b) => b.categories.includes(activeCategory)) ?? []
    : businesses ?? []
  const pairs = pairItems(filtered)

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector(':scope > div')?.clientWidth ?? 300
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: 'smooth' })
  }

  if (!businesses?.length) return null

  return (
    <section className="container mx-auto px-4 py-10 lg:py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Deelnemende bedrijven</h2>
          <p className="mt-2 text-muted-foreground">Ontdek de mooiste plekken van de Achterhoek</p>
        </div>
        <Link href="/bedrijven" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">
          Bekijk alles <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
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
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {pairs.map(([top, bottom], i) => (
            <div key={i} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
              <div className="flex flex-col gap-4">
                <BusinessCard business={top} />
                {bottom && <BusinessCard business={bottom} />}
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:bg-white z-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll(1)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:bg-white z-10"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <Link href="/bedrijven" className="mt-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden">
        Bekijk alle bedrijven <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}
