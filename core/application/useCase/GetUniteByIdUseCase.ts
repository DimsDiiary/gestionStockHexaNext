import { Unite } from '../../domain/entities/Unite';
import { IUniteRepository } from '../../domain/port/IUniteRepository';

export class GetUniteByIdUseCase {
    constructor(private uniteRepository: IUniteRepository) {}

    async execute(id: string): Promise<Unite | null> {
        return await this.uniteRepository.findById(id);
    }
}