import { IEntreRepository } from '../../domain/port/IEntreRepository';
import { Entre, EntreId, UpdateEntre } from '../../domain/entities/Entre';

export class UpdateEntreUseCase {
  constructor(private readonly entreRepository: IEntreRepository) {}

  async execute(id: EntreId, entreData: UpdateEntre): Promise<Entre> {
    return this.entreRepository.update(id, entreData);
  }
}