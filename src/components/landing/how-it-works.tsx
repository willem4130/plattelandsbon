import { Search, Ticket, PartyPopper, ArrowRight } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Ontdek', desc: 'Blader door bonnen in de Achterhoek. Filter op categorie of zoek op stad.', gradient: 'from-emerald-500 to-green-600' },
  { icon: Ticket, title: 'Claim je bon', desc: 'Gratis account, unieke code. Geen addertje onder het gras.', gradient: 'from-amber-500 to-orange-600' },
  { icon: PartyPopper, title: 'Ga genieten', desc: 'Toon je code bij de ondernemer en geniet van je korting.', gradient: 'from-teal-500 to-cyan-600' },
]

export function HowItWorks() {
  return (
    <section id="zo-werkt-het" className="container mx-auto px-4 py-14 lg:py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Zo werkt het</h2>
        <p className="mt-2 text-muted-foreground">In drie stappen van bon naar beleving</p>
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
  )
}
