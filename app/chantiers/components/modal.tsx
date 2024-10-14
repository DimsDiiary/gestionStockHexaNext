"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircleX, CirclePlus } from "lucide-react";
import { z } from "zod";

const chantierSchema = z.object({
    id: z.string().optional(),
    fkt: z.string().min(1, "Le FKT est requis"),
    lieu_chantier: z.string().min(1, "Le lieu du chantier est requis"),
    nature: z.string().min(1, "La nature est requise"),
    capacite: z.string().min(1, "La capacité est requise"),
    code_chantier: z.string().min(1, "Le code du chantier est requis"),
    projetId: z.string().min(1, "L'ID du projet est requis"),
});

type ChantierData = z.infer<typeof chantierSchema>;
type ChantierErrors = Partial<Record<keyof ChantierData, string>>;

interface Projet {
    id: string;
    nom_projet: string;
}

interface ChantierModalProps {
    isOpen: boolean;
    onClose: () => void;
    chantier: ChantierData | null;
    onSubmitSuccess: () => void;
    projets: Projet[];
}

export function ChantierModal({ isOpen, onClose, chantier, onSubmitSuccess, projets }: ChantierModalProps) {
    const [formData, setFormData] = useState<ChantierData>({
        fkt: '',
        lieu_chantier: '',
        nature: '',
        capacite: '',
        code_chantier: '',
        projetId: ''
    });
    const [errors, setErrors] = useState<ChantierErrors>({});
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    useEffect(() => {
        if (chantier) {
            setFormData(chantier);
        } else {
            setFormData({
                fkt: '',
                lieu_chantier: '',
                nature: '',
                capacite: '',
                code_chantier: '',
                projetId: ''
            });
        }
    }, [chantier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            chantierSchema.parse(formData);
            const url = chantier ? `/api/chantier/${chantier.id}` : '/api/chantier';
            const method = chantier ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la soumission du formulaire');
            }
            onSubmitSuccess();
            onClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const validationErrors: ChantierErrors = error.errors.reduce((acc, err) => {
                    acc[err.path[0] as keyof ChantierData] = err.message;
                    return acc;
                }, {} as ChantierErrors);
                setErrors(validationErrors);
            } else {
                console.error('Erreur:', error);
            }
        }
    };

    const getProjetName = (projetId: string) => {
        const projet = projets.find((p) => p.id === projetId);
        return projet ? projet.nom_projet : 'Inconnu';
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <CircleX className="h-4 w-4" />
                        <span className="sr-only">Fermer</span>
                    </button>
                    <div className='text-center'>
                        <h2 className="text-lg font-bold">Chantier</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {chantier ? 'Modifier' : 'Ajouter'} un chantier
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="fkt" className="font-semibold">FKT</label>
                            <input
                                id="fkt"
                                type="text"
                                value={formData.fkt}
                                onChange={handleChange}
                                className={`p-2 border rounded-md ${errors.fkt ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.fkt && <p className="text-red-500 text-sm">{errors.fkt}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="lieu_chantier" className="font-semibold">Lieu</label>
                            <input
                                id="lieu_chantier"
                                type="text"
                                value={formData.lieu_chantier}
                                onChange={handleChange}
                                className={`p-2 border rounded-md ${errors.lieu_chantier ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.lieu_chantier && <p className="text-red-500 text-sm">{errors.lieu_chantier}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nature" className="font-semibold">Nature</label>
                            <input
                                id="nature"
                                type="text"
                                value={formData.nature}
                                onChange={handleChange}
                                className={`p-2 border rounded-md ${errors.nature ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.nature && <p className="text-red-500 text-sm">{errors.nature}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="capacite" className="font-semibold">Capacité</label>
                            <input
                                id="capacite"
                                type="text"
                                value={formData.capacite}
                                onChange={handleChange}
                                className={`p-2 border rounded-md ${errors.capacite ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.capacite && <p className="text-red-500 text-sm">{errors.capacite}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="code_chantier" className="font-semibold">Code</label>
                            <input
                                id="code_chantier"
                                type="text"
                                value={formData.code_chantier}
                                onChange={handleChange}
                                className={`p-2 border rounded-md ${errors.code_chantier ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.code_chantier && <p className="text-red-500 text-sm">{errors.code_chantier}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="projetId" className="font-semibold">Projet</label>
                            <button
                                type="button"
                                onClick={() => setIsProjectModalOpen(true)}
                                className="p-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-between">
                                <span>{getProjetName(formData.projetId) || 'Sélectionner un projet'}</span>
                                <CirclePlus className="h-4 w-4" />
                            </button>
                            {errors.projetId && <p className="text-red-500 text-sm">{errors.projetId}</p>}
                        </div>
                        <div className="col-span-2 flex justify-end gap-4 mt-4">
                            <Button type="button" onClick={onClose} variant="outline">Annuler</Button>
                            <Button type="submit">{chantier ? 'Modifier' : 'Ajouter'}</Button>
                        </div>
                    </form>
                </div>
            </div>

            {isProjectModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-60" onClick={() => setIsProjectModalOpen(false)}></div>
                    <div className="fixed inset-0 flex items-center justify-center z-60 p-4">
                        <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <button
                                onClick={() => setIsProjectModalOpen(false)}
                                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors">
                                <CircleX className="h-4 w-4" />
                                <span className="sr-only">Fermer</span>
                            </button>
                            <h3 className="text-lg font-bold mb-4">Sélectionner un projet</h3>
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                {projets.map((projet) => (
                                    <button
                                        key={projet.id}
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, projetId: projet.id }));
                                            setIsProjectModalOpen(false);
                                        }}
                                        className="p-2 text-left hover:bg-gray-100 rounded-md transition-colors">
                                        {projet.nom_projet}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}