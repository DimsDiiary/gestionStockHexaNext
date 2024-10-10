import { AuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaUserRepository } from "@/core/infra/repositories/PrismaUserRepository"
import { AuthService } from "@/core/application/service/AuthService"
import { prisma } from "@/lib/prima"
import { z } from "zod"
import { User as PrismaUser, Role } from '@prisma/client';
import { User, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Définir le schéma Zod pour notre utilisateur étendu
const ExtendedUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['ADMIN', 'GESTIONNAIRE', 'COMPTABLE']),
});

// Étendre le type User de NextAuth
type ExtendedUser = User & PrismaUser;

// Étendre le type Session de NextAuth
interface ExtendedSession extends Session {
  user: {
    role?: 'ADMIN' | 'GESTIONNAIRE' | 'COMPTABLE';
    firstName?: string;
    lastName?: string;
  } & Session['user']
}

// Étendre le type JWT de NextAuth
interface ExtendedJWT extends JWT {
  role?: 'ADMIN' | 'GESTIONNAIRE' | 'COMPTABLE';
  firstName?: string;
  lastName?: string;
}

const userRepository = new PrismaUserRepository(prisma);
const authService = new AuthService(userRepository);

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await authService.login(credentials.email, credentials.password);
        try {
          const validatedUser = ExtendedUserSchema.parse(user);
          return {
            id: validatedUser.id,
            email: validatedUser.email,
            name: `${validatedUser.firstName} ${validatedUser.lastName}`,
            role: validatedUser.role,
          };
        } catch (error) {
          console.error('User validation failed:', error);
          throw new Error('Invalid user data');
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        try {
          const extendedUser = ExtendedUserSchema.parse(user);
          (token as ExtendedJWT).role = extendedUser.role;
          (token as ExtendedJWT).firstName = extendedUser.firstName;
          (token as ExtendedJWT).lastName = extendedUser.lastName;
        } catch (error) {
          console.error('User validation failed:', error);
          // Gérer l'erreur de manière appropriée
        }
      }
      return token;
    },
    session: ({ session, token }): ExtendedSession => {
      if (token && session.user) {
        const extendedToken = token as ExtendedJWT;
        (session.user as ExtendedUser).role = extendedToken.role as Role;
        (session.user as ExtendedUser).firstName = extendedToken.firstName ?? '';
        (session.user as ExtendedUser).lastName = extendedToken.lastName ?? '';
      }
      return session as ExtendedSession;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}