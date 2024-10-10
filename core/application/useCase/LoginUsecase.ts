import { IAuthService } from "@/core/domain/port/IAuthService";

export class LoginUsecase {
    constructor(private readonly authService: IAuthService) {}

    async execute(email: string, password: string): Promise<string | null> {
        return this.authService.login(email, password);
    }
}
