import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { AppValidationPipe } from "./common/pipes/validation.pipe";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

  const config = app.get(ConfigService);
  const port = config.get<number>("app.port") ?? 3000;
  const name = config.get<string>("app.name") ?? "backend";
  const isProd = config.get<boolean>("app.isProd") ?? false;

  app.use(cookieParser());

  app.useGlobalPipes(AppValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (!isProd) {
    const swaggerCfg = new DocumentBuilder()
      .setTitle(name)
      .setDescription("")
      .setVersion("1.0.0")
      .addBearerAuth()
      .addCookieAuth("refresh_token")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerCfg);
    app.use(
      "/swagger",
      apiReference({
        spec: {
          content: document,
        },
        theme: "dark",
      }),
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
