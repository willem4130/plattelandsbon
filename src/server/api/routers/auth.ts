import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { createRegisterUserUseCase } from '@/infrastructure/config/container'
import { mapDomainError } from '@/server/api/helpers/mapDomainError'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, 'Naam moet minimaal 2 tekens bevatten').max(100),
        email: z.string().email('Ongeldig e-mailadres'),
        password: z.string().min(8, 'Wachtwoord moet minimaal 8 tekens bevatten'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const useCase = createRegisterUserUseCase()
        return await useCase.execute(input)
      } catch (error) {
        mapDomainError(error)
      }
    }),
})
