import { IGrandCaisseRepository } from '@/core/domain/port/IGrandCaisseRepository';
import { GrandCaisseId } from '@/core/domain/entities/GrandCaisse';

export class DeleteGrandCaisseUseCase {
  constructor(private readonly grandCaisseRepository: IGrandCaisseRepository) {}

  async execute(id: GrandCaisseId): Promise<void> {
    return this.grandCaisseRepository.delete(id);
  }
}