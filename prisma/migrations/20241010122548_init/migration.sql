-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GESTIONNAIRE', 'COMPTABLE');

-- CreateTable
CREATE TABLE "Projet" (
    "id" TEXT NOT NULL,
    "nom_projet" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chantier" (
    "id" TEXT NOT NULL,
    "fkt" TEXT NOT NULL,
    "lieu_chantier" TEXT NOT NULL,
    "nature" TEXT NOT NULL,
    "capacite" TEXT NOT NULL,
    "code_chantier" TEXT NOT NULL,
    "projetId" TEXT,

    CONSTRAINT "Chantier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrandCaisse" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "projetId" TEXT,

    CONSTRAINT "GrandCaisse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Magasin" (
    "id" TEXT NOT NULL,
    "lieu_magasin" TEXT NOT NULL,
    "code_magasin" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,

    CONSTRAINT "Magasin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitCaisse" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "libelle" TEXT NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "solde" DOUBLE PRECISION NOT NULL,
    "projetId" TEXT,

    CONSTRAINT "PetitCaisse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achat" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "designation" TEXT NOT NULL,
    "nombre" DOUBLE PRECISION NOT NULL,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "uniteId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,

    CONSTRAINT "Achat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entre" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "designation" TEXT,
    "unite" TEXT,
    "nombre" DOUBLE PRECISION NOT NULL,
    "classe" TEXT,
    "source" TEXT,
    "observation" TEXT,
    "destination" TEXT,
    "achatId" TEXT,

    CONSTRAINT "Entre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sortie" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "designation" TEXT,
    "unite" TEXT,
    "nombre" TEXT NOT NULL,
    "classe" TEXT,
    "source" TEXT,
    "destination" TEXT,
    "observation" TEXT,
    "achat_id" TEXT,

    CONSTRAINT "Sortie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "achatId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classe" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Classe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unite" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "symbole" TEXT NOT NULL,

    CONSTRAINT "Unite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_achatId_key" ON "Stock"("achatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chantier" ADD CONSTRAINT "Chantier_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrandCaisse" ADD CONSTRAINT "GrandCaisse_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Magasin" ADD CONSTRAINT "Magasin_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitCaisse" ADD CONSTRAINT "PetitCaisse_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achat" ADD CONSTRAINT "Achat_uniteId_fkey" FOREIGN KEY ("uniteId") REFERENCES "Unite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achat" ADD CONSTRAINT "Achat_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entre" ADD CONSTRAINT "Entre_achatId_fkey" FOREIGN KEY ("achatId") REFERENCES "Achat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sortie" ADD CONSTRAINT "Sortie_achat_id_fkey" FOREIGN KEY ("achat_id") REFERENCES "Achat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_achatId_fkey" FOREIGN KEY ("achatId") REFERENCES "Achat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
