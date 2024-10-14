import { Unite } from "../entities/Unite";

export interface IUniteRepository {
    create(unite: Unite): Promise<Unite>;
    findAll(): Promise<Unite[]>;
    findById(id: string): Promise<Unite | null>;
    update(unite: Unite): Promise<Unite>;
    delete(id: string): Promise<void>;
}
