export abstract class DomainEvent {
  public readonly eventName:  string;
  public readonly occurredAt: Date;
  constructor(eventName: string) {
    this.eventName  = eventName;
    this.occurredAt = new Date();
  }
}
