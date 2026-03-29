import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BusinessCTA() {
  return (
    <section className="container mx-auto px-4 py-20 lg:py-32">
      <div className="overflow-hidden rounded-3xl relative">
        <div className="absolute inset-0">
          <Image src="/images/hero-path.jpg" alt="Zandpad door groene akkers" fill className="object-cover" />
          <div className="absolute inset-0 bg-white/75" />
        </div>
        <div className="relative border border-white/30 rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left lg:gap-12">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Voor ondernemers</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Laat je zaak zien aan{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">duizenden bezoekers</span>
              </h2>
              <p className="mt-3 max-w-lg text-sm text-gray-700">
                Gratis registreren. Eigen bonnen aanmaken. Meer klanten, minder moeite.
              </p>
              <div className="mt-6">
                <Link href="/register/business" className="glossy-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-medium hover:shadow-2xl transition-shadow">
                  Gratis aanmelden <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="mt-8 grid shrink-0 grid-cols-1 gap-2 lg:mt-0">
              {['Gratis zichtbaarheid', 'Eigen dashboard', 'Direct meer klanten'].map((item) => (
                <div key={item} className="glass-subtle flex items-center gap-3 rounded-xl px-4 py-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
