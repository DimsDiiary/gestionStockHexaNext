import { Unite } from '../../domain/entities/Unite';
import { IUniteRepository } from '../../domain/port/IUniteRepository';

export class GetAllUnitesUseCase {
    constructor(private uniteRepository: IUniteRepository) {}

    async execute(): Promise<Unite[]> {
        return await this.uniteRepository.findAll();
    }
}