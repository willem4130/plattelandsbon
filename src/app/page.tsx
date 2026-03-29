'use client'

import { api } from '@/trpc/react'
import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturedVouchers } from '@/components/landing/featured-vouchers'
import { FeaturedBusinesses } from '@/components/landing/featured-businesses'
import { HowItWorks } from '@/components/landing/how-it-works'
import { BusinessCTA } from '@/components/landing/business-cta'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  const { data: vouchers } = api.vouchers.listActive.useQuery()
  const { data: businesses } = api.businesses.listVerified.useQuery()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
      <Navbar />
      <HeroSection voucherCount={vouchers?.length} businessCount={businesses?.length} />
      <HowItWorks />
      <FeaturedVouchers vouchers={vouchers} />
      <FeaturedBusinesses businesses={businesses} />
      <BusinessCTA />
      <Footer />
    </div>
  )
}
