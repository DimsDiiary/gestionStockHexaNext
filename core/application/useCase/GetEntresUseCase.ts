import { IEntreRepository } from '../../domain/port/IEntreRepository';
import { Entre } from '../../domain/entities/Entre';

export class GetEntresUseCase {
  constructor(private readonly entreRepository: IEntreRepository) {}

  async execute(): Promise<Entre[]> {
    return this.entreRepository.findAll();
  }
}