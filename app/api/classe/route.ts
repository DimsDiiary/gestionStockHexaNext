import { NextRequest } from 'next/server';
import { ClasseController } from '@/core/infra/adapters/controllers/ClasseController';

const controller = new ClasseController();

export async function POST(req: NextRequest) {
  return await controller.createClasse(req);
}

export async function GET() {
  return await controller.getAllClasses();
}
