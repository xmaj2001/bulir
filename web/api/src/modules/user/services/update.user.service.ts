import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { UserRepository } from "../repository/user.repo";
import { UpdateUserInput } from "../inputs/update-user.input";

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(UpdateUserService.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string, input: UpdateUserInput) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");

    user.updateInfo(input);

    await this.userRepo.save(user);
    return user.publicData();
  }
}
