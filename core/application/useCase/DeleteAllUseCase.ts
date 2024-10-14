import { ISortieRepository } from '../../domain/port/ISortieRepository';

export class DeleteAllSortiesUseCase {
  constructor(private readonly sortieRepository: ISortieRepository) {}

  async execute(): Promise<number> {
    return this.sortieRepository.deleteAll();
  }
}