'use client'

import { api } from '@/trpc/react'
import { HeroSection } from './hero-section'
import { FeaturedVouchers } from './featured-vouchers'
import { FeaturedBusinesses } from './featured-businesses'

export function LandingData() {
  const { data: vouchers } = api.vouchers.listActive.useQuery()
  const { data: businesses } = api.businesses.listVerified.useQuery()

  return (
    <>
      <HeroSection voucherCount={vouchers?.length} businessCount={businesses?.length} />
      <FeaturedVouchers vouchers={vouchers} />
      <FeaturedBusinesses businesses={businesses} />
    </>
  )
}
