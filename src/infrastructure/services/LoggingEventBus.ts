import type { DomainEvent, IDomainEventBus } from '@/domain/events'

/**
 * Simple event bus that logs events. Replace with email/notification
 * service when Resend email templates are implemented (Week 2 outstanding).
 */
export class LoggingEventBus implements IDomainEventBus {
  async publish(event: DomainEvent): Promise<void> {
    console.log(`[DomainEvent] ${event.type}:`, JSON.stringify(event.payload))
  }
}
