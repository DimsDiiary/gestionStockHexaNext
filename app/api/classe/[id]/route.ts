import { NextRequest } from 'next/server';
import { ClasseController } from '@/core/infra/adapters/controllers/ClasseController';

const controller = new ClasseController();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  return controller.updateClasse(request, id);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  return controller.deleteClasse(id);
}
