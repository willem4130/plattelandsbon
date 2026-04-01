import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { createListCategoriesUseCase } from '@/infrastructure/config/container'
import { mapDomainError } from '@/server/api/helpers/mapDomainError'

export const categoriesRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    try {
      const useCase = createListCategoriesUseCase()
      return await useCase.execute()
    } catch (error) {
      mapDomainError(error)
    }
  }),
})
