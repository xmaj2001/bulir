import { Response } from "express";
import { ConfigService } from "@nestjs/config";

export function setRefreshCookie(
  res: Response,
  config: ConfigService,
  token: string,
): void {
  const isProd = config.get<boolean>("app.isProd") ?? false;
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
