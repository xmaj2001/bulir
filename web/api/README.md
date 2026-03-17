# Transcender — Backend

> NestJS 11 · Express · Prisma 6 · DDD · JWT Auth · BullMQ · WebSocket · Email Adapter

---

## Arrancar

```bash
npm install
cp .env.example .env   # preenche as variáveis

cd docker && docker-compose up postgres redis -d

npm run db:generate
npm run db:migrate
npm run start:dev
```

**Swagger:** http://localhost:3000/docs
**WebSocket:** ws://localhost:3000/exercises

---

## Estrutura

```
src/
├── modules/
│   ├── auth/          # Sign-up/in email, OTP, OAuth providers, Refresh token
│   │   ├── entities/  # VerificationEntity, PasswordResetEntity
│   │   ├── events/    # UserRegisteredEvent, OtpRequestedEvent
│   │   ├── jobs/      # SendOtpProcessor (BullMQ)
│   │   ├── listeners/ # UserRegisteredListener → gera OTP + enfileira email
│   │   └── services/  # EmailSignUp/In, VerifyOtp, ProviderSignIn, RefreshToken
│   ├── user/          # Aggregate: User + UserProfile + AuthProviderAccount
│   ├── gateway/       # ExerciseGateway (WebSocket /exercises)
│   └── webhook/       # Recepção webhooks HMAC (ex: Judge0)
├── shared/
│   ├── database/      # PrismaService + PrismaModule (global)
│   ├── entities/      # BaseEntity, DomainEvent
│   └── adapters/
│       ├── hash/      # HashPort → bcrypt
│       ├── token/     # TokenPort → JWT access + refresh
│       ├── email/     # EmailPort → Resend | SMTP (troca via .env)
│       ├── uuid/      # UUIDPort → crypto.randomUUID
│       └── event-bus/ # EventBusPort → EventEmitter2
└── common/
    ├── guards/        # JwtAuthGuard (global), RolesGuard, WebhookSignatureGuard
    ├── decorators/    # @Public(), @CurrentUser(), @Roles()
    ├── pipes/         # AppValidationPipe
    ├── interceptors/  # ResponseInterceptor
    └── filters/       # HttpExceptionFilter
```

---

## Auth Endpoints

```
POST /auth/email/sign-up    — registo (envia OTP por email)
POST /auth/email/sign-in    — login (bloqueia se email não verificado)
POST /auth/email/verify     — validar OTP (uso único, 5min)
POST /auth/provider         — OAuth: Google / GitHub / 42Intra
POST /auth/refresh          — renovar access token (cookie)
POST /auth/sign-out         — limpar cookie
GET  /users/me              — perfil autenticado
```

---

## Fluxo OTP

```
sign-up → UserRegisteredEvent → UserRegisteredListener
       → VerificationEntity.generate() → BullMQ 'auth' queue
       → SendOtpProcessor → EmailPort.send()
```

---

## Fluxo Exercícios (WebSocket)

```
POST /competitive/submit → BullMQ → Worker externo (Judge0)
  → Webhook POST /webhooks → WebhookService
  → EventEmitter EXERCISE.SUBMISSION_RESULT
  → ExerciseGateway.emit('submission:result') → cliente WS
```

---

## Adaptar Email Provider

No `.env`:
```
EMAIL_PROVIDER=resend   # ou smtp
RESEND_API_KEY=re_xxx   # se resend
SMTP_HOST=smtp.gmail.com  # se smtp
```

---

## Guards & Decorators

```typescript
// Rota pública (sem JWT)
@Public()
@Post('login')

// Só ADMIN
@Roles('ADMIN')
@UseGuards(RolesGuard)
@Get('admin')

// User autenticado
@Get('me')
me(@CurrentUser() user: AuthUser) { ... }
```

---

*XLobe-Tech — O Novo Horizonte da Inovação*
