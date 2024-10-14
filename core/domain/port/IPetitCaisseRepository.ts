import { PetitCaisse, PetitCaisseId, NewPetitCaisse } from '../entities/PetitCaisse';

export interface IPetitCaisseRepository {
  create(petitCaisse: NewPetitCaisse): Promise<PetitCaisse>;
  findAll(): Promise<PetitCaisse[]>;
  findById(id: PetitCaisseId): Promise<PetitCaisse | null>;
  delete(id: PetitCaisseId): Promise<void>;
  deleteAll(): Promise<void>;
  getLastSolde(projetId?: string): Promise<number>;
}