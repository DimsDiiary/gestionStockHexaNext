'use client';

import React, { useState, useEffect } from 'react';
import OptionsModal from './components/optionsModal';
import { Button } from '@/components/ui/button';
import AchatTable from './components/tableAchat';

const AchatsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unites, setUnites] = useState<{ id: string; name: string; symbole: React.ReactNode }[]>([]);
    const [classes, setClasses] = useState<{ id: string; name: string; nom: React.ReactNode }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAchat, setCurrentAchat] = useState<{ [key: string]: any } | null>(null);
    const [achats, setAchats] = useState<{ [key: string]: any }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [unitesResponse, classesResponse] = await Promise.all([
                    fetch('/api/unite'), 
                    fetch('/api/classe')
                ]);

                if (unitesResponse.ok && classesResponse.ok) {
                    const [unitesData, classesData] = await Promise.all([
                        unitesResponse.json(),
                        classesResponse.json()
                    ]);
                    setUnites(unitesData);
                    setClasses(classesData);
                } else {
                    setError('Erreur lors de la récupération des données');
                }
            } catch (error) {
                setError('Erreur de réseau');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (formData: { [key: string]: any }) => {
        // Convertir les champs en nombres
        const numericFormData = {
            ...formData,
            prix_unitaire: parseFloat(formData.prix_unitaire),
            nombre: parseInt(formData.nombre, 10),
            total: parseFloat(formData.prix_unitaire) * parseInt(formData.nombre, 10), // Calculer le total ici
        };

        console.log('Données envoyées:', numericFormData);

        try {
            const response = await fetch(currentAchat ? `/api/achat/${currentAchat.id}` : '/api/achat', {
                method: currentAchat ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(numericFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur lors de la soumission:', errorData);
                setError('Erreur lors de la soumission');
                return;
            }

            const result = await response.json();
            console.log('Réponse du serveur:', result);
            setIsModalOpen(false); // Fermer le modal après succès
            setCurrentAchat(null); // Réinitialiser l'achat actuel
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setError('Erreur de réseau');
        }
    };

    const handleEdit = (achat: { [key: string]: any }) => {
        setCurrentAchat(achat);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet achat ?')) {
            try {
                const response = await fetch(`/api/achat/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Erreur lors de la suppression de l'achat: ${response.statusText}`);
                }
                // Re-fetch achats after deletion
                const fetchAchats = async () => {
                    const response = await fetch('http://localhost:3000/api/achat');
                    const data = await response.json();
                    setAchats(data);
                };
                fetchAchats();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'achat:', error);
                setError(error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'achat');
            }
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Achats</h1>
            <Button 
                onClick={() => { setCurrentAchat(null); setIsModalOpen(true); }} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
            >
                Créer un Achat
            </Button>
            <OptionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                title={currentAchat ? "Modifier Achat" : "Nouvel Achat"}
                unites={unites}
                classes={classes}
                initialData={currentAchat || undefined}
            />
            <AchatTable onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default AchatsPage;