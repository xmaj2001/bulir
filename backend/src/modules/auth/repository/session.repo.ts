import SessionEntity from '../entities/session.entity';

export default abstract class SessionRepository {
  abstract create(session: SessionEntity): Promise<SessionEntity>;
  abstract findById(id: string): Promise<SessionEntity | null>;
  abstract findByUserId(id: string): Promise<SessionEntity | null>;
  abstract findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<SessionEntity | null>;
  abstract revoke(id: string): Promise<void>;
  abstract getActiveForDevice(
    userId: string,
    device: string,
  ): Promise<SessionEntity | null>;
  abstract getLatest(userId: string): Promise<SessionEntity | null>;
  abstract revokeAllByUserId(userId: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
}
