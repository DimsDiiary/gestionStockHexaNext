import { IEntreRepository } from '../../domain/port/IEntreRepository';
import { Entre, EntreId } from '../../domain/entities/Entre';

export class GetEntreByIdUseCase {
  constructor(private readonly entreRepository: IEntreRepository) {}

  async execute(id: EntreId): Promise<Entre | null> {
    return this.entreRepository.findById(id);
  }
}