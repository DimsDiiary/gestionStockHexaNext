import { Entre, EntreId, NewEntre, UpdateEntre } from '../entities/Entre';

export interface IEntreRepository {
  create(entre: NewEntre): Promise<Entre>;
  findAll(): Promise<Entre[]>;
  findById(id: EntreId): Promise<Entre | null>;
  update(id: EntreId, entre: UpdateEntre): Promise<Entre>;
  delete(id: EntreId): Promise<void>;
  deleteAll(): Promise<number>;
}