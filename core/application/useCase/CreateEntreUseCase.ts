import { IEntreRepository } from '../../domain/port/IEntreRepository';
import { NewEntre, Entre } from '../../domain/entities/Entre';

export class CreateEntreUseCase {
  constructor(private readonly entreRepository: IEntreRepository) {}

  async execute(entreData: NewEntre): Promise<Entre> {
    // Ici, vous pouvez ajouter la logique métier nécessaire
    return this.entreRepository.create(entreData);
  }
}