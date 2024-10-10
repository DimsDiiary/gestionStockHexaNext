import { IAchatRepository } from "../../domain/port/IAchatRepository";
import { Achat, NewAchat } from "../../domain/entities/Achat";

export class CreateAchatUseCase {
  constructor(private readonly achatRepository: IAchatRepository) {}

  async execute(achatData: NewAchat): Promise<Achat> {
    return this.achatRepository.create(achatData);
  }
}