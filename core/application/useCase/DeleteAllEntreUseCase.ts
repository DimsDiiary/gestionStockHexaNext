import { IEntreRepository } from '../../domain/port/IEntreRepository';

export class DeleteAllEntresUseCase {
  constructor(private readonly entreRepository: IEntreRepository) {}

  async execute(): Promise<number> {
    return this.entreRepository.deleteAll();
  }
}