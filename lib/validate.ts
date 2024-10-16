import { z } from 'zod';

export const projetSchema = z.object({
  nom_projet: z.string(),
  os: z.string(),
  date_debut: z.string(), // ou z.date() si vous utilisez des objets Date
  date_fin: z.string(), // ou z.date() si vous utilisez des objets Date
  budget: z.number().or(z.string()), // accepte un nombre ou une chaîne qui sera parsée en nombre
  description: z.string(),
  userId: z.string().optional() // Rend userId optionnel
}).refine(data => data.date_fin >= data.date_debut, {
  message: "La date de fin doit être après ou égale à la date de début",
  path: ['date_fin']
});

// Schéma pour Chantier
export const chantierSchema = z.object({
  fkt: z.string().min(1, "Le FKT est requis"),
  lieu_chantier: z.string().min(1, "Le lieu du chantier est requis"),
  nature: z.string().min(1, "La nature du chantier est requise"),
  capacite: z.string().min(1, "La capacité est requise"),
  code_chantier: z.string().min(1, "Le code chantier est requis"),
  projetId: z.string().min(1, "L'ID du projet est requis"),
});

// Schéma pour GrandCaisse
export const grandCaisseSchema = z.object({
  date: z.coerce.date(),
  libelle: z.string().min(1, "Le libellé est requis"),
  montant: z.number().min(0, "Le montant doit être un nombre positif"),
  mode_paiement: z.string().min(1, "Le mode de paiement est requis"),
  projetId: z.string().min(1, "L'ID du projet est requis"),
});

// Schéma pour Magasin
export const magasinSchema = z.object({
  lieu_magasin: z.string().min(1, "Le lieu du magasin est requis"),
  code_magasin: z.string().min(1, "Le code magasin est requis"),
  projetId: z.string().min(1, "L'ID du projet est requis"),
});

// Schéma pour PetitCaisse
export const petitCaisseSchema = z.object({
  date: z.coerce.date(),
  libelle: z.string(),
  debit: z.number().nonnegative(),
  credit: z.number().nonnegative(),
  projetId: z.string().nullable(),
});

// Schéma pour Achat
export const achatSchema = z.object({
  date: z.coerce.date(), 
  designation: z.string().min(1, "La désignation est requise"),
  nombre: z.number().min(0, "Le nombre doit être un nombre positif"),
  prix_unitaire: z.number().min(0, "Le prix unitaire doit être un nombre positif"),
  total: z.number().min(0, "Le total doit être un nombre positif"),
  uniteId: z.string().min(1, "L'ID de l'unité est requis"),
  classeId: z.string().min(1, "L'ID de la classe est requis"),
});


export const entreSchema = z.object({
  date: z.string().nonempty("La date est requise"),
  source: z.string().optional(),
  nombre: z.number().min(0, "Le nombre doit être un nombre positif"),
  observation: z.string().optional(),
  chantierId: z.string().optional(), // Rendre chantierId optionnel
  designation: z.string().optional(), // Ajouté pour la désignation
});


// Schéma pour Sortie
export const sortieSchema = z.object({
  date: z.coerce.date(),
  quincaillerie: z.string().min(1, "La quincaillerie est requise"),
  nombre: z.number().min(0, "Le nombre doit être un nombre positif"),
  observation: z.string().optional(), // Optional si ce n'est pas toujours requis
  chantierId: z.string().min(1, "L'ID du chantier est requis"),
});

// Schéma pour Classe
export const classeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
});

// Schéma pour Unite
export const uniteSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  symbole: z.string().min(1, "Le symbole est requis"),
});

