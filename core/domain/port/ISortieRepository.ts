import { Sortie, SortieId, NewSortie, UpdateSortie } from '../entities/Sortie';

export interface ISortieRepository {
  create(sortie: NewSortie): Promise<Sortie>;
  findAll(): Promise<Sortie[]>;
  findById(id: SortieId): Promise<Sortie | null>;
  update(id: SortieId, sortie: UpdateSortie): Promise<Sortie>;
  delete(id: SortieId): Promise<void>;
  deleteAll(): Promise<number>;
}