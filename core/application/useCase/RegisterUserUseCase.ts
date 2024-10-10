import { IAuthService } from "@/core/domain/port/IAuthService";
import { Users } from "@/core/domain/entities/User";

export class RegisterUserUseCase {
    constructor(private readonly authService: IAuthService) {}

    async execute(userData: Omit<Users, 'id'>): Promise<Users> {
        return this.authService.register(userData);
    }
}

