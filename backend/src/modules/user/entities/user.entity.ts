export enum UserRole {
  PROVIDER = 'provider',
  CLIENT = 'client',
}

export default class UserEntity {
  public id: string;
  public name: string;
  public nif: string;
  public email: string;
  public role: UserRole;
  public balance: number;
  private password: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(partial?: Partial<UserEntity>) {
    this.balance = 0;
    this.password = 'hashed-123456';
    Object.assign(this, partial);
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public getPassword(): string {
    return this.password;
  }
}
