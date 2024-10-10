import { IUserRepository } from "@/core/domain/port/IUserRespository";
import { Users } from "@/core/domain/entities/User";

export class ManageUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async getAll(): Promise<Users[]> {
    return this.userRepository.findMany();
  }

  async update(id: string, userData: Partial<Users>): Promise<Users> {
    return this.userRepository.update(id, userData);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}