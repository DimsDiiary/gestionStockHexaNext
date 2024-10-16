import { Chantier } from '../../domain/entities/Chantier';
import { IChantierRepository } from '../../domain/port/IChantierRepository';

export class GetChantierByIdUseCase {
    constructor(private chantierRepository: IChantierRepository) {}

    async execute(id: string): Promise<Chantier | null> {
        return await this.chantierRepository.findById(id);
    }
}