import { z } from 'zod';

export const uniteSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    symbole: z.string().min(1, "Le symbole est requis"),
    achatId: z.string().optional(),
});