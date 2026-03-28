/**
 * Dependency Wiring (Manual Factory)
 *
 * All use case and repository construction happens here.
 * tRPC routers import factory functions from this file — never Prisma directly.
 */

import { db } from '../db/prisma'

// Repositories
import { PrismaBusinessRepository } from '../repositories/PrismaBusinessRepository'
import { PrismaCategoryRepository } from '../repositories/PrismaCategoryRepository'
import { PrismaVoucherRepository } from '../repositories/PrismaVoucherRepository'
import { PrismaClaimRepository } from '../repositories/PrismaClaimRepository'

// Transaction manager
import { PrismaTransactionManager } from '../services/PrismaTransactionManager'

// Business use cases
import { RegisterBusinessUseCase } from '@/application/use-cases/businesses/RegisterBusinessUseCase'
import { VerifyBusinessUseCase } from '@/application/use-cases/businesses/VerifyBusinessUseCase'
import { ListBusinessesUseCase } from '@/application/use-cases/businesses/ListBusinessesUseCase'
import { GetBusinessProfileUseCase } from '@/application/use-cases/businesses/GetBusinessProfileUseCase'

// Category use cases
import { ListCategoriesUseCase } from '@/application/use-cases/vouchers/ListCategoriesUseCase'

// Repository singletons
const businessRepo = new PrismaBusinessRepository(db)
const categoryRepo = new PrismaCategoryRepository(db)
const voucherRepo = new PrismaVoucherRepository(db)
const claimRepo = new PrismaClaimRepository(db)

// Transaction manager singleton
const transactionManager = new PrismaTransactionManager(db)

// Use case factories
export function createRegisterBusinessUseCase() {
  return new RegisterBusinessUseCase(businessRepo)
}

export function createVerifyBusinessUseCase() {
  return new VerifyBusinessUseCase(businessRepo)
}

export function createListBusinessesUseCase() {
  return new ListBusinessesUseCase(businessRepo)
}

export function createGetBusinessProfileUseCase() {
  return new GetBusinessProfileUseCase(businessRepo)
}

export function createListCategoriesUseCase() {
  return new ListCategoriesUseCase(categoryRepo)
}

export function createTransactionManager() {
  return transactionManager
}

// Export repos for future use case wiring
export { voucherRepo, claimRepo, businessRepo, categoryRepo }
