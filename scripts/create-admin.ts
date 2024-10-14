import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const prisma = new PrismaClient();

// Schéma de validation pour les données d'entrée
const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 8 characters): ');
    const firstName = await question('Enter admin first name: ');
    const lastName = await question('Enter admin last name: ');

    const adminData = adminSchema.parse({
      email,
      password,
      firstName,
      lastName,
    });

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email: adminData.email } });
    if (existingUser) {
      console.error('User already exists');
      return;
    }

    // Hachez le mot de passe
    const hashedPassword = await hash(adminData.password, 10);

    // Créez l'utilisateur admin
    const user = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:', { id: user.id, email: user.email, role: user.role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid input:', error.errors);
    } else {
      console.error('Error creating admin user:', error);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();