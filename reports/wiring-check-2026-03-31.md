# Wiring Check Report — 2026-03-31

## Detected Stack

| Stack | Version | Status |
|-------|---------|--------|
| Next.js (App Router) | 16.2.1 | Detected |
| tRPC | v11 | Detected |
| Prisma ORM | 6.19 | Detected |
| React Query | 5.90 | Detected (via tRPC) |
| NextAuth v5 | beta.30 | Detected (NOT wired) |
| Docker | - | Detected (PostgreSQL) |
| @t3-oss/env-nextjs | 0.13.8 | Detected |
| Upstash Redis | 1.35 | Detected |
| Vercel (deploy) | - | Detected |
| Resend (email) | 6.5 | Detected |
| GSAP | 3.14 | Detected |

## Layer Map (as verified)

```
[Prisma Schema] <-> [Infrastructure Repos (BaseRepository)]
                              |
                     [DI Container] -- wires -->
                              |
[UI Components] <-> [App Router Pages] <-> [tRPC Routers] <-> [Use Cases] <-> [Domain Entities]
                                                |
                                         [tRPC Context]
                                           (session=null in prod)
```

---

## Issues (sorted by severity)

### RED — Broken now

| # | Boundary | Location | What breaks | Impact |
|---|----------|----------|-------------|--------|
| 1 | NextAuth -> tRPC Context | `src/server/api/trpc.ts:26-28` | `session` is always `null` in production. `auth()` is never called — hardcoded `null` for non-dev. | ALL protected procedures return 401 in production. Admin, business, and claim flows completely non-functional. |
| 2 | Client -> Route | `src/app/api/auth/[...nextauth]/` (missing) | NextAuth route handler does not exist. No sign-in/sign-out endpoints. | No login mechanism exists for production users. |
| 3 | Client -> Route | No `middleware.ts` at project root | No route-level protection. `/admin/*`, `/business/*` pages load for anyone. | Unauthenticated users see admin/business UI. tRPC calls fail with 401, but pages render freely. |
| 4 | Client -> Route | `src/app/(auth)/register/business/page.tsx:23` | `router.push('/business/dashboard')` after registration — route does not exist. | User completes registration, gets success toast, lands on 404. Should be `/business/vouchers`. |
| 5 | tRPC Router -> Prisma | `src/server/api/routers/vouchers.ts:124-152` (listActive) | Direct `ctx.db.voucher.findMany()` bypasses use case layer. No `ListActiveVouchersUseCase` exists. | Architecture violation. Business logic in router, not testable in isolation. |
| 6 | tRPC Router -> Prisma | `src/server/api/routers/businesses.ts:77-98` (listVerified) | Direct `ctx.db.business.findMany()` bypasses use case layer. No `ListVerifiedBusinessesUseCase` exists. | Architecture violation. Same as above. |
| 7 | tRPC Router -> Prisma | `src/server/api/routers/vouchers.ts:155-185` (getById) | Direct `ctx.db.voucher.findUnique()` bypasses use case layer. `remainingClaims` calculation inlined. | Entity logic duplicated in router. If entity changes, router won't update. |
| 8 | tRPC Router -> Prisma | `src/server/api/routers/claims.ts:16-24` (claim) | Raw `ctx.db.user.findUnique()` / `ctx.db.user.create()` — user management has no repository or use case. | User creation bypasses any validation/audit layer. |
| 9 | tRPC Router -> Prisma | `src/server/api/routers/users.ts:7-89` (all procedures) | All 3 user procedures (`getAll`, `getStats`, `getById`) directly call `ctx.db.user`. No use cases. | Entire user domain bypasses architecture. |
| 10 | tRPC Router -> Repository | `src/server/api/routers/claims.ts:44-45` (getByCode) | Direct `claimRepo.findByClaimCode()` import from container, bypasses use case. | Cannot add auth checks, caching, or audit without modifying router. |

### YELLOW — Breaks under specific conditions

| # | Boundary | Location | What breaks | Impact |
|---|----------|----------|-------------|--------|
| 11 | tRPC Return -> Modal Component | `src/components/modal/business-modal-content.tsx:39,85-88` | `businesses.listVerified` returns `categories: string[]` (slugs), modal reads `business.categoryIds`. Displays raw slugs as badges instead of names. | Only when opening modal with cached list data. Full page loads work via `getById` fallback. |
| 12 | Application -> Domain | 6 use case files | Hardcoded status strings (`'DRAFT'`, `'PENDING'`, `'ACTIVE'`, `'REJECTED'`) instead of `VoucherStatus.DRAFT` etc. | If VoucherStatus enum values change, use cases silently break. Typos not caught at compile time. |
| 13 | Domain -> Repository | `src/domain/repositories/IVoucherRepository.ts:20` | `create()` accepts `discountType: string` instead of `discountType: DiscountType`. | Type safety lost — invalid discount types pass interface boundary unchecked. |
| 14 | tRPC Router -> Use Case | `src/server/api/routers/vouchers.ts:76` -> `GetBusinessVouchersUseCase` | If user has no business profile, use case throws `BusinessNotFoundError` but router doesn't catch this edge case. | Unhandled exception for users without a business calling `listMine`. |
| 15 | Env Schema -> Runtime | `src/trpc/react.tsx:60-61` | `process.env.VERCEL_URL` and `process.env.PORT` used directly, not in `@t3-oss/env-nextjs` schema. | Bypasses build-time validation. Fails silently if misconfigured outside Vercel. |

