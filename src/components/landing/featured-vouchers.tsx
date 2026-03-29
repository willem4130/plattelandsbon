'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { VoucherCard } from './voucher-card'
import { useCarouselWheel } from './use-carousel-wheel'
import { categoryMeta, categoryLabels } from './constants'
import type { VoucherItem } from './types'

function pairItems<T>(items: T[]): [T, T | undefined][] {
  const pairs: [T, T | undefined][] = []
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i]!, items[i + 1]])
  }
  return pairs
}

export function FeaturedVouchers({ vouchers }: { vouchers?: VoucherItem[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const wheelRef = useCarouselWheel(api)

  if (!vouchers?.length) return null

  const filtered = activeCategory
    ? vouchers.filter((v) => v.categories.includes(activeCategory))
    : vouchers
  const pairs = pairItems(filtered)

  return (
    <section className="container mx-auto px-4 py-10 lg:py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Nieuwste bonnen</h2>
          <p className="mt-2 text-muted-foreground">De laatste aanbiedingen uit de Achterhoek</p>
        </div>
        <Link href="/bonnen" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">
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
      <div ref={wheelRef}>
        <Carousel
          opts={{ loop: true, align: 'start', dragFree: false }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {pairs.map(([top, bottom], i) => (
              <CarouselItem key={i} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <div className="flex flex-col gap-4">
                  <VoucherCard voucher={top} />
                  {bottom && <VoucherCard voucher={bottom} />}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 lg:-left-12 h-10 w-10 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:bg-white" />
          <CarouselNext className="-right-4 lg:-right-12 h-10 w-10 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:bg-white" />
        </Carousel>
      </div>
      <Link href="/bonnen" className="mt-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden">
        Bekijk alle bonnen <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}
