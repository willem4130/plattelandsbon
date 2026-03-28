# RESEARCH: Oom Gerrit — Dutch Rural Tourism Voucher Platform (Plattelandsbon)
Generated: 2026-03-28
Stack: Next.js 16 + React 19 + TypeScript 5.9 + PostgreSQL + Prisma 6 + tRPC v11 + Tailwind CSS 4 + Auth.js v5

## STACK VALIDATION

| Technology | Current | Recommended | Verdict |
|-----------|---------|-------------|---------|
| Next.js | ^16.0.1 | 16.2 | KEEP — stable, Turbopack default, 400% faster dev |
| React | ^19.2.0 | 19.2 | KEEP — Server Components + Actions stable |
| TypeScript | ^5.9.3 | 5.9 | KEEP — latest stable, `import defer` support |
| Prisma | ^6.19.0 | 6.19 | KEEP — pure TS engine, 3.4x faster queries |
| tRPC | ^11.0.0 | 11.12.0 | UPDATE — SSE support, fully stable |
| NextAuth | 5.0.0-beta.30 | 5.x (Auth.js) | KEEP — now maintained by Better Auth team |
| Tailwind CSS | ^3.4.18 | 4.1 | **UPGRADE** — Oxide engine, 10x faster, CSS-first config |
| Zod | ^4.1.12 | 4.x | KEEP — stable |
| Vitest | ^4.0.8 | 4.1.2 | UPDATE — stable Browser Mode |
| Playwright | ^1.56.1 | 1.58.2 | UPDATE |

### Breaking Changes Since Nov 2025
- **Next.js 16**: `params`, `searchParams`, `cookies()`, `headers()` are now async. Node.js 18 dropped; min 20.9+
- **Tailwind 4**: Config moves from JS to CSS (`@theme` directives). No `tailwind.config.ts` needed
- **tRPC v11**: Pages Router adapters dropped; use fetch adapter only
- **Prisma 6.6+**: Multi-file schema folder no longer auto-detected; must be explicit

## DEPENDENCIES TO ADD

| Package | Version | Purpose |
|---------|---------|---------|
| `nanoid` | 5.1.7 | Voucher claim code generation |
| `qrcode.react` | 4.2.0 | QR codes for voucher claims |
| `@react-email/components` | latest | Email template components |
| `react-email` | 5.2.10 | Email preview/dev server |
| `sharp` | 0.34.5 | Image optimization |
| `node-cron` | 4.2.1 | Scheduled scraping jobs |
| `cheerio` | 1.0.0 | HTML parsing for scraping |
| `@tailwindcss/postcss` | 4.1 | Tailwind v4 PostCSS plugin |

## DEPENDENCIES TO REMOVE

| Package | Reason |
|---------|--------|
| `@slack/web-api` | Template leftover — not needed |
| `cron` | Replace with `node-cron` |
| `tailwindcss` | Replaced by `@tailwindcss/postcss` in v4 |
| `tailwindcss-animate` | Incompatible with Tailwind v4; use native CSS |
| `autoprefixer` | Built into Tailwind v4 |

## DEPENDENCIES TO UPDATE

| Package | From | To |
|---------|------|-----|
| `@anthropic-ai/sdk` | ^0.71.0 | ^0.80.0 |

## TEMPLATE LEFTOVERS TO CLEAN

- `src/lib/simplicate/` — entire directory (Simplicate API client)
- `scripts/sync-simplicate.ts` — Simplicate sync script
- `test:simplicate` script in package.json
- Simplicate env vars in `src/env.js` and `.env.example`
- Sentry references (unless you want error tracking)

## PROJECT STRUCTURE (Onion Architecture)

