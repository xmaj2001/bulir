import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[] | []>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByNif(nif: string): Promise<UserEntity | null>;
  abstract deposit(
    userId: string,
    balanceBefore: number,
    balanceAfter: number,
  ): Promise<void>;
  abstract save(user: UserEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
