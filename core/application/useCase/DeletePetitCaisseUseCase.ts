import { IPetitCaisseRepository } from '@/core/domain/port/IPetitCaisseRepository';
import { PetitCaisseId } from '@/core/domain/entities/PetitCaisse';

export class DeletePetitCaisseUseCase {
  constructor(private readonly petitCaisseRepository: IPetitCaisseRepository) {}

  async execute(id: PetitCaisseId): Promise<void> {
    return this.petitCaisseRepository.delete(id);
  }
}