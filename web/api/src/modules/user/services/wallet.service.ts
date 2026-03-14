import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repository/user.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { DepositEvent } from "../events/deposit-event";

@Injectable()
export class WalletService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async deposit(userId: string, amount: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");

    const balanceBefore = Number(user.balance);
    const balanceAfter = balanceBefore + amount;

    await this.userRepo.deposit(userId, balanceBefore, balanceAfter); // TODO: colocar esse procedimento dentro de um Job

    this.eventBus.publish([
      new DepositEvent(userId, amount, balanceBefore, balanceAfter),
    ]);

    return {
      userId,
      amount,
      newBalance: balanceAfter,
    };
  }

  async getBalance(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");

    return {
      balance: Number(user.balance),
    };
  }
}
