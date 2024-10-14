import { Unite } from '@/core/domain/entities/Unite';
import { IUniteRepository } from '@/core/domain/port/IUniteRepository';

export class CreateUniteUseCase {
  constructor(private uniteRepository: IUniteRepository) {}

  async execute(nom: string, symbole: string): Promise<Unite> {
    const unite = new Unite('', nom, symbole);
    return this.uniteRepository.create(unite);
  }
}