import { createTRPCRouter } from '@/server/api/trpc'
import { usersRouter } from '@/server/api/routers/users'
import { businessesRouter } from '@/server/api/routers/businesses'
import { categoriesRouter } from '@/server/api/routers/categories'

export const appRouter = createTRPCRouter({
  users: usersRouter,
  businesses: businessesRouter,
  categories: categoriesRouter,
})

export type AppRouter = typeof appRouter
