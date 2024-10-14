export  type MagasinId = string ;

export interface Magasin {
    readonly id: MagasinId;
    readonly lieu_magasin: string;
    readonly code_magasin: string;
    readonly projetId: string;
}

export type NewMagasin = Omit<Magasin, 'id'>;
export type UptadeMagasin = Partial<NewMagasin>;
