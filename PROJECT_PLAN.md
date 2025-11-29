# Oom Gerrit Voucher System - Rebuild Plan

## Project Overview

**"Plattelandsbon" (Rural Voucher)** - A Dutch rural tourism voucher platform connecting businesses with consumers, replacing a 25+ year legacy system with modern AI-powered features.

## Discovery Summary

### Source Materials

- **Wireframes**: 3 PowerPoint files in `/Users/willemvandenberg/Dev/oomgerrit/input/`
  - `01 uitleg bon aanmelden ondernemer.ppt` - Business registration flow
  - `02 uitleg bon aanmelden recreant.ppt` - Consumer registration
  - `03 uitleg bon ondernemer recreant bv.ppt` - Business-consumer interaction

### Key Requirements Extracted

#### User Roles:
1. **Consumers (Recreanten)**: Search, browse, claim, print, and redeem vouchers
2. **Businesses (Ondernemers)**: Create, manage, and track vouchers
3. **Admins**: Approve vouchers, monitor fraud, manage system

#### Core Features:
- Multi-site search (plattelandentoerisme.nl, plattelandsbon.nl)
- Category browsing (bars, cafés, accommodations, etc.)
- Voucher management (create, modify, set periods)
- Discount types: cash, products, services
- Print/order functionality
- Photo and description management

#### AI Features Requested:
- AI-powered voucher recommendations
- Competitor voucher scraping
- Smart fraud detection
- Automated content generation

## Technical Foundation

### Recommended Base: Simplicate Automations
- **Path**: `/Users/willemvandenberg/Dev/simplicate-automations/`
- **Stack**: Next.js 16, PostgreSQL, Prisma, NextAuth v5, tRPC v11, Tailwind CSS 4, shadcn/ui
- **Rationale**: Production-ready with financial tracking, user management, email integration, workflow automation
- **Key Files**:
  - `prisma/schema.prisma` - Database schema reference
  - `package.json` - Dependencies
  - `.env.example` - Configuration template

## Planning Synthesis

I've analyzed three implementation approaches:

### Approach 1: MVP-First Rapid Deployment (8 weeks)
- **Focus**: Ship quickly, manual admin processes, AI features post-launch
- **Timeline**: 8 weeks to production
- **Pros**: Fastest to market, validates business model early, lower initial complexity
- **Cons**: Technical debt, AI features delayed, may need refactoring later

### Approach 2: AI-First Future-Proof (6 months)
- **Focus**: Microservices, ML infrastructure from day one, cutting-edge features
- **Timeline**: 24 weeks to production
- **Pros**: Scalable architecture, AI as core differentiator, no major rewrites needed
- **Cons**: Longer time to market, higher complexity, may over-engineer for initial user base

### Approach 3: Balanced Pragmatic Production (10-12 weeks) ⭐ RECOMMENDED
- **Focus**: Production-quality foundation, AI-ready architecture, incremental AI rollout
- **Timeline**: 10-12 weeks to launch + 3-6 months for AI features
- **Pros**: Best of both worlds—quality foundation without over-engineering, clear AI evolution path
- **Cons**: Slightly longer than MVP approach, requires disciplined modular design

## Final Recommended Approach

**Hybrid: Fast Launch with Essential AI (8-9 weeks)**

### Strategy
- **Weeks 1-6**: Core voucher platform (simplified from MVP approach)
- **Weeks 7-8**: Simple AI recommendations (rule-based + OpenAI API)
- **Week 9**: Basic competitor scraping (manual seed + automated updates)
- **Post-launch**: Evolve to ML-based recommendations, expand scraping

### Key Simplifications for Speed
1. **Manual admin processes**: All business/voucher approvals reviewed by you (no complex workflows)
2. **Small pilot scope**: 10-50 businesses means PostgreSQL + simple search is plenty
3. **AI shortcuts**: Use OpenAI/Claude APIs instead of building ML models from scratch
4. **Monolith architecture**: Single Next.js app, no microservices complexity