```
src/
├── domain/                              # INNER CORE — zero external deps
│   ├── entities/
│   │   ├── Voucher.ts                   # Business rules: canRedeem(), isExpired()
│   │   ├── Business.ts
│   │   ├── Consumer.ts
│   │   ├── VoucherClaim.ts
│   │   └── CompetitorVoucher.ts
│   ├── value-objects/
│   │   ├── VoucherId.ts
│   │   ├── ClaimCode.ts                 # Generates 8-char nanoid
│   │   ├── VoucherStatus.ts             # DRAFT | PENDING | ACTIVE | EXPIRED | REJECTED
│   │   ├── DiscountType.ts              # CASH | PERCENTAGE | PRODUCT | SERVICE
│   │   └── Email.ts
│   ├── repositories/                    # INTERFACES ONLY — no Prisma!
│   │   ├── IVoucherRepository.ts
│   │   ├── IBusinessRepository.ts
│   │   ├── IClaimRepository.ts
│   │   ├── ICategoryRepository.ts
│   │   ├── ICompetitorRepository.ts
│   │   └── IRecommendationRepository.ts
│   ├── services/                        # Domain services (pure logic)
│   │   ├── VoucherValidationService.ts
│   │   ├── ClaimCodeService.ts
│   │   ├── FraudDetectionService.ts
│   │   └── RecommendationScoringService.ts
│   └── errors/
│       ├── DomainError.ts
│       ├── VoucherNotFoundError.ts
│       ├── ClaimLimitExceededError.ts
│       └── InvalidRedemptionError.ts
│
├── application/                         # USE CASES — orchestrates domain
│   ├── use-cases/
│   │   ├── vouchers/
│   │   │   ├── CreateVoucherUseCase.ts
│   │   │   ├── ApproveVoucherUseCase.ts
│   │   │   ├── RejectVoucherUseCase.ts
│   │   │   └── SearchVouchersUseCase.ts
│   │   ├── claims/
│   │   │   ├── ClaimVoucherUseCase.ts
│   │   │   ├── RedeemVoucherUseCase.ts
│   │   │   └── GetMyClaimsUseCase.ts
│   │   ├── businesses/
│   │   │   ├── RegisterBusinessUseCase.ts
│   │   │   ├── VerifyBusinessUseCase.ts
│   │   │   └── GetBusinessProfileUseCase.ts
│   │   ├── recommendations/
│   │   │   ├── GetRecommendationsUseCase.ts
│   │   │   └── GetSimilarVouchersUseCase.ts
│   │   └── scraping/
│   │       └── ScrapeCompetitorsUseCase.ts
│   ├── dtos/
│   │   ├── CreateVoucherDTO.ts
│   │   ├── VoucherResponseDTO.ts
│   │   ├── ClaimResponseDTO.ts
│   │   ├── BusinessRegistrationDTO.ts
│   │   └── RecommendationDTO.ts
│   └── mappers/
│       ├── VoucherMapper.ts             # Entity <-> DTO <-> Prisma model
│       ├── BusinessMapper.ts
│       └── ClaimMapper.ts
│
├── infrastructure/                      # OUTER RING — framework deps live here
│   ├── repositories/                    # Implements domain interfaces
│   │   ├── PrismaVoucherRepository.ts
│   │   ├── PrismaBusinessRepository.ts
│   │   ├── PrismaClaimRepository.ts
│   │   ├── PrismaCategoryRepository.ts
│   │   ├── PrismaCompetitorRepository.ts
│   │   └── PrismaRecommendationRepository.ts
│   ├── services/
│   │   ├── ai/
│   │   │   └── AnthropicRecommendationService.ts  # Claude API calls
│   │   ├── email/
│   │   │   ├── ResendEmailService.ts
│   │   │   └── templates/
│   │   │       ├── VoucherApprovedEmail.tsx
│   │   │       ├── VoucherClaimedEmail.tsx
│   │   │       └── ClaimExpiringEmail.tsx
│   │   ├── scraping/
│   │   │   ├── GrouponScraper.ts
│   │   │   ├── SocialDealScraper.ts
│   │   │   └── WeekendjeWegScraper.ts
│   │   ├── storage/
│   │   │   └── VercelBlobService.ts
│   │   └── cache/
│   │       └── UpstashCacheService.ts
│   ├── db/
│   │   └── prisma.ts                    # Prisma client singleton
│   └── config/
│       └── container.ts                 # Dependency wiring (manual factory)
│
├── server/                              # tRPC LAYER — thin, calls use cases
│   └── api/
│       ├── trpc.ts                      # tRPC init, context, middleware
│       ├── root.ts                      # Root router
│       └── routers/
│           ├── vouchers.ts              # Calls VoucherUseCases
│           ├── claims.ts                # Calls ClaimUseCases
│           ├── businesses.ts            # Calls BusinessUseCases
│           ├── browse.ts               # Calls SearchVouchersUseCase
│           ├── recommendations.ts       # Calls RecommendationUseCases
│           └── admin.ts                 # Calls admin use cases
│
├── app/                                 # NEXT.JS PAGES — presentation only
│   ├── layout.tsx
│   ├── page.tsx                         # Homepage
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/
│   │       ├── page.tsx                 # Consumer signup
│   │       └── business/page.tsx        # Business signup
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── vouchers/
│   │   │   ├── page.tsx                 # Browse all
│   │   │   └── [slug]/page.tsx          # Voucher detail
│   │   └── about/page.tsx
│   ├── business/
│   │   ├── dashboard/page.tsx
│   │   ├── vouchers/
│   │   │   ├── page.tsx                 # My vouchers
│   │   │   └── create/page.tsx
│   │   └── redeem/page.tsx              # Enter claim code
│   ├── consumer/
│   │   ├── dashboard/page.tsx
│   │   └── my-vouchers/page.tsx         # Claimed vouchers + QR
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── vouchers/pending/page.tsx
│   │   ├── businesses/pending/page.tsx
│   │   └── competitors/page.tsx
│   └── api/
│       ├── trpc/[trpc]/route.ts
│       ├── health/route.ts
│       └── cron/
│           └── scrape-competitors/route.ts
│
├── components/                          # REACT COMPONENTS — render only
│   ├── ui/                              # shadcn/ui (existing)
│   ├── vouchers/
│   │   ├── VoucherCard.tsx
│   │   ├── VoucherGrid.tsx
│   │   ├── VoucherFilters.tsx
│   │   └── VoucherDetail.tsx
│   ├── claims/
│   │   ├── ClaimButton.tsx
│   │   ├── ClaimCodeDisplay.tsx
│   │   └── QRCodeCard.tsx
│   ├── business/
│   │   ├── BusinessRegistrationForm.tsx
│   │   └── BusinessProfile.tsx
│   ├── admin/
│   │   ├── ApprovalQueue.tsx
│   │   ├── StatsCards.tsx
│   │   └── CompetitorTable.tsx
│   └── recommendations/
│       └── RecommendedVouchers.tsx
│
├── lib/                                 # SHARED UTILITIES
│   ├── utils.ts                         # cn() helper
│   ├── rate-limit.ts
│   └── constants.ts
│
├── trpc/                                # tRPC CLIENT (existing)
│   ├── react.tsx
│   └── server.ts
│
└── env.js                               # Env validation (existing)
```

