export class Projet {
    private constructor(
        private readonly _id: string,
        private _nom_projet: string,
        private _os: string,
        private _budget: number,
        private _date_debut: Date,
        private _date_fin: Date,
        private _description: string,
        private _userId?: string
    ) {}

    static create(props: Projet | Omit<Projet, 'id'>): Projet {
        if ('id' in props) {
            // Si un id est fourni, on suppose que c'est un projet existant
            return new Projet(
                props.id,
                props.nom_projet,
                props.os,
                props.budget,
                props.date_debut,
                props.date_fin,
                props.description,
                props.userId
            );
        }

        // Logique existante pour la création d'un nouveau projet
        if (props.date_debut >= props.date_fin) {
            throw new Error("La date de début doit être antérieure à la date de fin");
        }
        if (props.budget < 0) {
            throw new Error("Le budget ne peut pas être négatif");
        }
        return new Projet(
            Date.now().toString(),
            props.nom_projet,
            props.os,
            props.budget,
            props.date_debut,
            props.date_fin,
            props.description,
            props.userId
        );
    }

    get id(): string { return this._id; }
    get nom_projet(): string { return this._nom_projet; }
    get os(): string { return this._os; }
    get budget(): number { return this._budget; }
    get date_debut(): Date { return this._date_debut; }
    get date_fin(): Date { return this._date_fin; }
    get description(): string { return this._description; }
    get userId(): string | undefined { return this._userId; }

    update(props: Partial<Omit<Projet, 'id'>>): void {
        if (props.nom_projet) this._nom_projet = props.nom_projet;
        if (props.os) this._os = props.os;
        if (props.budget !== undefined) {
            if (props.budget < 0) throw new Error("Le budget ne peut pas être négatif");
            this._budget = props.budget;
        }
        if (props.date_debut) this._date_debut = props.date_debut;
        if (props.date_fin) this._date_fin = props.date_fin;
        if (props.description) this._description = props.description;
        if (props.userId) this._userId = props.userId;

        if (this._date_debut >= this._date_fin) {
            throw new Error("La date de début doit être antérieure à la date de fin");
        }
    }
}
