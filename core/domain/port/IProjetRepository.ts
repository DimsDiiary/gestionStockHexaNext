import { Projet } from '../entities/Projet';

export interface IProjetRepository {
    create(projet: Projet): Promise<Projet>;
    findAll(): Promise<Projet[]>;
    findById(id: string): Promise<Projet | null>;
    update(projet: Projet): Promise<Projet>;
    delete(id: string): Promise<void>;
    deleteRelatedEntities(id: string): Promise<void>;
}