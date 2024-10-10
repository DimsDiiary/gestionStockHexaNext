import { IAchatRepository } from "../../domain/port/IAchatRepository";
import { Achat } from "../../domain/entities/Achat";

export class GetAchatsUseCase {
  constructor(private readonly achatRepository: IAchatRepository) {}

  async execute(): Promise<Achat[]> {
    return this.achatRepository.findAll();
  }
}