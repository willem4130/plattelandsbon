export interface DomainEvent {
  type: string
  occurredAt: Date
  payload: Record<string, unknown>
}

export interface IDomainEventBus {
  publish(event: DomainEvent): Promise<void>
}
