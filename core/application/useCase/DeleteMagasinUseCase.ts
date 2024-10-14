import { IMagasinRepository } from '../../domain/port/IMagasinRepository';
import { MagasinId } from '../../domain/entities/Magasin';

export class DeleteMagasinUseCase {
  constructor(private readonly magasinRepository: IMagasinRepository) {}

  async execute(id: MagasinId): Promise<void> {
    return this.magasinRepository.delete(id);
  }
}