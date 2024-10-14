import { IMagasinRepository } from '../../domain/port/IMagasinRepository';
import { Magasin } from '../../domain/entities/Magasin';

export class GetAllMagasinsUseCase {
  constructor(private readonly magasinRepository: IMagasinRepository) {}

  async execute(): Promise<Magasin[]> {
    return this.magasinRepository.findAll();
  }
}