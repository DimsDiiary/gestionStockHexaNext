'use client'

import { useState } from 'react';

interface Projet {
    id: string;
    nom_projet: string;
}

interface GrandCaisseModalProps {
    isOpen: boolean;
    onClose: () => void;
    projets: Projet[];
    onSubmit: (data: { date: string; libelle: string; montant: number; mode_paiement: string; projetId: string }) => void;
}

export default function GrandCaisseModal({ isOpen, onClose, projets, onSubmit }: GrandCaisseModalProps) {
    const [date, setDate] = useState('');
    const [libelle, setLibelle] = useState('');
    const [montant, setMontant] = useState('');
    const [modePaiement, setModePaiement] = useState('');
    const [projetId, setProjetId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !libelle || !montant || !modePaiement || !projetId) {
            alert('Tous les champs sont requis');
            return;
        }
        onSubmit({ date, libelle, montant: parseFloat(montant), mode_paiement: modePaiement, projetId });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl mb-4">Ajouter une entrée de Grand Caisse</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Libellé</label>
                        <input
                            type="text"
                            value={libelle}
                            onChange={(e) => setLibelle(e.target.value)}
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Montant</label>
                        <input
                            type="number"
                            step="0.01"
                            value={montant}
                            onChange={(e) => setMontant(e.target.value)}
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Mode de Paiement</label>
                        <input
                            type="text"
                            value={modePaiement}
                            onChange={(e) => setModePaiement(e.target.value)}
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Projet</label>
                        <select
                            value={projetId}
                            onChange={(e) => setProjetId(e.target.value)}
                            className="border rounded w-full p-2"
                            required
                        >
                            <option value="">Sélectionnez un projet</option>
                            {projets.map((projet) => (
                                <option key={projet.id} value={projet.id}>
                                    {projet.nom_projet}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Soumettre
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