### ORANGE — Silent degradation

| # | Boundary | Location | What breaks | Impact |
|---|----------|----------|-------------|--------|
| 16 | Admin Sidebar -> Routes | `src/app/admin/layout.tsx:54-146` | 11+ sidebar links to non-existent routes (`/admin/dashboard`, `/admin/projects`, `/admin/invoices`, etc.). Only 4 admin routes exist. | Users see navigation items that lead nowhere. |
| 17 | Dev Auth -> Production | `src/server/api/trpc.ts:129,146` | Role checks bypassed when `NODE_ENV=development`. No warning logged. | Dev mode masks production auth failures. Business user can call admin mutations in dev. |
| 18 | Infrastructure -> Domain | `BaseRepository` subclasses | Redundant `as PrismaClient` casts after `getClient(tx)` which already returns correct type. | No runtime failure but reduces type safety and clarity. |
| 19 | Error Handling | Various routers | Inconsistent `try/catch + mapDomainError()`. Some procedures use it, some don't. `claims.getByCode` catches generically. | Different error shapes reach the client depending on which procedure fails. |

---

## Clean Boundaries (passed verification)

| Boundary | Details |
|----------|---------|
| Use Cases -> Repository Interfaces | All 12 use cases depend only on interfaces, never implementations. |
| Repository Interfaces <-> Implementations | 100% method coverage across all 4 repos. Signatures match exactly. |
| Prisma Schema <-> Repository Implementations | All field names, enums, relations verified correct. |
| TransactionContext Flow | Opaque type properly threads through domain -> infrastructure without layer violation. `ClaimVoucherUseCase` atomically claims + increments. |
| Domain Entity Factories | All entities have protected constructors, `create()` + `fromProps()` factories, immutable getters. |
| Domain Layer Isolation | Zero imports from infrastructure, application, or presentation layers. |
| Value Objects <-> Prisma Enums | `BusinessStatus`, `VoucherStatus`, `ClaimStatus`, `DiscountType` all align exactly. |
| DI Container | All use cases correctly wired. No circular dependencies. Factory functions consistent. |
| Root Router Merging | All 5 sub-routers merged correctly in `root.ts`. No duplicate procedure names. |
| tRPC Prefetch (SSR) | `trpc.vouchers.listActive.prefetch()` and `trpc.businesses.listVerified.prefetch()` match actual procedures. `HydrateClient` wraps correctly. |
| Client tRPC Hooks | All `useQuery`/`useMutation` calls reference existing procedures with matching inputs. |
| Card Navigation -> Detail Pages | `/bon/${id}` and `/bedrijf/${id}` resolve correctly. Intercepting routes work. |
| Modal System (@modal) | `default.tsx` returns null. `(.)bon/[id]` and `(.)bedrijf/[id]` intercept correctly. Layout includes `@modal` slot. |
| Navigation Links -> Routes | All navbar/footer links resolve to existing pages (except admin sidebar). |
| Env Schema -> Runtime | `@t3-oss/env-nextjs` properly validates DATABASE_URL, API keys, secrets at build time. |
| Git Secrets | `.gitignore` correctly excludes `.env`, `.env*.local`, `.env.production`. |
| Claim Flow | `claims.claim` mutation input matches procedure. `claimCode` + `expiresAt` response used correctly. |
| Voucher CRUD | Create, submit, approve, reject — all inputs/outputs verified correct. |
| Business Registration | Form fields map to tRPC input. Use case validates and creates via repo. |

---

## Systemic Patterns

1. **Read-path architecture bypass**: All 6 architecture violations are read operations (list, get). Write operations (create, update, approve) properly go through use cases. The public-facing read path was built as a shortcut.

2. **User domain is unwired**: No User entity, no IUserRepository, no user use cases. User operations scattered across claims router and users router as raw Prisma calls. This is the biggest gap in onion architecture coverage.

3. **Auth is scaffolded but not connected**: NextAuth deps installed, env vars defined, tRPC procedures have auth middleware — but the actual NextAuth handler and session resolution are missing. Everything is ready to wire except the final connection.

4. **Error handling inconsistency**: Procedures that go through use cases have proper error mapping. Procedures that bypass use cases have ad-hoc or missing error handling.

5. **Admin UI ahead of routes**: Admin sidebar was built with a full navigation structure but most pages don't exist yet. This is likely intentional (future work) but creates dead links.

---

## Recommended Fix Order

### Phase 1: Critical (blocks production)
1. Wire NextAuth v5 — create auth config, route handler, and call `auth()` in tRPC context
2. Create `middleware.ts` to protect `/admin/*`, `/business/*`, `/(auth)/*` routes
3. Fix `/business/dashboard` redirect -> `/business/vouchers`

### Phase 2: Architecture (unblocks testability)
4. Create `ListActiveVouchersUseCase` + `ListVerifiedBusinessesUseCase` + `GetVoucherDetailsUseCase`
5. Create `IUserRepository` + `PrismaUserRepository` + user use cases
6. Create `GetClaimByCodeUseCase`, remove direct repo import from claims router

### Phase 3: Quality
7. Replace hardcoded status strings with `VoucherStatus.*` constants in use cases
8. Fix `IVoucherRepository.create()` to accept `DiscountType` instead of `string`
9. Fix business modal `categoryIds` vs `categories` data shape mismatch
10. Standardize error handling across all router procedures
11. Clean up admin sidebar to only show routes that exist
12. Add `VERCEL_URL` and `PORT` to env schema (or document exclusion)
