import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import {
  createFindOrCreateConsumerUseCase,
  createClaimVoucherUseCase,
  createGetClaimByCodeUseCase,
} from '@/infrastructure/config/container'
import { mapDomainError } from '@/server/api/helpers/mapDomainError'

export const claimsRouter = createTRPCRouter({
  // Claim a voucher — lightweight: just needs an email (finds or creates user)
  claim: publicProcedure
    .input(z.object({
      voucherId: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      try {
        const findOrCreateUser = createFindOrCreateConsumerUseCase()
        const user = await findOrCreateUser.execute({ email: input.email })

        const claimUseCase = createClaimVoucherUseCase()
        return await claimUseCase.execute({
          voucherId: input.voucherId,
          userId: user.id,
        })
      } catch (error) {
        mapDomainError(error)
      }
    }),

  // Look up a claim by code (for the business to verify)
  getByCode: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const useCase = createGetClaimByCodeUseCase()
        const claim = await useCase.execute(input.code)
        if (!claim) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Code niet gevonden' })
        }
        return claim
      } catch (error) {
        if (error instanceof TRPCError) throw error
        mapDomainError(error)
      }
    }),
})
