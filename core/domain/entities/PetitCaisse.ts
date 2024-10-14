export type PetitCaisseId = string;

export interface PetitCaisse {
  readonly id: PetitCaisseId;
  readonly date: Date;
  readonly libelle: string;
  readonly debit: number;
  readonly credit: number;
  readonly solde: number;
  readonly projetId?: string;
}

export type NewPetitCaisse = Omit<PetitCaisse, 'id' | 'solde'>;