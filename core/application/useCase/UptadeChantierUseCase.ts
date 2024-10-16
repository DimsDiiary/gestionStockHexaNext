import { Chantier } from '../../domain/entities/Chantier';
import { IChantierRepository } from '../../domain/port/IChantierRepository';

export class UpdateChantierUseCase {
    constructor(private chantierRepository: IChantierRepository) {}

    async execute(id: string, chantierData: Partial<Omit<Chantier, 'id' | 'projetId'>>): Promise<Chantier> {
        const chantier = await this.chantierRepository.findById(id);
        if (!chantier) {
            throw new Error('Chantier non trouvé');
        }
        chantier.update(chantierData);
        return await this.chantierRepository.update(chantier);
    }
}