### Essential vs. Deferred Features

#### Launch (Week 8):
- ✅ Business registration and profiles
- ✅ Voucher creation, manual approval
- ✅ Consumer browse, search, claim, redeem
- ✅ AI-powered recommendations (OpenAI API)
- ✅ Competitor scraping (4-5 major sites)
- ✅ Email notifications
- ✅ Basic admin dashboard

#### Post-Launch (Months 2-6):
- 🔄 ML-based recommendations (train on real user data)
- 🔄 Advanced fraud detection
- 🔄 AI content generation
- 🔄 Automated business verification
- 🔄 Advanced analytics

---

## Implementation Plan (8-9 Weeks)

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Set up project structure, database, authentication

#### Week 1: Project Setup
1. Clone Simplicate Automations template to new repo `oomgerrit`
2. Clean out unnecessary code:
   - Delete: `/admin/projects`, `/admin/contracts`, `/admin/hours`, `/admin/invoices`, `/portal`, `/workflows`
   - Keep: Auth pages, admin layout, dashboard structure
3. Update environment variables:
   - Remove: `SIMPLICATE_*` vars
   - Add: `OPENAI_API_KEY`, `COMPETITOR_SCRAPER_URL`
4. Database schema creation:
   - Keep: User, Account, Session (NextAuth models)
   - Delete: All Simplicate business models
   - Create: Business, Voucher, Category, VoucherClaim, Redemption, VoucherEvent
5. Seed database:
   - 5 test categories (Bars, Cafés, Restaurants, Accommodations, Activities)
   - Admin user account
   - 3 test businesses

#### Week 2: Core Models & Auth
1. Extend User model with role enum (CONSUMER, BUSINESS, ADMIN)
2. Build tRPC routers:
   - `auth.ts` - Registration, role management
   - `categories.ts` - List categories
   - `businesses.ts` - CRUD for business profiles
3. Create business registration flow:
   - `/register/business` page with form
   - Business profile creation
   - Email verification
4. Admin business verification:
   - `/admin/businesses` page
   - "Verify" button (sets verified: true)
   - Email notification on verification

**Deliverable**: Working auth system, businesses can register, admin can verify

### Phase 2: Core Voucher Platform (Weeks 3-5)

#### Week 3: Voucher Creation & Management
1. Build vouchers tRPC router:
   - `create` - Business creates voucher (status: PENDING)
   - `update` - Edit draft voucher
   - `getAll` - Admin list all vouchers
   - `getMine` - Business lists their vouchers
2. Voucher creation form (`/business/vouchers/create`):
   - Fields: title, description, category, discount type/value, terms, validity
   - Image upload (Vercel Blob)
   - Save as draft or submit for approval
3. Admin approval interface (`/admin/vouchers/pending`):
   - Table of pending vouchers
   - "Approve" / "Reject" actions
   - Email notifications on approval/rejection

#### Week 4: Consumer Browse & Search
1. Public voucher browsing (`/vouchers`):
   - Display grid of approved vouchers
   - Filter by category (dropdown)
   - Filter by city (dropdown populated from businesses)
   - Search by text (PostgreSQL full-text search)
   - Pagination (20 per page)
2. Voucher detail page (`/vouchers/[slug]`):
   - Full details, image, business info, terms
   - "Claim Voucher" button (requires auth)
3. Build browse tRPC router:
   - `searchVouchers` - Public procedure with filters
   - `getVoucherBySlug` - Single voucher details

#### Week 5: Claim & Redeem Flow
1. Voucher claiming:
   - claims tRPC router with `claimVoucher` mutation
   - Generate 8-character claim code (nanoid)
   - Transaction: create claim, increment voucher counter
   - Check max redemptions limit
2. Consumer dashboard (`/my-vouchers`):
   - List of claimed vouchers
   - Display claim code + QR code
   - Status badges (Active, Redeemed, Expired)
   - "Print" button (opens print-friendly page)
