import { ISortieRepository } from '../../domain/port/ISortieRepository';
import { Sortie } from '../../domain/entities/Sortie';

export class GetSortiesUseCase {
  constructor(private readonly sortieRepository: ISortieRepository) {}

  async execute(): Promise<Sortie[]> {
    return this.sortieRepository.findAll();
  }
}