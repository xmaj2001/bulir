import { UserRole } from 'src/modules/user/entities/user.entity';

export default interface IPayload {
  accessToken: string;
  role: UserRole;
  sessionId: string;
}
