import { ISortieRepository } from '../../domain/port/ISortieRepository';
import { Sortie, SortieId, UpdateSortie } from '../../domain/entities/Sortie';

export class UpdateSortieUseCase {
  constructor(private readonly sortieRepository: ISortieRepository) {}

  async execute(id: SortieId, sortieData: UpdateSortie): Promise<Sortie> {
    return this.sortieRepository.update(id, sortieData);
  }
}