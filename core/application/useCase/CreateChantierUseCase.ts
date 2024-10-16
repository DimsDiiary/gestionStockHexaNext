import { Chantier } from '../../domain/entities/Chantier';
import { IChantierRepository } from '../../domain/port/IChantierRepository';

export class CreateChantierUseCase {
    constructor(private chantierRepository: IChantierRepository) {}

    async execute(chantierData: Omit<Chantier, 'id'>): Promise<Chantier> {
        const chantier = Chantier.create(chantierData);
        return await this.chantierRepository.create(chantier);
    }
}