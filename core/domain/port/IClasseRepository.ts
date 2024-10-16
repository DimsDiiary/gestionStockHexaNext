import { Classe } from '../entities/Classe';

export interface IClasseRepository {
    save(classe: Classe): Promise<void>;
    findAll(): Promise<Classe[]>;
    findById(id: string): Promise<Classe | null>;
    delete(id: string): Promise<void>;
    isUsedInAchat(id: string): Promise<boolean>;
}