export type EntreId = string;

export interface Entre {
  readonly id: EntreId;
  readonly date: Date;
  readonly source: string;
  readonly nombre: number;
  readonly observation?: string;
  readonly chantierId?: string | null;
  readonly achatId: string;
  readonly designation: string;
  readonly destination?: string;
  readonly unite: string;
  readonly classe: string;
}

export type NewEntre = Omit<Entre, 'id' | 'unite' | 'classe'>;
export type UpdateEntre = Partial<Omit<NewEntre, 'achatId'>>;