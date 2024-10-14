import { IMagasinRepository } from '../../domain/port/IMagasinRepository';
import { Magasin, MagasinId } from '../../domain/entities/Magasin';

export class GetMagasinByIdUseCase {
  constructor(private readonly magasinRepository: IMagasinRepository) {}

  async execute(id: MagasinId): Promise<Magasin | null> {
    return this.magasinRepository.findById(id);
  }
}