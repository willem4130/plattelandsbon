import {
  UtensilsCrossed,
  Beer,
  Sparkles,
  Bed,
  Bike,
} from 'lucide-react'

export const categoryMeta: Record<
  string,
  { icon: typeof UtensilsCrossed; gradient: string; tagline: string }
> = {
  restaurants: { icon: UtensilsCrossed, gradient: 'from-amber-500 to-orange-600', tagline: 'Proef het platteland' },
  bars: { icon: Beer, gradient: 'from-orange-500 to-red-500', tagline: 'Gezelligheid op z\'n best' },
  wellness: { icon: Sparkles, gradient: 'from-teal-500 to-cyan-600', tagline: 'Even tot rust komen' },
  accommodaties: { icon: Bed, gradient: 'from-sky-500 to-blue-600', tagline: 'Wakker worden in het groen' },
  activiteiten: { icon: Bike, gradient: 'from-emerald-500 to-green-600', tagline: 'Eropuit en beleven' },
}

export const categoryLabels: Record<string, string> = {
  restaurants: 'Restaurants',
  bars: 'Bars & Cafes',
  wellness: 'Wellness',
  accommodaties: 'Overnachten',
  activiteiten: 'Activiteiten',
}

export function getDiscountLabel(v: { discountType: string; discountValue: number | null; discountDescription: string | null }) {
  if (v.discountType === 'CASH' && v.discountValue) return { text: `\u20AC${v.discountValue}`, sub: 'korting' }
  if (v.discountType === 'PERCENTAGE' && v.discountValue) return { text: `${v.discountValue}%`, sub: 'korting' }
  if (v.discountType === 'PRODUCT') return { text: 'Gratis', sub: 'product' }
  if (v.discountType === 'SERVICE') return { text: 'Gratis', sub: 'service' }
  return { text: '?', sub: '' }
}

export const navLinks = [
  { href: '/bonnen', label: 'Alle bonnen' },
  { href: '/bedrijven', label: 'Bedrijven' },
  { href: '/admin/businesses', label: 'Admin' },
]
