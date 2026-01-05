import { PasswordHasher } from 'src/adapters/hasher/password-hasher.port';

class FakePasswordHasher implements PasswordHasher {
  async hash(p: string) {
    await new Promise((r) => setTimeout(r, 10));
    return `hashed-${p}`;
  }
  async compare(p: string, h: string) {
    await new Promise((r) => setTimeout(r, 10));
    return h === `hashed-${p}`;
  }
}
export default FakePasswordHasher;
