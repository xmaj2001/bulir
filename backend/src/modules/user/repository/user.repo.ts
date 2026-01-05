import UserEntity from '../entities/user.entity';

export default abstract class UserRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findbyNif(nif: string): Promise<UserEntity | null>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract updateBalance(
    userId: string,
    amount: number,
  ): Promise<UserEntity | null>;
  abstract delete(userId: string): Promise<void>;
}
