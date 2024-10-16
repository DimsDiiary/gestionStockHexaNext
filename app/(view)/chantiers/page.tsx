'use client'

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { ChantierModal } from './components/modal';

interface Chantier {
    id: string;
    fkt: string;
    lieu_chantier: string;
    nature: string;
    capacite: string;
    code_chantier: string;
    projetId: string;
}

interface Projet {
    id: string;
    nom_projet: string;
}

export default function Chantiers() {
    const [chantiers, setChantiers] = useState<Chantier[]>([]);
    const [projets, setProjets] = useState<Projet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChantier, setSelectedChantier] = useState<Chantier | null>(null);

    const fetchChantiers = async () => {
        try {
            const response = await fetch('/api/chantier');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des chantiers');
            }
            const data = await response.json();
            setChantiers(data);
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la récupération des chantiers');
        }
    };

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
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchChantiers(), fetchProjets()]);
            setLoading(false);
        };

        loadData();
    }, []);

    const getProjetName = (projetId: string) => {
        const projet = projets.find((p) => p.id === projetId);
        return projet ? projet.nom_projet : 'Inconnu';
    };

    const handleEdit = (chantier: Chantier) => {
        setSelectedChantier(chantier);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
            try {
                const response = await fetch(`/api/chantier/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du chantier');
                }
                await fetchChantiers();
            } catch (error) {
                console.error('Erreur lors de la suppression du chantier:', error);
                setError('Erreur lors de la suppression du chantier');
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestion des Chantiers</h1>
            <div className="mb-4 ">
                <Button onClick={() => {
                    setSelectedChantier(null);
                    setIsModalOpen(true);
                }} className='bg-blue-700 hover:bg-blue-500'>
                    Ajouter un chantier
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>FKT</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Nature</TableHead>
                        <TableHead>Capacité</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Projet</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {chantiers.map((chantier) => (
                        <TableRow key={chantier.id}>
                            <TableCell>{chantier.fkt}</TableCell>
                            <TableCell>{chantier.lieu_chantier}</TableCell>
                            <TableCell>{chantier.nature}</TableCell>
                            <TableCell>{chantier.capacite}</TableCell>
                            <TableCell>{chantier.code_chantier}</TableCell>
                            <TableCell>{getProjetName(chantier.projetId)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(chantier)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(chantier.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ChantierModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedChantier(null);
                }}
                chantier={selectedChantier}
                onSubmitSuccess={fetchChantiers}
                projets={projets}
            />
        </div>
    );
}