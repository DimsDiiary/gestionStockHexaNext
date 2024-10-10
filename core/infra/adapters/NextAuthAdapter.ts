import { IAuthService } from "@/core/domain/port/IAuthService";
import { Users } from "@/core/domain/entities/User";
import { signIn } from "next-auth/react";
export class NextAuthAdapter implements IAuthService {
  async login(email: string, password: string): Promise<string | null> {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (result?.error) return null;
    return email; 
  }

  async register(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userData: Omit<Users, 'id'>
  ): Promise<Users> {
    // TODO: Implement registration using userData
    throw new Error('Method not implemented.');
  }
}