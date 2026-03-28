import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { createListCategoriesUseCase } from '@/infrastructure/config/container'

export const categoriesRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const useCase = createListCategoriesUseCase()
    return await useCase.execute()
  }),
})
