import { ISortieRepository } from '../../domain/port/ISortieRepository';
import { SortieId } from '../../domain/entities/Sortie';

export class DeleteSortieUseCase {
  constructor(private readonly sortieRepository: ISortieRepository) {}

  async execute(id: SortieId): Promise<void> {
    return this.sortieRepository.delete(id);
  }
}