import { Users } from "../entities/User";

export interface IAuthService {
    login(email: string, password: string): Promise<string | null>;
    register(userData: Omit<Users, 'id'>): Promise<Users>;
}