### Dependency Flow (Strict)
```
app/ & components/ → server/routers → application/use-cases → domain/
                                              ↑
                              infrastructure/repositories (implements domain interfaces)
                              infrastructure/services (AI, email, scraping)
```

**Rule**: Dependencies ALWAYS point inward. Domain has ZERO imports from other layers.

## KEY PATTERNS

### 1. Repository Pattern
```typescript
// domain/repositories/IVoucherRepository.ts — INTERFACE
export interface IVoucherRepository {
  findById(id: string): Promise<Voucher | null>
  findByStatus(status: VoucherStatus): Promise<Voucher[]>
  save(voucher: Voucher): Promise<Voucher>
  search(query: string, filters: VoucherFilters): Promise<Voucher[]>
}

// infrastructure/repositories/PrismaVoucherRepository.ts — IMPLEMENTATION
export class PrismaVoucherRepository implements IVoucherRepository {
  constructor(private prisma: PrismaClient) {}
  // ... Prisma-specific implementation
}
```

### 2. Use Case Pattern
```typescript
// application/use-cases/claims/ClaimVoucherUseCase.ts
export class ClaimVoucherUseCase {
  constructor(
    private voucherRepo: IVoucherRepository,
    private claimRepo: IClaimRepository,
    private claimCodeService: ClaimCodeService,
  ) {}

  async execute(input: { voucherId: string; userId: string }): Promise<ClaimResponseDTO> {
    const voucher = await this.voucherRepo.findById(input.voucherId)
    if (!voucher || !voucher.canBeClaimed()) throw new ClaimLimitExceededError()

    const claim = VoucherClaim.create({
      voucherId: input.voucherId,
      userId: input.userId,
      code: this.claimCodeService.generate(),
    })

    return ClaimMapper.toDTO(await this.claimRepo.save(claim))
  }
}
```

### 3. tRPC Router (Thin Layer)
```typescript
// server/api/routers/claims.ts
export const claimsRouter = createTRPCRouter({
  claim: protectedProcedure
    .input(z.object({ voucherId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const useCase = createClaimVoucherUseCase() // factory from container
      return useCase.execute({ voucherId: input.voucherId, userId: ctx.session.user.id })
    }),
})
```

### 4. Manual Dependency Wiring (No DI Container Needed)
```typescript
// infrastructure/config/container.ts
import { PrismaClient } from '@prisma/client'
import { PrismaVoucherRepository } from '../repositories/PrismaVoucherRepository'
import { ClaimVoucherUseCase } from '../../application/use-cases/claims/ClaimVoucherUseCase'

const prisma = new PrismaClient()

export function createClaimVoucherUseCase() {
  return new ClaimVoucherUseCase(
    new PrismaVoucherRepository(prisma),
    new PrismaClaimRepository(prisma),
    new ClaimCodeService(),
  )
}
```

