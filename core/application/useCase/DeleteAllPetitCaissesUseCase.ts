import { IPetitCaisseRepository } from '@/core/domain/port/IPetitCaisseRepository';

export class DeleteAllPetitCaissesUseCase {
  constructor(private readonly petitCaisseRepository: IPetitCaisseRepository) {}

  async execute(): Promise<void> {
    return this.petitCaisseRepository.deleteAll();
  }
}