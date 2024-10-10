export type AchatId = string;

export interface Achat {
    readonly id: AchatId;
    readonly date: Date;
    readonly designation: string;
    readonly nombre: number;
    readonly prix_unitaire: number;
    readonly total: number;
    readonly uniteId: string;
    readonly classeId: string;
}

export type NewAchat = Omit<Achat, "id">;
