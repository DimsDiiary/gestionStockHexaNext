import { Projet } from '../../domain/entities/Projet';
import { IProjetRepository } from '../../domain/port/IProjetRepository';

export class GetAllProjetsUseCase {
    constructor(private projetRepository: IProjetRepository) {}

    async execute(): Promise<Projet[]> {
        const projets = await this.projetRepository.findAll();
        return projets.map(p => Projet.create(p));
    }
}
