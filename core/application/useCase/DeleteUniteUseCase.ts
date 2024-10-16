import { Unite } from '../../domain/entities/Unite';
import { IUniteRepository } from '../../domain/port/IUniteRepository';

export class DeleteUniteUseCase {
    constructor(private uniteRepository: IUniteRepository) {}

    async execute(id: string, nom: string, symbole: string): Promise<Unite> {
        const unite = await this.uniteRepository.findById(id);
        if (!unite) {
            throw new Error("Unité non trouvée");
        }
        unite.update(nom, symbole);
        return await this.uniteRepository.update(unite);
    }
}