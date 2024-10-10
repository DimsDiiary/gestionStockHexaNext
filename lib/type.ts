import { z } from 'zod';

export const PrismaAchatSchema = z.object({
  id: z.string(),
  date: z.date(),
  designation: z.string(),
  nombre: z.number(),
  prix_unitaire: z.number(),
  total: z.number(),
  unite: z.object({
    id: z.string(),
    nom: z.string(),
  }),
  classe: z.object({
    id: z.string(),
    nom: z.string(),
  }),
  stock: z.object({
    id: z.string(),
    total: z.number(),
    achatId: z.string(),
    updatedAt: z.date(),
  }).nullable(),
  entres: z.array(z.object({
    id: z.string(),
    date: z.date(),
    designation: z.string().nullable(),
    nombre: z.number(),
    unite: z.string().nullable(),
    classe: z.string().nullable(),
    achatId: z.string().nullable(),
    source: z.string().nullable(),
    observation: z.string().nullable(),
    destination: z.string().nullable(),
  })),
  sorties: z.array(z.object({
    id: z.string(),
    date: z.date(),
    designation: z.string().nullable(),
    nombre: z.string(),
    unite: z.string().nullable(),
    classe: z.string().nullable(),
    achatId: z.string().nullable(),
    source: z.string().nullable(),
    destination: z.string().nullable(),
    observation: z.string().nullable(),
  })),
});

export type PrismaAchatWithRelations = z.infer<typeof PrismaAchatSchema>;