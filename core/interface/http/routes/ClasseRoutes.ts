import { NextRequest } from 'next/server';
import { ClasseController } from '@/core/infra/adapters/controllers/ClasseController';

const controller = new ClasseController();

export async function POST(req: NextRequest) {
    return await controller.createClasse(req);
}

export async function GET() {
    return await controller.getAllClasses();
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return await controller.updateClasse(req, params.id);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return await controller.deleteClasse(params.id);
}