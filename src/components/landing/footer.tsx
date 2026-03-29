import Link from 'next/link'
import { TreePine } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 p-1.5">
            <TreePine className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">Plattelandsbon</span>
          <span className="text-xs text-muted-foreground">&mdash; Proef, beleef en geniet van de Achterhoek</span>
        </div>
        <nav className="flex gap-6 text-xs text-muted-foreground">
          <Link href="/bonnen" className="hover:text-foreground transition-colors">Bonnen</Link>
          <Link href="/bedrijven" className="hover:text-foreground transition-colors">Bedrijven</Link>
          <Link href="/register/business" className="hover:text-foreground transition-colors">Voor ondernemers</Link>
          <Link href="/admin/businesses" className="hover:text-foreground transition-colors">Admin</Link>
        </nav>
        <p className="text-xs text-muted-foreground">&copy; 2026 Oom Gerrit</p>
      </div>
    </footer>
  )
}
