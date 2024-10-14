import { IMagasinRepository } from '../../domain/port/IMagasinRepository';
import { Magasin, MagasinId, UptadeMagasin } from '../../domain/entities/Magasin';

export class UpdateMagasinUseCase {
  constructor(private readonly magasinRepository: IMagasinRepository) {}
  async execute(id: MagasinId, magasinData: UptadeMagasin): Promise<Magasin | null> {
    const updatedMagasin = await this.magasinRepository.update(id, magasinData);
    if (!updatedMagasin) {
      throw new Error('Magasin not found');
    }
    return updatedMagasin;
  }
}