export class Classe {
    private constructor(
        private readonly _id: string,
        private _nom: string
    ) {}

    static create(id: string, nom: string): Classe {
        if (!nom || nom.trim().length === 0) {
            throw new Error("Le nom de la classe ne peut pas être vide");
        }
        return new Classe(id, nom);
    }

    get id(): string {
        return this._id;
    }

    get nom(): string {
        return this._nom;
    }

    updateNom(nom: string): void {
        if (!nom || nom.trim().length === 0) {
            throw new Error("Le nom de la classe ne peut pas être vide");
        }
        this._nom = nom;
    }
}