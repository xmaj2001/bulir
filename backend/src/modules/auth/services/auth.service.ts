// import { ConflictException, Injectable } from '@nestjs/common';
// import SessionRepository from '../repository/session.repo';
// import UserRepository from 'src/modules/user/repository/user.repo';
// import { AuthRegisterInput } from '../inputs/auth.input';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly session: SessionRepository,
//     private readonly user: UserRepository,
//   ) {}

//   async registerUser(input: AuthRegisterInput) {
//     const existUserWithEmail = await this.user.findByEmail(input.email);
//     if (existUserWithEmail) {
//       throw new ConflictException(`O email ${input.email} já está em uso`);
//     }

//     const existUserWithNif = await this.user.findByNif(input.nif);
//     if (existUserWithNif) {
//       throw new ConflictException(`O NIF ${input.nif} já está em uso`);
//     }

//     const passwordHash = await bcrypt.hash(input.password, 10);

//     const newUser = new UserEntity();
//     newUser.id = randomUUID();
//     newUser.name = input.name;
//     newUser.email = input.email;
//     newUser.nif = input.nif;
//     newUser.role = input.role;
//     newUser.balance = 0;
//     newUser.setPassword(passwordHash);
//     newUser.createdAt = new Date();
//     newUser.updatedAt = new Date();

//     const createdUser = await this.user.create(newUser);

//     delete (createdUser as any).password;

//     return createdUser;
//   }
// }