3. Redemption processing (`/business/redeem`):
   - Input claim code
   - Validate code (exists, not redeemed, not expired)
   - Mark as redeemed
   - Show confirmation

**Deliverable**: Full voucher lifecycle working (create → approve → browse → claim → redeem)

### Phase 3: AI Features (Weeks 6-8)

#### Week 6-7: AI Recommendations

**Simple Approach (No ML training needed):**

1. **Rule-Based Foundation (Week 6, Day 1-2)**:
```typescript
// src/lib/ai/recommendations.ts
export async function getRecommendations(userId: string) {
  // Get user's claim history
  const claims = await db.voucherClaim.findMany({
    where: { userId },
    include: { voucher: { include: { category: true, business: true } } },
    orderBy: { claimedAt: 'desc' },
    take: 10,
  })

  // Extract preferences
  const categoryIds = claims.map(c => c.voucher.categoryId)
  const cities = claims.map(c => c.voucher.business.city)

  // Recommend from same categories + cities
  return await db.voucher.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { categoryId: { in: categoryIds } },
        { business: { city: { in: cities } } },
      ],
    },
    take: 10,
    orderBy: { viewCount: 'desc' },
  })
}
```

2. **OpenAI Enhancement (Week 6, Day 3-5)**:
```typescript
import OpenAI from 'openai'

export async function getAIRecommendations(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      claimedVouchers: {
        include: { voucher: true },
        take: 20,
      },
    },
  })

  const allVouchers = await db.voucher.findMany({
    where: { status: 'ACTIVE' },
    include: { business: true, category: true },
  })

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const prompt = `Given a user who has claimed these vouchers:
${user.claimedVouchers.map(c => `- ${c.voucher.title} (${c.voucher.category.name})`).join('\n')}

And these available vouchers:
${allVouchers.map(v => `- ${v.id}: ${v.title} (${v.category.name}, ${v.business.city})`).join('\n')}

Recommend the top 10 voucher IDs that this user would most likely enjoy, based on their preferences.
Return only the voucher IDs as a JSON array.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Cheaper, faster
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  const recommendedIds = JSON.parse(response.choices[0].message.content).vouchers

  return allVouchers.filter(v => recommendedIds.includes(v.id))
}
```

3. **Caching (Week 7, Day 1-2)**:
```typescript
// Cache recommendations in Redis for 1 hour
export async function getCachedRecommendations(userId: string) {
  const cacheKey = `recommendations:${userId}`
  const cached = await redis.get(cacheKey)

  if (cached) return JSON.parse(cached)

  const recommendations = await getAIRecommendations(userId)
  await redis.setex(cacheKey, 3600, JSON.stringify(recommendations))

  return recommendations
}
```

4. **UI Integration (Week 7, Day 3-5)**:
   - Add "Recommended for You" section to homepage
   - Add "Similar Vouchers" to voucher detail page
   - tRPC route: `recommendations.getPersonalized`

#### Week 8: Competitor Scraping

**Hybrid Approach (Manual seed + automated updates):**

1. **Manual Competitor Data Collection (Day 1)**:
   - Create spreadsheet: competitor name, voucher title, discount, URL, category
   - Collect 50-100 competitor vouchers manually from:
     - Groupon.nl
     - SocialDeal.nl
     - Weekendjeweg.nl
   - Import to CompetitorVoucher table

2. **Basic Scraper (Days 2-4)**:
```typescript
// src/lib/scraper/index.ts
import * as cheerio from 'cheerio'

export async function scrapeGroupon() {
  const response = await fetch('https://www.groupon.nl/browse/netherlands')
  const html = await response.text()
  const $ = cheerio.load(html)

  const vouchers: Array<{title: string, price: string, url: string}> = []

  $('.deal-card').each((i, el) => {
    vouchers.push({
      title: $(el).find('.deal-title').text(),
      price: $(el).find('.deal-price').text(),
      url: $(el).find('a').attr('href') || '',
    })
  })

  return vouchers
}

