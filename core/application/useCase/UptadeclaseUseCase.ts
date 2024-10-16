import { IClasseRepository } from '../../domain/port/IClasseRepository';
import { ClasseDTO } from '../../domain/Dto/ClasseDto';

export class UpdateClasseUseCase {
    constructor(private classeRepository: IClasseRepository) {}

    async execute(id: string, nom: string): Promise<ClasseDTO> {
        const classe = await this.classeRepository.findById(id);
        if (!classe) {
            throw new Error("Classe non trouvée");
        }
        classe.updateNom(nom);
        await this.classeRepository.save(classe);
        return { id: classe.id, nom: classe.nom };
    }
}