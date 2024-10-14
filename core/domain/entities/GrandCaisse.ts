export type GrandCaisseId = string;

export interface GrandCaisse {
  readonly id: GrandCaisseId;
  readonly date: Date;
  readonly libelle: string;
  readonly montant: number;
  readonly mode_paiement: string;
  readonly projetId?: string;
}

export type NewGrandCaisse = Omit<GrandCaisse, 'id'>;