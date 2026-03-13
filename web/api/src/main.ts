import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { AppValidationPipe } from "./common/pipes/validation.pipe";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true, // necessário para WebhookSignatureGuard
    bufferLogs: true,
  });

  // app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const port = config.get<number>("app.port") ?? 3000;
  const name = config.get<string>("app.name") ?? "backend";
  const isProd = config.get<boolean>("app.isProd") ?? false;

  // ── Cookie Parser ───────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ── Global Pipes / Filters / Interceptors ───────────────────────────────────
  app.useGlobalPipes(AppValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Swagger ─────────────────────────────────────────────────────────────────
  if (!isProd) {
    const swaggerCfg = new DocumentBuilder()
      .setTitle(name)
      .setDescription(
        `
## ${name} API

### Autenticação
- Rotas protegidas requerem **Bearer Token** (Access Token, 15min)
- Obtém o token via \`POST /auth/email/sign-in\` ou \`POST /auth/provider\`
- Renova via \`POST /auth/refresh\` (usa refresh token no cookie HTTP-only)

### Rotas públicas
- Marcadas com \`@Public()\` — não requerem token
- Auth routes: sign-up, sign-in, verify, provider, refresh

### WebSocket
- Namespace: \`/exercises\`
- Evento: \`join\` → envia \`{ userId }\`
- Recebe: \`submission:result\` com o resultado do exercício
      `,
      )
      .setVersion("1.0.0")
      .addBearerAuth()
      .addCookieAuth("refresh_token")
      .build();

    SwaggerModule.setup(
      "swagger",
      app,
      SwaggerModule.createDocument(app, swaggerCfg),
      {
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
        },
      },
    );
  }

  app.enableCors({
    origin: isProd ? (process.env.CORS_ORIGIN ?? false) : true,
    credentials: true,
  });

  await app.listen(port);
  console.log(`\n🚀 ${name}: http://localhost:${port}`);
  if (!isProd) console.log(`📚 Swagger:  http://localhost:${port}/swagger`);
}

bootstrap();
