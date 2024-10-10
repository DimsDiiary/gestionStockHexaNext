import { Achat, AchatId, NewAchat } from "../entities/Achat";

export interface IAchatRepository {
  create(achat: NewAchat): Promise<Achat>;
  findAll(): Promise<Achat[]>;
  findById(id: AchatId): Promise<Achat | null>;
  update(id: AchatId, achat: Partial<NewAchat>): Promise<Achat | null>;
  delete(id: AchatId): Promise<boolean>;
}