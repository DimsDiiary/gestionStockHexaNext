import { Chantier } from '../entities/Chantier';

export interface IChantierRepository {
    create(chantier: Chantier): Promise<Chantier>;
    findAll(): Promise<Chantier[]>;
    findById(id: string): Promise<Chantier | null>;
    update(chantier: Chantier): Promise<Chantier>;
    delete(id: string): Promise<Chantier>;
}