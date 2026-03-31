import { trpc, HydrateClient } from '@/trpc/server'
import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturedVouchers } from '@/components/landing/featured-vouchers'
import { FeaturedBusinesses } from '@/components/landing/featured-businesses'
import { HowItWorks } from '@/components/landing/how-it-works'
import { BusinessCTA } from '@/components/landing/business-cta'
import { Footer } from '@/components/landing/footer'
import { LandingData } from '@/components/landing/landing-data'

export default async function Home() {
  void trpc.vouchers.listActive.prefetch()
  void trpc.businesses.listVerified.prefetch()

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <Navbar />
        <LandingData />
        <HowItWorks />
        <BusinessCTA />
        <Footer />
      </div>
    </HydrateClient>
  )
}