### 5. Tailwind CSS 4 Config (CSS-first)
```css
/* globals.css */
@import 'tailwindcss';

@theme {
  --color-primary: #2563eb;
  --color-secondary: #059669;
  --font-sans: 'Inter', sans-serif;
  --radius-lg: 0.75rem;
}
```

### 6. Prisma Multi-File Schema
```
prisma/
├── schema.prisma          # generator + datasource only
└── schema/
    ├── user.prisma         # User, Account, Session
    ├── business.prisma     # Business, Category
    ├── voucher.prisma      # Voucher, VoucherClaim, Redemption
    ├── competitor.prisma   # CompetitorVoucher
    └── analytics.prisma    # VoucherEvent, UserRecommendation
```

### 7. Neon PostgreSQL Connection
```
DATABASE_URL = pooled connection (-pooler suffix) for app queries
DIRECT_URL   = direct connection for migrations only
```

## CONFIG FILES TO UPDATE

### postcss.config.mjs (Tailwind v4)
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### next.config.ts
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.blob.vercelusercontent.com' },
    ],
  },
  optimizePackageImports: ['lucide-react', 'date-fns', 'recharts'],
}

export default nextConfig
```

## INSTALL (After Cleanup)

```bash
# Add new dependencies
npm install nanoid qrcode.react @react-email/components react-email sharp node-cron cheerio

# Add types
npm install -D @types/node-cron

# Remove template leftovers
npm uninstall @slack/web-api cron

# Tailwind v4 migration (when ready — significant change)
npm uninstall tailwindcss tailwindcss-animate autoprefixer
npm install @tailwindcss/postcss@latest
# Then update postcss.config.mjs and move config to CSS @theme
```

## SETUP STEPS

1. Remove `src/lib/simplicate/` directory and `scripts/sync-simplicate.ts`
2. Remove Simplicate env vars from `src/env.js` and `.env.example`
3. Remove `test:simplicate` script from `package.json`
4. Create domain layer: `src/domain/{entities,value-objects,repositories,services,errors}/`
5. Create application layer: `src/application/{use-cases,dtos,mappers}/`
6. Create infrastructure layer: `src/infrastructure/{repositories,services,config}/`
7. Move `src/server/db/index.ts` → `src/infrastructure/db/prisma.ts`
8. Create `src/infrastructure/config/container.ts` for dependency wiring
9. Install new dependencies (see INSTALL section above)
10. Split `prisma/schema.prisma` into modular files under `prisma/schema/`
11. Migrate Tailwind to v4 (separate step — impacts all components)
12. Update `.env.example` with cleaned vars

## SOURCES

**Stack Validation:**
- https://nextjs.org/blog/next-16-2
- https://trpc.io/blog/announcing-trpc-v11
- https://www.prisma.io/blog/prisma-6-better-performance-more-flexibility-and-type-safe-sql
- https://authjs.dev/getting-started/migrating-to-v5
- https://tailwindcss.com/blog/tailwindcss-v4
- https://react.dev/blog/2025/10/01/react-19-2

**Architecture:**
- https://github.com/nikolovlazar/nextjs-clean-architecture
- https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-nodejs-architecture/
- https://softwaremill.com/modern-full-stack-application-architecture-using-next-js-15/
- https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/
- https://blog.alexrusin.com/clean-architecture-in-node-js-implementing-the-repository-pattern-with-prisma/
- https://github.com/prisma/prisma/discussions/10584

**Dependencies:**
- https://www.npmjs.com/package/nanoid (5.1.7)
- https://www.npmjs.com/package/qrcode.react (4.2.0)
- https://react.email/docs/changelog (5.2.10)
- https://www.npmjs.com/package/@anthropic-ai/sdk (0.80.0)
- https://sharp.pixelplumbing.com/install/ (0.34.5)
- https://www.npmjs.com/package/node-cron (4.2.1)

**Configuration:**
- https://nextjs.org/docs/app/api-reference/config/next-config-js
- https://www.prisma.io/blog/organize-your-prisma-schema-with-multi-file-support
- https://dev.to/matowang/trpc-11-setup-for-nextjs-app-router-2025-33fo
- https://neon.com/docs/guides/prisma
- https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
- https://vercel.com/docs/vercel-blob/server-upload

**Dev Tooling:**
- https://dev.to/pockit_tools/pnpm-vs-npm-vs-yarn-vs-bun-the-2026-package-manager-showdown-51dc
- https://github.com/vitest-dev/vitest/releases (4.1.2)
- https://playwright.dev/docs/release-notes (1.58.2)
- https://prettier.io/blog/2026/01/14/3.8.0 (3.8.1)
