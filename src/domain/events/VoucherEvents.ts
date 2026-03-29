import type { DomainEvent } from './DomainEvent'

export interface VoucherApprovedEvent extends DomainEvent {
  type: 'VOUCHER_APPROVED'
  payload: {
    voucherId: string
    businessId: string
    approvedBy: string
    title: string
  }
}

export interface VoucherRejectedEvent extends DomainEvent {
  type: 'VOUCHER_REJECTED'
  payload: {
    voucherId: string
    businessId: string
    rejectedBy: string
    reason?: string
    title: string
  }
}

export interface VoucherSubmittedEvent extends DomainEvent {
  type: 'VOUCHER_SUBMITTED'
  payload: {
    voucherId: string
    businessId: string
    title: string
  }
}

export function createVoucherApprovedEvent(
  voucherId: string,
  businessId: string,
  approvedBy: string,
  title: string,
): VoucherApprovedEvent {
  return {
    type: 'VOUCHER_APPROVED',
    occurredAt: new Date(),
    payload: { voucherId, businessId, approvedBy, title },
  }
}

export function createVoucherRejectedEvent(
  voucherId: string,
  businessId: string,
  rejectedBy: string,
  title: string,
  reason?: string,
): VoucherRejectedEvent {
  return {
    type: 'VOUCHER_REJECTED',
    occurredAt: new Date(),
    payload: { voucherId, businessId, rejectedBy, reason, title },
  }
}

export function createVoucherSubmittedEvent(
  voucherId: string,
  businessId: string,
  title: string,
): VoucherSubmittedEvent {
  return {
    type: 'VOUCHER_SUBMITTED',
    occurredAt: new Date(),
    payload: { voucherId, businessId, title },
  }
}
