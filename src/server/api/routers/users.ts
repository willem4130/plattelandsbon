import { z } from 'zod'
import { createTRPCRouter, adminProcedure } from '@/server/api/trpc'
import {
  createListUsersUseCase,
  createGetUserStatsUseCase,
  createGetUserByIdUseCase,
} from '@/infrastructure/config/container'
import { mapDomainError } from '@/server/api/helpers/mapDomainError'

export const usersRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(50),
          role: z.enum(['ADMIN', 'CONSUMER', 'BUSINESS']).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      try {
        const useCase = createListUsersUseCase()
        return await useCase.execute(input ?? undefined)
      } catch (error) {
        mapDomainError(error)
      }
    }),

  getStats: adminProcedure.query(async () => {
    try {
      const useCase = createGetUserStatsUseCase()
      return await useCase.execute()
    } catch (error) {
      mapDomainError(error)
    }
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const useCase = createGetUserByIdUseCase()
        return await useCase.execute(input.id)
      } catch (error) {
        mapDomainError(error)
      }
    }),
})
