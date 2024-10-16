import { IChantierRepository } from '../../domain/port/IChantierRepository';

export class DeleteChantierUseCase {
    constructor(private chantierRepository: IChantierRepository) {}

    async execute(id: string): Promise<void> {
        await this.chantierRepository.delete(id);
    }
}