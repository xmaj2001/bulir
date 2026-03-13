import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PrismaService } from "../../../shared/database/prisma.service";
import { WebhookPayloadInput } from "../inputs/webhook-payload.input";

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  async handle(
    input: WebhookPayloadInput,
    signature?: string,
  ): Promise<{ received: boolean }> {
    this.logger.log(`[Webhook] ${input.provider}.${input.event}`);

    // await this.prisma.webhookLog.create({
    //   data: {
    //     provider: input.provider, event: input.event,
    //     payload: input.data as any, signature: signature ?? null,
    //     verified: !!signature,
    //   },
    // });

    await this.processEvent(input);
    return { received: true };
  }

  private async processEvent(input: WebhookPayloadInput): Promise<void> {
    switch (`${input.provider}.${input.event}`) {
      case "judge0.submission.completed":
        // Emite evento interno → ExerciseGateway envia via WebSocket ao cliente
        this.emitter.emit("EXERCISE.SUBMISSION_RESULT", {
          userId: (input.data as any).userId,
          submissionId: (input.data as any).submissionId,
          status: (input.data as any).status,
          executionTimeMs: (input.data as any).time,
          memoryUsedMb: (input.data as any).memory,
        });
        break;
      default:
        this.logger.debug(
          `[Webhook] Evento não mapeado: ${input.provider}.${input.event}`,
        );
    }
  }
}