// Save to database
export async function updateCompetitorData() {
  const grouponDeals = await scrapeGroupon()

  for (const deal of grouponDeals) {
    await db.competitorVoucher.upsert({
      where: { url: deal.url },
      create: {
        source: 'groupon',
        title: deal.title,
        price: deal.price,
        url: deal.url,
        scrapedAt: new Date(),
      },
      update: {
        price: deal.price,
        scrapedAt: new Date(),
      },
    })
  }
}
```

3. **Cron Job (Day 5)**:
```typescript
// src/app/api/cron/scrape-competitors/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  await updateCompetitorData()

  return Response.json({ success: true })
}
```

4. **Admin Dashboard (Days 6-7)**:
   - `/admin/competitors` page
   - Table showing competitor vouchers
   - "Import" button to convert competitor voucher to our platform
   - Weekly pricing comparison report

**Deliverable**: AI recommendations working, competitor data collected and displayed

### Phase 4: Polish & Launch (Week 9)

**Goal**: Production readiness

#### Days 1-3: Testing
- Manual testing of all user flows
- Fix critical bugs
- E2E test for claim-to-redeem flow (Playwright)

#### Days 4-5: Email Templates
- Design email templates (React Email)
- Voucher approved notification
- Voucher claimed notification
- Claim expiring soon (3 days before)

#### Days 6-7: Deployment
- Set up Vercel production environment
- Configure custom domain (oomgerrit.nl)
- Database migration to Neon production
- Monitoring setup (Sentry, Vercel Analytics)
- Create user documentation (simple guide for businesses)

#### Launch Checklist:
- Seed production with 5 real businesses
- Create 15-20 sample vouchers
- Test end-to-end on mobile devices
- SSL certificate active
- Email delivery working
- AI recommendations returning results
- Competitor data refreshing daily

---

## Technical Architecture Details

### Database Schema

```prisma
// Core simplified schema (full details in implementation)

model User {
  id       String   @id @default(cuid())
  email    String   @unique
  name     String?
  role     UserRole @default(CONSUMER)

  business         Business?
  claimedVouchers  VoucherClaim[]

  @@index([role])
}

enum UserRole {
  CONSUMER
  BUSINESS
  ADMIN
}

model Business {
  id          String  @id @default(cuid())
  userId      String  @unique
  user        User    @relation(fields: [userId], references: [id])

  name        String
  city        String
  description String? @db.Text
  logoUrl     String?
  verified    Boolean @default(false)

  vouchers    Voucher[]
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique

  vouchers Voucher[]
}

enum VoucherStatus {
  DRAFT
  PENDING
  ACTIVE
  REJECTED
  EXPIRED
}

model Voucher {
  id            String         @id @default(cuid())
  businessId    String
  categoryId    String

  title         String
  description   String         @db.Text
  imageUrl      String?
  discountValue String
  terms         String         @db.Text

  validFrom     DateTime       @default(now())
  validUntil    DateTime?
  status        VoucherStatus  @default(PENDING)
  maxUses       Int?

  viewCount     Int            @default(0)
  claimCount    Int            @default(0)

  business      Business       @relation(fields: [businessId], references: [id])
  category      Category       @relation(fields: [categoryId], references: [id])
  claims        VoucherClaim[]

  @@index([status])
  @@index([categoryId])
  @@fulltext([title, description])
}

model VoucherClaim {
  id           String    @id @default(cuid())
  voucherId    String
  userId       String

  claimCode    String    @unique
  claimedAt    DateTime  @default(now())
  redeemedAt   DateTime?
  expiresAt    DateTime

  voucher      Voucher   @relation(fields: [voucherId], references: [id])
  user         User      @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([voucherId])
}

