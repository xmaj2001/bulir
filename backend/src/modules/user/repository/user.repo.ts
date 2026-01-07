import UserEntity from '../entities/user.entity';

export default abstract class UserRepository {
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByNif(nif: string): Promise<UserEntity | null>;
  abstract updateBalance(
    userId: string,
    amount: number,
    tx?: any,
  ): Promise<UserEntity | null>;
  abstract update(user: UserEntity): Promise<UserEntity>;
  abstract debitBalance(
    userId: string,
    amount: number,
    tx?: any,
  ): Promise<UserEntity | null>;
  abstract delete(userId: string): Promise<void>;
}
