import { IPetitCaisseRepository } from '@/core/domain/port/IPetitCaisseRepository';
import { PetitCaisse } from '@/core/domain/entities/PetitCaisse';

export class GetAllPetitCaissesUseCase {
  constructor(private readonly petitCaisseRepository: IPetitCaisseRepository) {}

  async execute(): Promise<PetitCaisse[]> {
    return this.petitCaisseRepository.findAll();
  }
}