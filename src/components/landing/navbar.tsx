'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TreePine, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { navLinks } from './constants'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-2">
              <TreePine className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold">Plattelandsbon</p>
              <p className="text-[11px] text-muted-foreground">De beste tips van &apos;t platteland</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/voor-ondernemers">
              <Button variant="ghost" size="sm">Ondernemer? Meld je aan</Button>
            </Link>
            <Link href="/business/vouchers">
              <Button size="sm" className="shadow-lg shadow-primary/25">
                Mijn bonnen
              </Button>
            </Link>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  <Link href="/register/business" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Ondernemer? Meld je aan</Button>
                  </Link>
                  <Link href="/business/vouchers" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Mijn bonnen</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
