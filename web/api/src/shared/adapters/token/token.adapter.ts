import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPort, TokenPair } from "./token.port";

@Injectable()
export class TokenAdapter extends TokenPort {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  generatePair(payload: { sub: string; role: string }): TokenPair {
    const access_token = this.jwt.sign(payload, {
      secret: this.config.get<string>("jwt.accessSecret"),
      expiresIn: this.config.get<string>("jwt.accessExpiresIn"),
    });
    const refresh_token = this.jwt.sign(
      { sub: payload.sub },
      {
        secret: this.config.get<string>("jwt.refreshSecret"),
        expiresIn: this.config.get<string>("jwt.refreshExpiresIn"),
      },
    );
    return { access_token, refresh_token };
  }

  verifyAccess(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get<string>("jwt.accessSecret"),
    });
  }

  verifyRefresh(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get<string>("jwt.refreshSecret"),
    });
  }
}
