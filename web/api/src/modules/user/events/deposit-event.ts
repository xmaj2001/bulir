import { DomainEvent } from "@shared/entities/domain-event.base";

export class DepositEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly balanceBefore: number,
    public readonly balanceAfter: number,
  ) {
    super("USER.DEPOSIT");
  }
}
