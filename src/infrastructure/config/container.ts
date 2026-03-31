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
import { PrismaUserRepository } from '../repositories/PrismaUserRepository'

// Transaction manager & event bus
import { PrismaTransactionManager } from '../services/PrismaTransactionManager'
import { LoggingEventBus } from '../services/LoggingEventBus'

// Business use cases
import { RegisterBusinessUseCase } from '@/application/use-cases/businesses/RegisterBusinessUseCase'
import { VerifyBusinessUseCase } from '@/application/use-cases/businesses/VerifyBusinessUseCase'
import { ListBusinessesUseCase } from '@/application/use-cases/businesses/ListBusinessesUseCase'
import { GetBusinessProfileUseCase } from '@/application/use-cases/businesses/GetBusinessProfileUseCase'

// Category use cases
import { ListCategoriesUseCase } from '@/application/use-cases/vouchers/ListCategoriesUseCase'

// Browse use cases
import { ListActiveVouchersUseCase } from '@/application/use-cases/vouchers/ListActiveVouchersUseCase'
import { ListVerifiedBusinessesUseCase } from '@/application/use-cases/businesses/ListVerifiedBusinessesUseCase'
import { GetVoucherDetailUseCase } from '@/application/use-cases/vouchers/GetVoucherDetailUseCase'

// Claim use cases
import { ClaimVoucherUseCase } from '@/application/use-cases/claims/ClaimVoucherUseCase'
import { GetClaimByCodeUseCase } from '@/application/use-cases/claims/GetClaimByCodeUseCase'

// User use cases
import { FindOrCreateConsumerUseCase } from '@/application/use-cases/users/FindOrCreateConsumerUseCase'
import { ListUsersUseCase } from '@/application/use-cases/users/ListUsersUseCase'
import { GetUserStatsUseCase } from '@/application/use-cases/users/GetUserStatsUseCase'
import { GetUserByIdUseCase } from '@/application/use-cases/users/GetUserByIdUseCase'

// Voucher use cases
import { CreateVoucherUseCase } from '@/application/use-cases/vouchers/CreateVoucherUseCase'
import { SubmitVoucherUseCase } from '@/application/use-cases/vouchers/SubmitVoucherUseCase'
import { GetBusinessVouchersUseCase } from '@/application/use-cases/vouchers/GetBusinessVouchersUseCase'
import { ApproveVoucherUseCase } from '@/application/use-cases/vouchers/ApproveVoucherUseCase'
import { RejectVoucherUseCase } from '@/application/use-cases/vouchers/RejectVoucherUseCase'
import { ListPendingVouchersUseCase } from '@/application/use-cases/vouchers/ListPendingVouchersUseCase'

// Repository singletons
const businessRepo = new PrismaBusinessRepository(db)
const categoryRepo = new PrismaCategoryRepository(db)
const voucherRepo = new PrismaVoucherRepository(db)
const claimRepo = new PrismaClaimRepository(db)
const userRepo = new PrismaUserRepository(db)

// Transaction manager & event bus singletons
const transactionManager = new PrismaTransactionManager(db)
const eventBus = new LoggingEventBus()

// Business use case factories
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

// Category use case factories
export function createListCategoriesUseCase() {
  return new ListCategoriesUseCase(categoryRepo)
}

// Voucher use case factories
export function createCreateVoucherUseCase() {
  return new CreateVoucherUseCase(voucherRepo, businessRepo)
}
export function createSubmitVoucherUseCase() {
  return new SubmitVoucherUseCase(voucherRepo)
}
export function createGetBusinessVouchersUseCase() {
  return new GetBusinessVouchersUseCase(voucherRepo, businessRepo)
}
export function createApproveVoucherUseCase() {
  return new ApproveVoucherUseCase(voucherRepo, eventBus)
}
export function createRejectVoucherUseCase() {
  return new RejectVoucherUseCase(voucherRepo, eventBus)
}
export function createListPendingVouchersUseCase() {
  return new ListPendingVouchersUseCase(voucherRepo)
}

// Browse use case factories
export function createListActiveVouchersUseCase() {
  return new ListActiveVouchersUseCase(voucherRepo, businessRepo, categoryRepo)
}

export function createListVerifiedBusinessesUseCase() {
  return new ListVerifiedBusinessesUseCase(businessRepo, categoryRepo, voucherRepo)
}

export function createGetVoucherDetailUseCase() {
  return new GetVoucherDetailUseCase(voucherRepo, businessRepo)
}

// Claim use case factories
export function createClaimVoucherUseCase() {
  return new ClaimVoucherUseCase(claimRepo, voucherRepo, transactionManager)
}

export function createGetClaimByCodeUseCase() {
  return new GetClaimByCodeUseCase(claimRepo)
}

// User use case factories
export function createFindOrCreateConsumerUseCase() {
  return new FindOrCreateConsumerUseCase(userRepo)
}

export function createListUsersUseCase() {
  return new ListUsersUseCase(userRepo)
}

export function createGetUserStatsUseCase() {
  return new GetUserStatsUseCase(userRepo)
}

export function createGetUserByIdUseCase() {
  return new GetUserByIdUseCase(userRepo, businessRepo, claimRepo)
}

// Transaction manager factory
export function createTransactionManager() {
  return transactionManager
}

// Export repos for future use case wiring
export { voucherRepo, claimRepo, businessRepo, categoryRepo, userRepo }
