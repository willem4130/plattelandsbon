# Oom Gerrit Voucher System

Dutch rural tourism voucher platform connecting businesses with consumers, featuring AI-powered recommendations and competitor analysis.

## Architecture: Onion Architecture (Strict)

ALL code follows onion architecture with strict modularity. Dependencies ALWAYS point inward.

```
Presentation (app/, components/) → Server (tRPC routers) → Application (use cases) → Domain (entities)
                                                                    ↑
                                          Infrastructure (Prisma repos, AI, email, scraping)
```

### Layers

**Domain** (`src/domain/`) — ZERO external dependencies
- `entities/` — Business objects with behavior (Voucher, Business, VoucherClaim)
- `value-objects/` — Immutable typed values (ClaimCode, VoucherStatus, DiscountType)
- `repositories/` — INTERFACES only (IVoucherRepository, IClaimRepository)
- `services/` — Pure domain logic (VoucherValidationService, FraudDetectionService)
- `errors/` — Domain-specific errors

**Application** (`src/application/`) — Orchestrates domain, no framework deps
- `use-cases/` — One class per operation (CreateVoucherUseCase, ClaimVoucherUseCase)
- `dtos/` — Data transfer objects for layer boundaries
- `mappers/` — Entity <-> DTO conversions

**Infrastructure** (`src/infrastructure/`) — Framework/external deps live here
- `repositories/` — Prisma implementations of domain interfaces
- `services/ai/` — Anthropic API integration
- `services/email/` — Resend + react-email templates
- `services/scraping/` — Competitor scrapers (Groupon, SocialDeal, WeekendjeWeg)
- `services/storage/` — Vercel Blob
- `services/cache/` — Upstash Redis
- `config/container.ts` — Dependency wiring (manual factory functions)

**Server** (`src/server/api/`) — Thin tRPC layer
- Routers call use cases, nothing else
- One router per domain (vouchers, claims, businesses, browse, recommendations, admin)

**Presentation** (`src/app/`, `src/components/`)
- Next.js App Router pages — render only
- React components — no business logic

### Rules
- Domain layer imports NOTHING from other layers
- tRPC routers are thin: validate input, call use case, return result
- Prisma is NEVER imported outside `src/infrastructure/`
- Use cases depend on repository interfaces, not implementations
- Components never call Prisma or use cases directly

## Tech Stack

Next.js 16, React 19, TypeScript 5.9, PostgreSQL, Prisma 6, NextAuth v5, tRPC v11, Tailwind CSS 4, shadcn/ui, Anthropic AI SDK, Resend, Vercel Blob, Upstash Redis

See `RESEARCH.md` for validated versions and configuration details.

## File Organization

- tRPC routers → `src/server/api/routers/`, one per domain
- Use cases → `src/application/use-cases/`, grouped by domain
- Domain entities → `src/domain/entities/`
- Repository interfaces → `src/domain/repositories/`
- Repository implementations → `src/infrastructure/repositories/`
- Components → `src/components/`, organized by feature
- UI components → `src/components/ui/` (shadcn)
- Shared utilities → `src/lib/`
- Database schema → `prisma/schema/` (multi-file)

### Modularity Principles
- Single responsibility per file
- Clear, descriptive file names
- Group related functionality by domain
- No monolithic files
- Every new feature must respect layer boundaries

## Code Quality — Zero Tolerance

After editing ANY file, run:

```bash
npm run lint
npm run typecheck
```

Fix ALL errors/warnings before continuing.

If changes require server restart:
1. Restart: `npm run dev`
2. Read server output/logs
3. Fix ALL warnings/errors

## Project Status

**Current Phase**: Week 1 foundation initialized (Nov 2025), resuming March 2026
**References**: `PROJECT_PLAN.md` (implementation roadmap), `RESEARCH.md` (validated stack)
