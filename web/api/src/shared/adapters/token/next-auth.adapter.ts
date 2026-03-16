import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPort, TokenPair } from "./token.port";

@Injectable()
export class NextAuthTokenAdapter extends TokenPort {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  generatePair(payload: { sub: string; role: string }): TokenPair {
    const access_token = this.jwt.sign(payload, {
      secret: this.config.get<string>("nextAuthSecret"),
      expiresIn: this.config.get<string>("jwt.accessExpiresIn"), // TODO: usar config do next-auth
    });
    const refresh_token = this.jwt.sign(
      { sub: payload.sub },
      {
        secret: this.config.get<string>("nextAuthSecret"),
        expiresIn: this.config.get<string>("jwt.refreshExpiresIn"), // TODO: usar config do next-auth
      },
    );
    return { access_token, refresh_token };
  }

  verifyAccess(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get<string>("nextAuthSecret"),
    });
  }

  verifyRefresh(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get<string>("nextAuthSecret"),
    });
  }
}
