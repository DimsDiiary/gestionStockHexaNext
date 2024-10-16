import { Classe } from '../../domain/entities/Classe';
import { IClasseRepository } from '../../domain/port/IClasseRepository';
import { ClasseDTO } from '../../domain/Dto/ClasseDto';

export class CreateClasseUseCase {
    constructor(private classeRepository: IClasseRepository) {}

    async execute(nom: string): Promise<ClasseDTO> {
        const classe = Classe.create(Date.now().toString(), nom);
        await this.classeRepository.save(classe);
        return { id: classe.id, nom: classe.nom };
    }
}