import {
  Body, Controller, Headers, HttpCode, HttpStatus, Post, UseGuards, Req, Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { WebhookService }        from '../services/webhook.service';
import { WebhookPayloadInput }   from '../inputs/webhook-payload.input';
import { WebhookSignatureGuard } from '../../../common/guards/webhook-signature.guard';
import { Public }                from '../../../common/decorators/public.decorator';

@ApiTags('Webhooks')
@Public()
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @UseGuards(WebhookSignatureGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receber webhook externo com validação HMAC' })
  @ApiHeader({ name: 'x-signature', description: 'sha256=<hmac_hex>', required: true })
  @ApiResponse({ status: 200, description: 'Processado' })
  @ApiResponse({ status: 401, description: 'Assinatura inválida' })
  async receive(
    @Body() input: WebhookPayloadInput,
    @Headers('x-signature') signature: string,
  ) {
    return this.webhookService.handle(input, signature);
  }
}
