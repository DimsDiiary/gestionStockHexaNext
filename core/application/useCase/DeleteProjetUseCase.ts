import { IProjetRepository } from '../../domain/port/IProjetRepository';

export class DeleteProjetUseCase {
    constructor(private projetRepository: IProjetRepository) {}

    async execute(id: string): Promise<void> {
        await this.projetRepository.deleteRelatedEntities(id);
        await this.projetRepository.delete(id);
    }
}