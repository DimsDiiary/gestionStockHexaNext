'use client';

import React, { FC, ReactNode, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

interface OptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { [key: string]: any }) => void;
    loading: boolean;
    error: string | null;
    title: string;
    unites: { symbole: ReactNode; id: string; name: string }[];
    classes: { nom: ReactNode; id: string; name: string }[];
    initialData?: { [key: string]: any };
}

const OptionsModal: FC<OptionsModalProps> = ({ isOpen, onClose, onSubmit, loading, error, title, unites, classes, initialData }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>({
        date: '',
        designation: '',
        nombre: '',
        prix_unitaire: '',
        total: '',
        uniteId: '',
        classeId: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const numericFormData = {
            ...formData,
            date: new Date(formData.date).toISOString(), // Formater la date en chaîne ISO
            prix_unitaire: parseFloat(formData.prix_unitaire),
            nombre: parseInt(formData.nombre, 10),
            total: parseFloat(formData.prix_unitaire) * parseInt(formData.nombre, 10),
        };
    
        console.log('Données envoyées:', numericFormData); // Debugging
    
        onSubmit(numericFormData);
    };
    
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700">
                        <CircleX className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                    <div className='text-center'>
                        <h2 className="text-lg font-bold">{title}</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Remplissez les détails pour créer un nouvel enregistrement.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Désignation</label>
                            <input
                                type="text"
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="prix_unitaire" className="block text-sm font-medium text-gray-700">Prix Unitaire</label>
                            <input
                                type="number"
                                id="prix_unitaire"
                                name="prix_unitaire"
                                value={formData.prix_unitaire}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="number"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="uniteId" className="block text-sm font-medium text-gray-700">Unité</label>
                            <select
                                id="uniteId"
                                name="uniteId"
                                value={formData.uniteId}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Sélectionnez une unité</option>
                                {unites.map((unite) => (
                                    <option key={unite.id} value={unite.id}>
                                        {unite.symbole}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="classeId" className="block text-sm font-medium text-gray-700">Classe</label>
                            <select
                                id="classeId"
                                name="classeId"
                                value={formData.classeId}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Sélectionnez une classe</option>
                                {classes.map((classe) => (
                                    <option key={classe.id} value={classe.id}>
                                        {classe.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div>Chargement...</div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : (
                            <div className="flex justify-end">
                                <Button type="submit" className="bg-blue-500 text-white">Soumettre</Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default OptionsModal;
