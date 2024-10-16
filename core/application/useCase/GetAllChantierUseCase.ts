import { Chantier } from '../../domain/entities/Chantier';
import { IChantierRepository } from '../../domain/port/IChantierRepository';

export class GetAllChantiersUseCase {
    constructor(private chantierRepository: IChantierRepository) {}

    async execute(): Promise<Chantier[]> {
        return await this.chantierRepository.findAll();
    }
}