import { IGrandCaisseRepository } from '@/core/domain/port/IGrandCaisseRepository';
import { GrandCaisse } from '@/core/domain/entities/GrandCaisse';

export class GetAllGrandCaissesUseCase {
  constructor(private readonly grandCaisseRepository: IGrandCaisseRepository) {}

  async execute(): Promise<GrandCaisse[]> {
    return this.grandCaisseRepository.findAll();
  }
}