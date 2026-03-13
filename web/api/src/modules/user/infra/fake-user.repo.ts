import { UserRepository } from "../repository/user.repo";
import { UserEntity } from "../entities/user.entity";

export class FakeUserRepository extends UserRepository {
  private store = new Map<string, UserEntity>();

  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  async findByEmail(email: string) {
    return [...this.store.values()].find((u) => u.email === email) ?? null;
  }
  async findByNif(nif: string) {
    return [...this.store.values()].find((u) => u.nif === nif) ?? null;
  }
  async save(user: UserEntity) {
    this.store.set(user.id, user);
  }
  async delete(id: string) {
    this.store.delete(id);
  }

  async findAll(): Promise<UserEntity[] | []> {
    return [...this.store.values()];
  }

  snapshot() {
    return [...this.store.values()];
  }
  clear() {
    this.store.clear();
  }
}
