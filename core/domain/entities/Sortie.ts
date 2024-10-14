export type SortieId = string;

export interface Sortie {
  readonly id: SortieId;
  readonly date: Date;
  readonly nombre: number;
  readonly source?: string;
  readonly destination?: string;
  readonly observation?: string;
  readonly achatId: string;
  readonly designation: string;
  readonly unite: string;
  readonly classe: string;
}

export type NewSortie = Omit<Sortie, 'id' | 'designation' | 'unite' | 'classe'>;
export type UpdateSortie = Partial<Omit<NewSortie, 'achatId'>>;