model CompetitorVoucher {
  id        String   @id @default(cuid())
  source    String   // "groupon", "socialdeal"
  title     String
  price     String
  url       String   @unique
  category  String?
  scrapedAt DateTime @default(now())
}

// VoucherEvent for analytics (simplified)
model VoucherEvent {
  id        String   @id @default(cuid())
  eventType String   // "view", "claim", "search"
  userId    String?
  voucherId String?
  data      Json?
  timestamp DateTime @default(now())

  @@index([eventType])
  @@index([timestamp])
}
```

### File Structure (Simplified from Template)

```
oomgerrit/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/
│   │   │       ├── page.tsx              # Consumer signup
│   │   │       └── business/page.tsx     # Business signup
│   │   ├── (public)/
│   │   │   ├── page.tsx                  # Homepage
│   │   │   ├── vouchers/
│   │   │   │   ├── page.tsx              # Browse all
│   │   │   │   └── [slug]/page.tsx       # Single voucher
│   │   │   └── about/page.tsx
│   │   ├── business/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── vouchers/
│   │   │   │   ├── page.tsx              # List vouchers
│   │   │   │   └── create/page.tsx       # Create new
│   │   │   └── redeem/page.tsx           # Scan claim codes
│   │   ├── consumer/
│   │   │   ├── dashboard/page.tsx
│   │   │   └── my-vouchers/page.tsx      # Claimed vouchers
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── vouchers/
│   │   │   │   └── pending/page.tsx      # Approval queue
│   │   │   ├── businesses/
│   │   │   │   └── pending/page.tsx      # Verification queue
│   │   │   └── competitors/page.tsx      # Competitor data
│   │   └── api/
│   │       └── cron/
│   │           └── scrape-competitors/route.ts
│   ├── server/
│   │   └── api/
│   │       └── routers/
│   │           ├── vouchers.ts
│   │           ├── businesses.ts
│   │           ├── claims.ts
│   │           ├── browse.ts
│   │           ├── recommendations.ts
│   │           └── admin.ts
│   ├── components/
│   │   ├── vouchers/
│   │   │   ├── VoucherCard.tsx
│   │   │   └── VoucherFilters.tsx
│   │   └── ui/                           # shadcn components
│   └── lib/
│       ├── ai/
│       │   └── recommendations.ts
│       └── scraper/
│           └── index.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### Critical Files to Review from Template

Before implementation, read these key files:

1. `/Users/willemvandenberg/Dev/simplicate-automations/prisma/schema.prisma`
   - See how User/Account/Session models are structured
   - Understand indexing patterns
   - Copy NextAuth models exactly

2. `/Users/willemvandenberg/Dev/simplicate-automations/src/server/api/trpc.ts`
   - tRPC context setup
   - Middleware for protected routes
   - Copy protectedProcedure pattern

3. `/Users/willemvandenberg/Dev/simplicate-automations/src/app/admin/layout.tsx`
   - Admin sidebar navigation
   - Adapt nav items for voucher system

4. `/Users/willemvandenberg/Dev/simplicate-automations/package.json`
   - All dependencies needed
   - Add: openai, cheerio, qrcode.react, nanoid

5. `/Users/willemvandenberg/Dev/simplicate-automations/.env.example`
   - Environment variable template
   - Update for voucher system

---

## Cost Estimate (Small Pilot, <1000 users)

### Monthly Operational Costs:

| Service                   | Cost          | Purpose                                                |
|---------------------------|---------------|--------------------------------------------------------|
| Vercel Pro                | $20           | Hosting, serverless functions                          |
| Neon Postgres (Free tier) | $0            | Database (5GB included)                                |
| Upstash Redis (Free tier) | $0            | Caching, session storage                               |
| Vercel Blob (Free tier)   | $0            | Image storage (1GB included)                           |
| OpenAI API                | ~$10-30       | AI recommendations (~1000 requests/month @ $0.01 each) |
| Email (Resend Free tier)  | $0            | 3,000 emails/month                                     |
| **Total**                 | **~$30-50/month** |                                                    |

