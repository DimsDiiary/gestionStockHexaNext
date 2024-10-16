import { Projet } from '../../domain/entities/Projet';
import { IProjetRepository } from '../../domain/port/IProjetRepository';

export class CreateProjetUseCase {
    constructor(private projetRepository: IProjetRepository) {}
    async execute(projetData: Omit<Projet, 'id'>): Promise<Projet> {
        const projet = Projet.create(projetData);
        return await this.projetRepository.create(projet);
    }
}
