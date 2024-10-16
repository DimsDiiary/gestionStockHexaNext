import { IClasseRepository } from '../../domain/port/IClasseRepository';

export class DeleteClasseUseCase {
    constructor(private classeRepository: IClasseRepository) {}

    async execute(id: string): Promise<void> {
        const isUsed = await this.classeRepository.isUsedInAchat(id);
        if (isUsed) {
            throw new Error('Impossible de supprimer cette classe car elle est utilisée dans un ou plusieurs achats.');
        }
        await this.classeRepository.delete(id);
    }
}