### Scaling Costs (if you grow to 10,000 users):
- Neon Postgres: $25/month (Pro tier)
- Upstash Redis: $10/month
- Vercel Blob: $10/month
- OpenAI: $100/month
- **Total: ~$165/month**

---

## Success Metrics (Week 12 - 1 Month Post-Launch)

### Technical Metrics
- ✅ <2s page load time (Lighthouse score >90)
- ✅ 99% uptime
- ✅ <5% error rate
- ✅ AI recommendations response time <500ms

### Business Metrics
- ✅ 10+ verified businesses
- ✅ 30+ active vouchers
- ✅ 100+ consumer signups
- ✅ 200+ voucher claims
- ✅ 50+ redemptions
- ✅ 30% claim-to-redemption conversion

### AI Effectiveness
- ✅ 20%+ click-through rate on AI recommendations
- ✅ Competitor data updated weekly
- ✅ Admin reviews competitor insights monthly

---

## Risk Mitigation

### Technical Risks

**Risk: OpenAI API downtime**
- Mitigation: Fallback to rule-based recommendations
- Cache recommendations for 1 hour

**Risk: Scraper breaks (competitor site changes)**
- Mitigation: Manual updates as backup
- Admin can manually add competitor data
- Monitor scraper health daily

**Risk: Double-redemption (race condition)**
- Mitigation: Database transactions with row locking
- Generate unique claim codes (8 chars = 218 trillion combinations)

### Business Risks

**Risk: Fraudulent vouchers**
- Mitigation: Manual admin approval for ALL vouchers
- Verify businesses via KVK number (Dutch Chamber of Commerce)
- Max discount €50 without special approval

**Risk: Low business adoption**
- Mitigation: Personal onboarding for first 10 businesses
- Create demo vouchers to show value
- Offer free trial (no fees for first 3 months)

**Risk: AI recommendations not relevant**
- Mitigation: Start with rule-based (safe)
- A/B test OpenAI vs rules
- Collect feedback ("Was this recommendation helpful?")

---

## Post-Launch Evolution (Months 2-6)

### Month 2: Data Collection & Analysis
- Collect user behavior data (views, clicks, claims)
- Analyze which categories perform best
- Identify patterns in redemption rates

### Month 3: ML-Based Recommendations
- Train collaborative filtering model on real data
- Compare performance vs OpenAI approach
- Gradual rollout with A/B testing

### Month 4: Advanced Fraud Detection
- Implement rule-based fraud checks:
  - Same IP claiming >10 vouchers/day
  - Same user claiming same voucher multiple times
  - Redemption velocity checks
- Admin fraud dashboard

### Month 5: Content Generation
- AI-assisted voucher description writing
- Automatic terms & conditions generation
- Social media post generation

### Month 6: Scale Preparation
- Evaluate need for Algolia search
- Consider microservices extraction (scraper)
- Performance optimization
- Launch expanded marketing campaign

---

## Summary

This plan delivers a functioning voucher platform in 8-9 weeks with the essential AI features you requested (recommendations + competitor scraping) while maintaining speed to market.

### Key Trade-offs Made:
- ✅ Manual admin approval (simplicity) vs automated workflows (complexity)
- ✅ OpenAI API (fast, good enough) vs custom ML models (slow, potentially better)
- ✅ Basic scraping (manual seed + automated updates) vs advanced scraping (complex infrastructure)
- ✅ Monolith architecture (fast development) vs microservices (scalability, but slower)

### Why This Works:
1. Leverages 70% of template code (auth, database, admin UI, email)
2. AI via APIs (no ML expertise needed initially)
3. Small pilot scope (simple architecture is sufficient)
4. Clear evolution path (can add ML, microservices, advanced features later based on real data)

### Next Step: Clone the Simplicate template and start Week 1!
