import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { BookingCreatedEvent } from "../events/booking-created.event";
import { BookingCompletedEvent } from "../events/booking-completed.event";
import { BookingCancelledEvent } from "../events/booking-cancelled.event";
import { BookingStatus } from "../entities/booking.entity";
import { BookingConfirmedEvent } from "../events/booking-confirmed.event";

@WebSocketGateway({
  namespace: "bookings",
  cors: { origin: "*" }, // TODO: url do frontend
})
export class BookingGateway {
  private readonly logger = new Logger(BookingGateway.name);

  @WebSocketServer()
  private server: Server;

  // ── HANDLE CONNECTION ─────────────────────────────────────────────────────
  // Só usuarios autenticados podem se conectar
  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId as string;

    if (!userId) {
      client.disconnect();
      return;
    }

    const room = `user:${userId}`;
    client.join(room);

    this.logger.log(`[WS] conectado: ${client.id} → room "${room}"`);
  }

  // ── BOOKING.CREATED ───────────────────────────────────────────────────────
  @OnEvent("BOOKING.CREATED")
  handleCreated(event: BookingCreatedEvent) {
    this.server.to(`provider:${event.providerId}`).emit("booking:new_request", {
      bookingId: event.bookingId,
      clientId: event.clientId,
      totalPrice: event.totalPrice,
      message: "Tens um novo pedido de reserva",
    });

    this.logger.log(`[WS] booking:new_request → provider ${event.providerId}`);
  }

  // ── BOOKING.CONFIRMED ─────────────────────────────────────────────────────
  @OnEvent("BOOKING.CONFIRMED")
  handleConfirmed(event: BookingConfirmedEvent) {
    this.server.to(`client:${event.clientId}`).emit("booking:confirmed", {
      bookingId: event.bookingId,
      message: "O teu pedido foi confirmado pelo prestador",
    });

    this.logger.log(`[WS] booking:confirmed → client ${event.clientId}`);
  }

  // ── BOOKING.COMPLETED ─────────────────────────────────────────────────────
  @OnEvent("BOOKING.COMPLETED")
  handleCompleted(event: BookingCompletedEvent) {
    this.server.to(`client:${event.clientId}`).emit("booking:completed", {
      bookingId: event.bookingId,
      totalPrice: event.totalPrice,
      message: "O serviço foi concluído. O pagamento foi processado.",
    });

    this.logger.log(`[WS] booking:completed → client ${event.clientId}`);
  }

  // ── BOOKING.CANCELLED ─────────────────────────────────────────────────────
  @OnEvent("BOOKING.CANCELLED")
  handleCancelled(event: BookingCancelledEvent) {
    const hadPayment = event.previousStatus === BookingStatus.CONFIRMED;

    this.server
      .to(`client:${event.booking.clientId}`)
      .emit("booking:cancelled", {
        bookingId: event.booking.id,
        refund: hadPayment,
        message: hadPayment
          ? "A tua reserva foi cancelada. O reembolso está a ser processado."
          : "A tua reserva foi cancelada.",
      });

    this.server
      .to(`provider:${event.booking.service?.providerId}`)
      .emit("booking:cancelled", {
        bookingId: event.booking.id,
        message: "Uma reserva foi cancelada",
      });

    this.logger.log(`[WS] booking:cancelled → client + provider`);
  }

  // ── PAYMENT.PROCESSED ─────────────────────────────────────────────────────
  notifyPaymentProcessed(clientId: string, bookingId: string) {
    this.server.to(`client:${clientId}`).emit("payment:processed", {
      bookingId,
      message: "Pagamento processado com sucesso. Reserva confirmada.",
    });
  }

  // ── PAYMENT.FAILED ────────────────────────────────────────────────────────
  notifyPaymentFailed(clientId: string, bookingId: string, reason: string) {
    this.server.to(`client:${clientId}`).emit("payment:failed", {
      bookingId,
      reason,
      message: "O pagamento falhou. Verifica o teu saldo.",
    });
  }
}
