# Oom Gerrit Voucher System

Dutch rural tourism voucher platform connecting businesses with consumers, featuring AI-powered recommendations and competitor analysis.

## Project Structure

```
oomgerrit/
├── input/               # Source materials (wireframes, requirements)
├── PROJECT_PLAN.md      # Comprehensive rebuild plan (8-9 weeks)
└── .claude/             # Claude Code configuration
    └── commands/        # Custom slash commands
```

## Planned Architecture (Not Yet Implemented)

**Tech Stack**: Next.js 16, PostgreSQL, Prisma, NextAuth v5, tRPC v11, Tailwind CSS 4, shadcn/ui

**Base Template**: `/Users/willemvandenberg/Dev/simplicate-automations/`

See `PROJECT_PLAN.md` for full implementation details.

## Organization Rules

**When implementing (Week 1+):**
- API routes → `src/server/api/routers/`, one file per domain
- Components → `src/components/`, organized by feature
- UI components → `src/components/ui/` (shadcn)
- Utilities → `src/lib/`, grouped by functionality
- Types → Co-located with usage or `src/types/`
- Database schema → `prisma/schema.prisma`

**Modularity principles:**
- Single responsibility per file
- Clear, descriptive file names
- Group related functionality together
- Avoid monolithic files

## Code Quality - Zero Tolerance

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

**Current Phase**: Planning & Documentation
**Next Step**: Clone template and begin Week 1 implementation

Refer to `PROJECT_PLAN.md` for the complete 8-9 week implementation roadmap.
