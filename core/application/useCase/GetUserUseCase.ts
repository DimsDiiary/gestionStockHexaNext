import { IUserRepository } from "@/core/domain/port/IUserRespository";
import { Users } from "@/core/domain/entities/User";

export class GetUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(email: string): Promise<Users | null> {
        return this.userRepository.findByEmail(email);
    }
}

