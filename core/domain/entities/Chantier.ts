export class Chantier {
    private constructor(
        private _id: string,
        private _fkt: string,
        private _lieu_chantier: string,
        private _nature: string,
        private _capacite: string,
        private _code_chantier: string,
        private _projetId: string
    ) {}

    static create(props: Omit<Chantier, 'id'>): Chantier {
        return new Chantier(
            Date.now().toString(),
            props.fkt,
            props.lieu_chantier,
            props.nature,
            props.capacite,
            props.code_chantier,
            props.projetId
        );
    }

    get id(): string { return this._id; }
    get fkt(): string { return this._fkt; }
    get lieu_chantier(): string { return this._lieu_chantier; }
    get nature(): string { return this._nature; }
    get capacite(): string { return this._capacite; }
    get code_chantier(): string { return this._code_chantier; }
    get projetId(): string { return this._projetId; }

    update(props: Partial<Omit<Chantier, 'id' | 'projetId'>>): void {
        if (props.fkt) this._fkt = props.fkt;
        if (props.lieu_chantier) this._lieu_chantier = props.lieu_chantier;
        if (props.nature) this._nature = props.nature;
        if (props.capacite) this._capacite = props.capacite;
        if (props.code_chantier) this._code_chantier = props.code_chantier;
    }
}
