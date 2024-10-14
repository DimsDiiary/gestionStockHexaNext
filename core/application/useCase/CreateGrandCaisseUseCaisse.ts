import { IGrandCaisseRepository } from '@/core/domain/port/IGrandCaisseRepository';
import { NewGrandCaisse, GrandCaisse } from '@/core/domain/entities/GrandCaisse';

export class CreateGrandCaisseUseCase {
  constructor(private readonly grandCaisseRepository: IGrandCaisseRepository) {}

  async execute(grandCaisseData: NewGrandCaisse): Promise<GrandCaisse> {
    return this.grandCaisseRepository.create(grandCaisseData);
  }
}