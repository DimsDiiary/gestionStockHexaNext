'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CircleX } from "lucide-react"
import { z } from 'zod'
import { ProjetData } from './Dialogs'

type ProjetErrors = Partial<Record<keyof ProjetData, string>>

interface ModalContentProps {
    closeModal: () => void
    handleSubmit: (formData: ProjetData) => Promise<void>
}

export default function ModalContent({ closeModal, handleSubmit }: ModalContentProps) {
    const [formData, setFormData] = useState<ProjetData>({
        nom_projet: '',
        os: '',
        date_debut: '',
        date_fin: '',
        budget: 0,
        description: ''
    })
    const [errors, setErrors] = useState<ProjetErrors>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [id]: id === 'budget' ? parseFloat(value) : value
        }))
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await handleSubmit(formData)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const validationErrors: ProjetErrors = error.errors.reduce((acc, err) => {
                    acc[err.path[0] as keyof ProjetData] = err.message
                    return acc
                }, {} as ProjetErrors)
                setErrors(validationErrors)
            } else {
                console.error('Erreur:', error)
            }
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-blue-500 z-50" onClick={closeModal}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700">
                        <CircleX className="h-4 w-4" />
                        <span className="sr-only">Close</span> 
                    </button>
                    <div className='text-center'>
                        <h2 className="text-lg font-bold">Projet</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Ajouter de nouveaux projets ici.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nom_projet" className="font-semibold">Nom</label>
                            <input
                                id="nom_projet"
                                type="text"
                                placeholder="Nom du projet"
                                value={formData.nom_projet}
                                onChange={handleChange}
                                className={`p-2 border border-gray-300 rounded-md ${errors.nom_projet ? 'border-red-500' : ''}`}
                            />
                            {errors.nom_projet && <p className="text-red-500 text-sm">{errors.nom_projet}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="os" className="font-semibold">OS</label>
                            <input
                                id="os"
                                type="text"
                                placeholder="Système d'exploitation"
                                value={formData.os}
                                onChange={handleChange}
                                className={`p-2 border border-gray-300 rounded-md ${errors.os ? 'border-red-500' : ''}`}
                            />
                            {errors.os && <p className="text-red-500 text-sm">{errors.os}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="date_debut" className="font-semibold">Date début</label>
                            <input
                                id="date_debut"
                                type="date"
                                value={formData.date_debut}
                                onChange={handleChange}
                                className={`p-2 border border-gray-300 rounded-md ${errors.date_debut ? 'border-red-500' : ''}`}
                            />
                            {errors.date_debut && <p className="text-red-500 text-sm">{errors.date_debut}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="date_fin" className="font-semibold">Date fin</label>
                            <input
                                id="date_fin"
                                type="date"
                                value={formData.date_fin}
                                onChange={handleChange}
                                className={`p-2 border border-gray-300 rounded-md ${errors.date_fin ? 'border-red-500' : ''}`}
                            />
                            {errors.date_fin && <p className="text-red-500 text-sm">{errors.date_fin}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="budget" className="font-semibold">Budget</label>
                            <input
                                id="budget"
                                type="number"
                                placeholder="Budget du projet"
                                value={formData.budget}
                                onChange={handleChange}
                                className={`p-2 border border-gray-300 rounded-md ${errors.budget ? 'border-red-500' : ''}`}
                            />
                            {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="description" className="font-semibold">Description</label>
                            <input
                                id="description"
                                type="text"
                                placeholder="Description du projet"
                                value={formData.description}
                                onChange={handleChange}
                                className={`p-2 border border-gray-300 rounded-md ${errors.description ? 'border-red-500' : ''}`}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>

                        <div className="mt-4 flex justify-center gap-2 col-span-2">
                            <Button
                                type="submit"
                                className="bg-blue-500 text-white hover:bg-blue-600 w-40">
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}