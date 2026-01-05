import SessionEntity from '../../entities/session.entity';
import SessionRepository from '../session.repo';

export default class FakeSessionRepository implements SessionRepository {
  private sessions: SessionEntity[] = [];

  async create(session: SessionEntity): Promise<SessionEntity> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.sessions.push(session);
    return session;
  }

  async findById(id: string): Promise<SessionEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const session = this.sessions.find((s) => s.id === id);
    return session || null;
  }

  async findByUserId(id: string): Promise<SessionEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const sessions = this.sessions.filter((s) => s.userId === id);
    if (sessions.length === 0) return null;
    return sessions.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    );
  }

  async findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<SessionEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const session = this.sessions.find(
      (s) => s.refreshTokenHash === refreshTokenHash,
    );
    return session || null;
  }

  async revoke(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const session = await this.findById(id);
    if (session) {
      session.revokedAt = new Date();
    }
  }

  async getActiveForDevice(
    userId: string,
    device: string,
  ): Promise<SessionEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const session = this.sessions.find(
      (s) => s.userId === userId && s.device === device && !s.revokedAt,
    );
    return session || null;
  }

  async getLatest(userId: string): Promise<SessionEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const sessions = this.sessions.filter((s) => s.userId === userId);
    if (sessions.length === 0) return null;
    return sessions.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    );
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.sessions.forEach((s) => {
      if (s.userId === userId) {
        s.revokedAt = new Date();
      }
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.sessions = this.sessions.filter((s) => s.userId !== userId);
  }
}
