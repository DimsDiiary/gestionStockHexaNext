import { IClasseRepository } from '../../domain/port/IClasseRepository';
import { ClasseDTO } from '../../domain/Dto/ClasseDto';

export class GetAllClassesUseCase {
    constructor(private classeRepository: IClasseRepository) {}

    async execute(): Promise<ClasseDTO[]> {
        const classes = await this.classeRepository.findAll();
        return classes.map(classe => ({ id: classe.id, nom: classe.nom }));
    }
}