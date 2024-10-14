import { Magasin, MagasinId, NewMagasin, UptadeMagasin } from "../entities/Magasin";

export interface IMagasinRepository {
    create(magasin: NewMagasin): Promise<Magasin>;
    findAll(): Promise<Magasin[]>;
    findById(id: MagasinId): Promise<Magasin | null>;
    update(id: MagasinId, magasin: UptadeMagasin): Promise<Magasin | null>;
    delete(id: MagasinId): Promise<void>;
}
