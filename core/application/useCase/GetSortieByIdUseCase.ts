import { ISortieRepository } from '../../domain/port/ISortieRepository';
import { Sortie, SortieId } from '../../domain/entities/Sortie';

export class GetSortieByIdUseCase {
  constructor(private readonly sortieRepository: ISortieRepository) {}

  async execute(id: SortieId): Promise<Sortie | null> {
    return this.sortieRepository.findById(id);
  }
}