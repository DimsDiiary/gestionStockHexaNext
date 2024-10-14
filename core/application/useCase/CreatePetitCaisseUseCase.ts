import { IPetitCaisseRepository } from '@/core/domain/port/IPetitCaisseRepository';
import { NewPetitCaisse, PetitCaisse } from '@/core/domain/entities/PetitCaisse';

export class CreatePetitCaisseUseCase {
  constructor(private readonly petitCaisseRepository: IPetitCaisseRepository) {}

  async execute(petitCaisseData: NewPetitCaisse): Promise<PetitCaisse> {
    const lastSolde = await this.petitCaisseRepository.getLastSolde(petitCaisseData.projetId);
    const newSolde = lastSolde + petitCaisseData.debit - petitCaisseData.credit;
    const petitCaisseToCreate: PetitCaisse = {
      id: '',
      ...petitCaisseData,
      solde: newSolde,
    };
    return this.petitCaisseRepository.create(petitCaisseToCreate);
  }
}