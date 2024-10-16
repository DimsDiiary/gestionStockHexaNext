import { Unite } from '../../domain/entities/Unite';
import { IUniteRepository } from '../../domain/port/IUniteRepository';

export class CreateUniteUseCase {
    constructor(private uniteRepository: IUniteRepository) {}

    async execute(nom: string, symbole: string): Promise<Unite> {
        const unite = Unite.create(Date.now().toString(), nom, symbole);
        return await this.uniteRepository.create(unite);
    }
}