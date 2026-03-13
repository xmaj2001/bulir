import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { UserRepository } from "../repository/user.repo";

@Injectable()
export class GetUserService {
  private readonly logger = new Logger(GetUserService.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");
    return user.publicData();
  }

  async getAll() {
    const users = await this.userRepo.findAll();
    return users.map((entity) => entity.publicData());
  }
}
