import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  HandCoins,
  Settings2,
  Users,
  Eye,
  UserPlus,
  Ticket,
  PartyPopper,
  Handshake,
} from 'lucide-react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'Voor ondernemers — Plattelandsbon',
  description: 'Gratis zichtbaarheid voor jouw zaak in de Achterhoek. Geen commissie, eigen bonnen, meer gasten. Meld je aan bij Plattelandsbon.',
}

const benefits = [
  {
    icon: HandCoins,
    title: 'Geen commissie op je omzet',
    desc: 'Andere platforms houden 35 tot 50 procent van je omzet in. Bij Plattelandsbon is alles gratis. Jij houdt wat je verdient.',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    icon: Settings2,
    title: 'Jij bepaalt het aanbod',
    desc: 'Eigen bonnen, eigen prijzen, eigen voorwaarden. Geen druk van buitenaf. Jij kent je gasten het beste.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'Gasten die terugkomen',
    desc: 'Geen koopjesjagers die je nooit meer ziet. Een bon is een kennismaking — de kwaliteit van jouw zaak doet de rest.',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    icon: Eye,
    title: 'Zichtbaarheid zonder gedoe',
    desc: 'Geen marketingexpertise nodig. Bon aanmaken, klaar. Wij zorgen dat bezoekers jouw zaak vinden.',
    gradient: 'from-sky-500 to-blue-600',
  },
]

const steps = [
  { icon: UserPlus, title: 'Meld je gratis aan', desc: 'Account aanmaken kost je vijf minuten. Geen kosten, geen verplichtingen.', gradient: 'from-emerald-500 to-green-600' },
  { icon: Ticket, title: 'Maak je bonnen aan', desc: 'Bepaal zelf je korting, voorwaarden en beschikbaarheid. Zo simpel als het klinkt.', gradient: 'from-amber-500 to-orange-600' },
  { icon: PartyPopper, title: 'Ontvang gasten', desc: 'Bezoekers claimen je bon en komen langs. Jij scant de code, zij genieten van de korting.', gradient: 'from-teal-500 to-cyan-600' },
]

export default function VoorOndernemersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
      <Navbar />

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center">
        <p className="text-sm font-medium text-primary">Voor ondernemers in de Achterhoek</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Zichtbaarheid voor jouw zaak,</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">zonder gedoe</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-gray-600 text-balance md:text-lg">
          Maak gratis bonnen aan voor je restaurant, cafe, wellness of activiteit. Geen commissie, geen kleine lettertjes. Gewoon meer gasten.
        </p>
        <div className="mt-8">
          <Link href="/register/business" className="glossy-btn inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium hover:shadow-2xl transition-shadow">
            Gratis aanmelden <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-14 lg:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Waarom Plattelandsbon?</h2>
          <p className="mt-2 text-muted-foreground">Geen poespas, gewoon goed voor jouw zaak</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="glossy-card">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${b.gradient} shadow-lg`}>
                <b.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-14 lg:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Zo werkt het</h2>
          <p className="mt-2 text-muted-foreground">In drie stappen van aanmelding naar nieuwe gasten</p>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center gap-0 md:flex-row md:items-start md:gap-0">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center md:flex-1">
                {i > 0 && (
                  <div className="flex flex-col items-center py-2 md:hidden">
                    <ArrowRight className="h-5 w-5 rotate-90 text-primary/40" />
                  </div>
                )}
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div className="hidden h-0.5 flex-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 md:block" />
                  )}
                  <div className="relative flex-shrink-0">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-lg ring-4 ring-white`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-muted-foreground shadow-sm ring-1 ring-border">
                      {i + 1}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden h-0.5 flex-1 rounded-full bg-gradient-to-r from-primary/40 to-primary/20 md:block" />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1.5 max-w-48 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community / Naoberschap */}
      <section className="container mx-auto px-4 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl glass rounded-3xl p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
            <Handshake className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold md:text-3xl">Scholder an scholder</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Plattelandsbon is meer dan een platform. Het is naoberschap in de praktijk. Samen de Achterhoek op de kaart zetten — door ondernemers, voor ondernemers.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            In Winterswijk, Neede en Ruurlo werken ondernemers al jaren met lokale bonnen. Plattelandsbon is de volgende stap: digitaal, regionaal, en gratis voor iedereen.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-14 lg:py-20 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">Aanpakken?</h2>
        <p className="mt-2 text-muted-foreground">Gratis aanmelden, eerste bon binnen vijf minuten online.</p>
        <div className="mt-6">
          <Link href="/register/business" className="glossy-btn inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium hover:shadow-2xl transition-shadow">
            Gratis aanmelden <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Vragen? Mail ons op info@plattelandsbon.nl
        </p>
      </section>

      <Footer />
    </div>
  )
}
