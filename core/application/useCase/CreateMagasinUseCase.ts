import { IMagasinRepository } from '../../domain/port/IMagasinRepository';
import { NewMagasin, Magasin } from '../../domain/entities/Magasin';

export class CreateMagasinUseCase {
  constructor(private readonly magasinRepository: IMagasinRepository) {}

  async execute(magasinData: NewMagasin): Promise<Magasin> {
    return this.magasinRepository.create(magasinData);
  }
}