import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { BookingRepository } from "../repository/booking.repo";

@Processor("payments")
export class PaymentsProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentsProcessor.name);

  constructor(private readonly bookingRepo: BookingRepository) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`[${job.name}] Processando job ${job.id}`);

    switch (job.name) {
      case "process-payment":
        return this.processPayment(job);
      case "process-payout":
        return this.processPayout(job);
      case "process-refund":
        return this.processRefund(job);
      default:
        this.logger.warn(`Job desconhecido: ${job.name}`);
    }
  }

  private async processPayment(job: Job): Promise<void> {
    const { bookingId, clientId, totalPrice } = job.data;
    try {
      await this.bookingRepo.processPayment({
        bookingId,
        clientId,
        totalPrice,
      });
      this.logger.log(
        `[process-payment] Pagamento processado → booking ${bookingId}`,
      );
    } catch (error) {
      this.logger.error(
        `[process-payment] Falhou → booking ${bookingId}: ${error.message}`,
      );
      throw error;
    }
  }

  private async processPayout(job: Job): Promise<void> {
    const { bookingId, providerId, totalPrice } = job.data;
    try {
      await this.bookingRepo.processPayout({
        bookingId,
        providerId,
        totalPrice,
      });
      this.logger.log(
        `[process-payout] Payout processado → booking ${bookingId}`,
      );
    } catch (error) {
      this.logger.error(
        `[process-payout] Falhou → booking ${bookingId}: ${error.message}`,
      );
      throw error;
    }
  }

  private async processRefund(job: Job): Promise<void> {
    const { bookingId, clientId, totalPrice } = job.data;
    try {
      await this.bookingRepo.processRefund({ bookingId, clientId, totalPrice });
      this.logger.log(
        `[process-refund] Refund processado → booking ${bookingId}`,
      );
    } catch (error) {
      this.logger.error(
        `[process-refund] Falhou → booking ${bookingId}: ${error.message}`,
      );
      throw error;
    }
  }
}
