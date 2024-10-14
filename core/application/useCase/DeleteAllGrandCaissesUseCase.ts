import { IGrandCaisseRepository } from '@/core/domain/port/IGrandCaisseRepository';

export class DeleteAllGrandCaissesUseCase {
  constructor(private readonly grandCaisseRepository: IGrandCaisseRepository) {}

  async execute(): Promise<void> {
    return this.grandCaisseRepository.deleteAll();
  }
}