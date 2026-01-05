export default class SessionEntity {
  public id: string;
  public userId: string;

  public refreshTokenHash: string;

  public device: string;
  public ip: string;
  // public userAgent: string;

  public revokedAt?: Date;
  // public expiresAt: Date;

  public createdAt: Date;
  public updatedAt: Date;

  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial);
  }
}
