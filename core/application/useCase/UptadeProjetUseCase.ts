import { Projet } from '../../domain/entities/Projet';
import { IProjetRepository } from '../../domain/port/IProjetRepository';

export class UpdateProjetUseCase {
    constructor(private projetRepository: IProjetRepository) {}

    async execute(id: string, projetData: Partial<Omit<Projet, 'id'>>): Promise<Projet> {
        const projet = await this.projetRepository.findById(id);
        if (!projet) {
            throw new Error('Projet non trouvé');
        }
        projet.update(projetData);
        return await this.projetRepository.update(projet);
    }
}