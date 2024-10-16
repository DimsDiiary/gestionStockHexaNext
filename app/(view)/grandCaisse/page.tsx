'use client'

import { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'flowbite-react';
import GrandCaisseModal from './components/grandCaisseModal'; // Assurez-vous que ce composant est exporté correctement
import ImportExcelModal from './components/ImportExcelModal'; // Assurez-vous que ce composant est exporté correctement

interface GrandCaisse {
    date: string;
    libelle: string;
    montant: number;
    mode_paiement: string;
    projetId: string;
}

interface Projet {
    id: string;
    nom_projet: string;
}

export default function GrandCaisse() {
    const [grandCaisses, setGrandCaisses] = useState<GrandCaisse[]>([]);
    const [projets, setProjets] = useState<Projet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchGrandCaisses = async () => {
        try {
            const response = await fetch('/api/grandCaisse');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données de GrandCaisse');
            }
            const data = await response.json();
            setGrandCaisses(data);
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la récupération des données de GrandCaisse');
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
            await Promise.all([fetchGrandCaisses(), fetchProjets()]);
            setLoading(false);
        };

        loadData();
    }, []);

    const getProjetName = (projetId: string) => {
        const projet = projets.find((p) => p.id === projetId);
        return projet ? projet.nom_projet : 'Inconnu';
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    const handleSubmit = async (data: { date: string; libelle: string; montant: number; mode_paiement: string; projetId: string }) => {
        try {
            const response = await fetch('/api/grandCaisse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de l\'entrée');
            }

            fetchGrandCaisses();
        } catch (error) {
            console.error(error);
            setError('Erreur lors de l\'ajout de l\'entrée');
        }
    };


    const handleDeleteAll = async () => {
        try {
            const response = await fetch('/api/grandCaisse/delete', {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de toutes les entrées');
            }

            await fetchGrandCaisses();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error(error);
            setError('Erreur lors de la suppression de toutes les entrées');
        }
    };

    const filteredItems = grandCaisses.filter(item => 
        item.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const rowsToDisplay = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const getPaginationItems = () => {
        const pages = [];

        // Calculate the range of pages to show
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(startPage + 2, totalPages);

        // Add pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (endPage < totalPages - 1) {
            pages.push('...');
        }
        if (endPage < totalPages) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Grand Caisse</h1>
            
            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-4">
                    <Button onClick={() => setIsModalOpen(true)} className='bg-blue-500 hover:bg-blue-700'>Ajouter une entrée</Button>
                    <Button onClick={() => setIsImportModalOpen(true)} className='bg-green-500 hover:bg-green-700'>Importer Excel</Button>
                    <Button color="failure" onClick={() => setShowDeleteConfirmation(true)} className='bg-red-500 hover:bg-red-700'>Supprimer tout</Button>
                </div>
                {/* Barre de recherche standard à droite */}
                <div>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-md p-2 w-64"
                    />
                </div>
            </div>

            <GrandCaisseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projets={projets}
                onSubmit={handleSubmit}
            />

            <ImportExcelModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={() => {
        
                    setIsImportModalOpen(false);
                }}
            />

            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <Modal.Header>Confirmation de suppression</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Êtes-vous sûr de vouloir supprimer toutes les entrées ? Cette action est irréversible.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="failure" onClick={handleDeleteAll}>Oui, supprimer tout</Button>
                    <Button color="gray" onClick={() => setShowDeleteConfirmation(false)}>Annuler</Button>
                </Modal.Footer>
            </Modal>

            <Table>
                <Table.Head>
                    <Table.HeadCell>Date</Table.HeadCell>
                    <Table.HeadCell>Libellé</Table.HeadCell>
                    <Table.HeadCell>Montant</Table.HeadCell>
                    <Table.HeadCell>Mode de Paiement</Table.HeadCell>
                    <Table.HeadCell>Projet</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {filteredItems.length > 0 ? (
                        rowsToDisplay.map((grandCaisse, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{grandCaisse.date ? new Date(grandCaisse.date).toLocaleDateString() : '-'}</Table.Cell>
                                <Table.Cell>{grandCaisse.libelle || '-'}</Table.Cell>
                                <Table.Cell>{grandCaisse.montant.toFixed(2) || '-'}</Table.Cell>
                                <Table.Cell>{grandCaisse.mode_paiement || '-'}</Table.Cell>
                                <Table.Cell>{getProjetName(grandCaisse.projetId) || '-'}</Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={5} className="text-center">
                                Aucun résultat trouvé
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            <div className="flex justify-center mt-4">
                {/* Previous Button */}
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="mx-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    &lt;
                </button>

                {getPaginationItems().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        className={`mx-1 w-10 h-10 flex items-center justify-center rounded-full ${
                            page === currentPage 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300'
                        } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
                        disabled={typeof page !== 'number'}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="mx-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}