import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";
import { UserRepository } from "@modules/user/repository/user.repo";
import { BookingStatus } from "../entities/booking.entity";
import {
  WalletTransactionEntity,
  WalletTxReason,
} from "../entities/wallet-transaction.entity";

@Processor("payments")
export class ProcessPaymentProcessor extends WorkerHost {
  private readonly logger = new Logger(ProcessPaymentProcessor.name);

  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly userRepo: UserRepository,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { bookingId, clientId, amount } = job.data;

    this.logger.log(
      `Processando pagamento para Job ${job.id} (Booking: ${bookingId})`,
    );

    try {
      await this.bookingRepo.processPayment({
        bookingId,
        clientId,
        totalPrice: amount,
      });

      this.logger.log(
        `Pagamento processado com sucesso para booking ${bookingId}`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao processar pagamento para booking ${bookingId}: ${error.message}`,
      );

      const booking = await this.bookingRepo.findById(bookingId);
      if (booking) {
        booking.cancel(`Falha no pagamento: ${error.message}`);
        await this.bookingRepo.save(booking);
      }

      throw error;
    }
  }
}
