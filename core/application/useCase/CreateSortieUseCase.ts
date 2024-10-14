import { ISortieRepository } from '../../domain/port/ISortieRepository';
import { NewSortie, Sortie } from '../../domain/entities/Sortie';

export class CreateSortieUseCase {
  constructor(private readonly sortieRepository: ISortieRepository) {}

  async execute(sortieData: NewSortie): Promise<Sortie> {
    return this.sortieRepository.create(sortieData);
  }
}