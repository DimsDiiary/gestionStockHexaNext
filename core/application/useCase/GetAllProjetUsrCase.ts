import { Projet } from '../../domain/entities/Projet';
import { IProjetRepository } from '../../domain/port/IProjetRepository';

export class GetAllProjetsUseCase {
    constructor(private projetRepository: IProjetRepository) {}

    async execute(): Promise<Projet[]> {
        return await this.projetRepository.findAll();
    }
}