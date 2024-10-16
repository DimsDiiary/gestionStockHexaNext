export class Unite {
    private constructor(
        private readonly _id: string,
        private _nom: string,
        private _symbole: string
    ) {}

    static create(id: string, nom: string, symbole: string): Unite {
        if (!nom || nom.trim().length === 0) {
            throw new Error("Le nom de l'unité ne peut pas être vide");
        }
        if (!symbole || symbole.trim().length === 0) {
            throw new Error("Le symbole de l'unité ne peut pas être vide");
        }
        return new Unite(id, nom, symbole);
    }

    get id(): string {
        return this._id;
    }

    get nom(): string {
        return this._nom;
    }

    get symbole(): string {
        return this._symbole;
    }

    update(nom: string, symbole: string): void {
        if (!nom || nom.trim().length === 0) {
            throw new Error("Le nom de l'unité ne peut pas être vide");
        }
        if (!symbole || symbole.trim().length === 0) {
            throw new Error("Le symbole de l'unité ne peut pas être vide");
        }
        this._nom = nom;
        this._symbole = symbole;
    }
}