'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { CircleX, Plus, Edit, Trash2 } from "lucide-react"
import { z } from 'zod'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Définir le schéma de validation
const projetSchema = z.object({
    id: z.string().optional(),
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

type Projet = z.infer<typeof projetSchema>
type ProjetErrors = Partial<Record<keyof Projet, string>>

export default function ProjetPage() {
    const [projets, setProjets] = useState<Projet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
    const [formData, setFormData] = useState<Projet>({
        nom_projet: '',
        os: '',
        date_debut: '',
        date_fin: '',
        budget: 0,
        description: ''
    });
    const [formErrors, setFormErrors] = useState<ProjetErrors>({});

    const fetchProjets = async () => {
        try {
            const response = await fetch('/api/projet');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des projets');
            }
            const data = await response.json();
            setProjets(data);
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la récupération des projets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjets();
    }, []);

    const handleOpenModal = (projet: Projet | null = null) => {
        setSelectedProjet(projet);
        setFormData(projet || {
            nom_projet: '',
            os: '',
            date_debut: '',
            date_fin: '',
            budget: 0,
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProjet(null);
        setFormErrors({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: id === 'budget' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            projetSchema.parse(formData);

            const method = selectedProjet ? 'PUT' : 'POST';
            const url = selectedProjet ? `/api/projet/${selectedProjet.id}` : '/api/projet';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la soumission du formulaire');
            }

            await fetchProjets();
            handleCloseModal();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const validationErrors: ProjetErrors = error.errors.reduce((acc, err) => {
                    acc[err.path[0] as keyof Projet] = err.message;
                    return acc;
                }, {} as ProjetErrors);
                setFormErrors(validationErrors);
            } else {
                console.error('Erreur:', error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                const response = await fetch(`/api/projet/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du projet');
                }
                await fetchProjets();
            } catch (error) {
                console.error(error);
                setError('Erreur lors de la suppression du projet');
            }
        }
    };



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gestion des Projets</h1>
            <Button onClick={() => handleOpenModal()} className="mb-4 bg-blue-700 hover:bg-blue-500">
                Ajouter un projet
            </Button>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Nom</TableHead>
                            <TableHead>OS</TableHead>
                            <TableHead>Date début</TableHead>
                            <TableHead>Date fin</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projets.map((projet) => (
                            <TableRow key={projet.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">{projet.nom_projet}</TableCell>
                                <TableCell>{projet.os}</TableCell>
                                <TableCell>{new Date(projet.date_debut).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(projet.date_fin).toLocaleDateString()}</TableCell>
                                <TableCell>{projet.budget.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="truncate max-w-xs">{projet.description}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(projet)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(projet.id!)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCloseModal}></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700">
                                <CircleX className="h-4 w-4" />
                                <span className="sr-only">Close</span> 
                            </button>
                            <div className='text-center'>
                                <h2 className="text-lg font-bold">Projet</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    {selectedProjet ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="nom_projet" className="font-semibold">Nom</label>
                                    <input
                                        id="nom_projet"
                                        type="text"
                                        placeholder="Nom du projet"
                                        value={formData.nom_projet}
                                        onChange={handleChange}
                                        className={`p-2 border border-gray-300 rounded-md ${formErrors.nom_projet ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.nom_projet && <p className="text-red-500 text-sm">{formErrors.nom_projet}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="os" className="font-semibold">OS</label>
                                    <input
                                        id="os"
                                        type="text"
                                        placeholder="Système d'exploitation"
                                        value={formData.os}
                                        onChange={handleChange}
                                        className={`p-2 border border-gray-300 rounded-md ${formErrors.os ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.os && <p className="text-red-500 text-sm">{formErrors.os}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="date_debut" className="font-semibold">Date début</label>
                                    <input
                                        id="date_debut"
                                        type="date"
                                        value={formData.date_debut}
                                        onChange={handleChange}
                                        className={`p-2 border border-gray-300 rounded-md ${formErrors.date_debut ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.date_debut && <p className="text-red-500 text-sm">{formErrors.date_debut}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="date_fin" className="font-semibold">Date fin</label>
                                    <input
                                        id="date_fin"
                                        type="date"
                                        value={formData.date_fin}
                                        onChange={handleChange}
                                        className={`p-2 border border-gray-300 rounded-md ${formErrors.date_fin ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.date_fin && <p className="text-red-500 text-sm">{formErrors.date_fin}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="budget" className="font-semibold">Budget</label>
                                    <input
                                        id="budget"
                                        type="number"
                                        placeholder="Budget du projet"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className={`p-2 border border-gray-300 rounded-md ${formErrors.budget ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.budget && <p className="text-red-500 text-sm">{formErrors.budget}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="description" className="font-semibold">Description</label>
                                    <input
                                        id="description"
                                        type="text"
                                        placeholder="Description du projet"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={`p-2 border border-gray-300 rounded-md ${formErrors.description ? 'border-red-500' : ''}`}
                                    />
                                    {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
                                </div>

                                <div className="mt-4 flex justify-center gap-2 col-span-2">
                                    <Button
                                        type="submit"
                                        className="bg-blue-500 text-white hover:bg-blue-600 w-40">
                                        {selectedProjet ? 'Modifier' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
