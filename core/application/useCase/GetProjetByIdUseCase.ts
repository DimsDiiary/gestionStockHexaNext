import { Projet } from '../../domain/entities/Projet';
import { IProjetRepository } from '../../domain/port/IProjetRepository';

export class GetProjetByIdUseCase {
    constructor(private projetRepository: IProjetRepository) {}

    async execute(id: string): Promise<Projet | null> {
        return await this.projetRepository.findById(id);
    }
}