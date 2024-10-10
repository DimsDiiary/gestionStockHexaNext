import { IAuthService } from "@/core/domain/port/IAuthService";
import { IUserRepository } from "@/core/domain/port/IUserRespository";
import { Users } from "@/core/domain/entities/User";
import { compare, hash } from "bcrypt";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    const isPasswordValid = await compare(password, user.password);
    return isPasswordValid ? user.id : null;
  }

  async register(userData: Omit<Users, 'id'>): Promise<Users> {
    const hashedPassword = await hash(userData.password, 10);
    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }
}