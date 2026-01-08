export type UserRole = 'client' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  nif: string;
  role: UserRole;
  balance: number;
}
