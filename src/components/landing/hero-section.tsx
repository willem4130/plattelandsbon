'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { TreePine, Ticket, Building2, ArrowRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HeroSection({ voucherCount, businessCount }: { voucherCount?: number; businessCount?: number }) {
  const sectionRef = useRef<HTMLElement>(null)

  const onHeroImageLoad = () => {
    const cover = sectionRef.current?.querySelector('.hero-image-cover')
    if (cover) {
      gsap.to(cover, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' })
    }
  }

  useGSAP(() => {
    const el = sectionRef.current
    if (!el) return

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTl
      .fromTo(el.querySelector('.hero-glow'),
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.2 }, 0)
      .fromTo(el.querySelector('.hero-icon'),
        { scale: 0.8, autoAlpha: 0, y: 20 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.8')
      .fromTo(el.querySelectorAll('.hero-heading > *'),
        { y: 60, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.15 }, '-=0.5')
      .fromTo(el.querySelector('.hero-sub'),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 }, '-=0.4')
      .fromTo(el.querySelectorAll('.hero-cta > *'),
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')

    gsap.to(el.querySelector('.hero-glow'), {
      y: 150, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="hero-section relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/countryside-panoramic.jpg" alt="Panoramisch uitzicht over het Achterhoekse landschap" fill className="object-cover" priority onLoad={onHeroImageLoad} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90" />
        <div className="hero-image-cover absolute inset-0 bg-white" />
      </div>
      <main className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="hero-glow absolute inset-0 rounded-full bg-gradient-to-r from-emerald-200 to-amber-200 opacity-50 blur-3xl" />
            <div className="hero-icon glass relative rounded-3xl p-6">
              <TreePine className="h-12 w-12 text-emerald-700 md:h-16 md:w-16" />
            </div>
          </div>
          <div className="hero-heading mt-10 max-w-4xl">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Ontdek het beste van</span>
              <br />
              <span className="inline-block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">de Achterhoek</span>
            </h1>
          </div>
          <p className="hero-sub mx-auto mt-5 max-w-2xl text-base text-gray-600 text-balance md:text-lg lg:text-xl">
            Van Winterswijk tot Zutphen, van Groenlo tot Doetinchem — Oom Gerrit kent de lekkerste restaurants, gezelligste kroegen en mooiste plekjes.
          </p>
          <div className="hero-cta mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/bonnen" className="glossy-btn flex items-center gap-2 rounded-xl px-6 py-3 text-base font-medium hover:shadow-2xl transition-shadow">
              <Ticket className="h-4 w-4" />
              Bekijk alle {voucherCount ?? ''} bonnen
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/bedrijven" className="flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white/70 backdrop-blur-sm px-6 py-3 text-base font-medium hover:border-gray-400 hover:bg-white/90 transition-colors">
              <Building2 className="h-4 w-4" />
              {businessCount ?? ''} bedrijven
            </Link>
          </div>
        </div>
      </main>
    </section>
  )
}
