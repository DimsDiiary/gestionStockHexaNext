import { IEntreRepository } from '../../domain/port/IEntreRepository';
import { EntreId } from '../../domain/entities/Entre';

export class DeleteEntreUseCase {
  constructor(private readonly entreRepository: IEntreRepository) {}

  async execute(id: EntreId): Promise<void> {
    return this.entreRepository.delete(id);
  }
}