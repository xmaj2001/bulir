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
