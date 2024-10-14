import { GrandCaisse, GrandCaisseId, NewGrandCaisse } from '../entities/GrandCaisse';

export interface IGrandCaisseRepository {
  create(grandCaisse: NewGrandCaisse): Promise<GrandCaisse>;
  findAll(): Promise<GrandCaisse[]>;
  findById(id: GrandCaisseId): Promise<GrandCaisse | null>;
  delete(id: GrandCaisseId): Promise<void>;
  deleteAll(): Promise<void>;
}