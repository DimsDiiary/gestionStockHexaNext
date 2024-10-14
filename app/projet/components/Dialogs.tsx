'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { z } from 'zod'

// Définir le schéma de validation
const projetSchema = z.object({
    nom_projet: z.string().min(1, "Le nom du projet est requis"),
    os: z.string().min(1, "Le système d'exploitation est requis"),
    date_debut: z.string().nonempty("La date de début est requise").refine(date => !isNaN(new Date(date).getTime()), "La date de début est invalide"),
    date_fin: z.string().nonempty("La date de fin est requise").refine(date => !isNaN(new Date(date).getTime()), "La date de fin est invalide"),
    budget: z.number().min(0, "Le budget doit être un nombre positif"),
    description: z.string().optional()
}).refine(data => {
    const dateDebut = new Date(data.date_debut);
    const dateFin = new Date(data.date_fin);
    return dateFin >= dateDebut;
}, {
    message: "La date de fin doit être après la date de début",
    path: ['date_fin']
});

export type ProjetData = z.infer<typeof projetSchema>

// Dynamically import the modal content
const DynamicModalContent = dynamic(() => import('./ModalContent'), {
    loading: () => <p>Chargement...</p>,
})

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json())

export function Modal() {
    const [isOpen, setIsOpen] = useState(false)
    const { data: projets, error, mutate } = useSWR('/api/projet', fetcher)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    const handleSubmit = async (formData: ProjetData) => {
        try {
            const parsedData = {
                ...formData,
                budget: parseFloat(formData.budget.toString())
            }

            projetSchema.parse(parsedData)

            const response = await fetch('/api/projet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedData),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la soumission du formulaire')
            }

            const result = await response.json()
            console.log('Réponse du serveur:', result)
            mutate() // Revalidate the data
            closeModal()
        } catch (error) {
            console.error('Erreur:', error)
            throw error; // Re-throw the error to be handled in ModalContent
        }
    }

    return (
        <>
            <Button
                onClick={openModal}
                className="flex items-center justify-center py-1 px-3 bg-blue-500 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
                <span>Ajouter Projet</span>
            </Button>

            {isOpen && (
                <DynamicModalContent
                    closeModal={closeModal}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    )
}