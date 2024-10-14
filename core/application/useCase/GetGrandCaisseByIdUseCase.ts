import { IGrandCaisseRepository } from '@/core/domain/port/IGrandCaisseRepository';
import { GrandCaisse, GrandCaisseId } from '@/core/domain/entities/GrandCaisse';

export class GetGrandCaisseByIdUseCase {
  constructor(private readonly grandCaisseRepository: IGrandCaisseRepository) {}

  async execute(id: GrandCaisseId): Promise<GrandCaisse | null> {
    return this.grandCaisseRepository.findById(id);
  }
}