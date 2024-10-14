import { IPetitCaisseRepository } from '@/core/domain/port/IPetitCaisseRepository';
import { PetitCaisse, PetitCaisseId } from '@/core/domain/entities/PetitCaisse';

export class GetPetitCaisseByIdUseCase {
  constructor(private readonly petitCaisseRepository: IPetitCaisseRepository) {}

  async execute(id: PetitCaisseId): Promise<PetitCaisse | null> {
    return this.petitCaisseRepository.findById(id);
  }
}