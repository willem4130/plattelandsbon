import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '@/server/api/root'

type RouterOutput = inferRouterOutputs<AppRouter>

export type VoucherItem = RouterOutput['vouchers']['listActive'][number]
export type BusinessItem = RouterOutput['businesses']['listVerified'][number]
