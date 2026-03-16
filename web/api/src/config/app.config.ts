export const appConfig = () => ({
  app: {
    name: process.env.APP_NAME ?? "Transcender",
    port: parseInt(process.env.PORT ?? "3000", 10),
    env: process.env.NODE_ENV ?? "development",
    isDev: (process.env.NODE_ENV ?? "development") === "development",
    isProd: process.env.NODE_ENV === "production",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? "access-secret",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "refresh-secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "next-auth-secret",
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  email: {
    provider: process.env.EMAIL_PROVIDER ?? "resend",
    from: process.env.EMAIL_FROM ?? "noreply@transcender.app",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    smtp: {
      host: process.env.SMTP_HOST ?? "",
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  },
  otp: {
    expiresSeconds: parseInt(process.env.OTP_EXPIRES_SECONDS ?? "300", 10),
  },
  log: {
    level: process.env.LOG_LEVEL ?? "debug",
    pretty: process.env.LOG_PRETTY === "true",
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET ?? "webhook-secret",
  },
});
