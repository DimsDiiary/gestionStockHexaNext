'use client'

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import Sorties, { SortieFormData } from './Sortie';
import SortieTable from './SortieTable';

interface Sortie {
  destination: string;
  id: string;
  date: string;
  designation: string;
  unite: string;
  nombre: number;
  classe: string;
  source: string;
  observation: string;
}

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [sorties, setSorties] = useState<Sortie[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImportingModalOpen, setIsImportingModalOpen] = useState(false);
    const [isAddSortieModalOpen, setIsAddSortieModalOpen] = useState(false);
    const [isEditSortieModalOpen, setIsEditSortieModalOpen] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortieToEdit, setSortieToEdit] = useState<Sortie | undefined>(undefined);

    useEffect(() => {
        fetchSorties();
    }, []);

    useEffect(() => {
        console.log("isAddSortieModalOpen changed:", isAddSortieModalOpen);
        console.log("isEditSortieModalOpen changed:", isEditSortieModalOpen);
    }, [isAddSortieModalOpen, isEditSortieModalOpen]);

    const fetchSorties = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/sortie');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des sorties');
            }
            const data = await response.json();
            setSorties(data);
        } catch (error) {
            console.error('Erreur lors du chargement des sorties:', error);
            setApiError("Erreur lors du chargement des sorties. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            setMessage("Veuillez sélectionner un fichier.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsImportModalOpen(false);
        setIsImportingModalOpen(true);

        try {
            const response = await fetch('/api/sortie/Import', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'importation');
            }

            const result = await response.json();
            setMessage(`${result.message} ${result.count} sorties importées.`);
            await fetchSorties();
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            setMessage("Erreur lors de l'envoi du fichier. Veuillez réessayer.");
        } finally {
            setIsImportingModalOpen(false);
        }
    };

    const handleDeleteAllSorties = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les sorties ? Cette action est irréversible.")) {
            try {
                const response = await fetch('/api/sortie/delete', {
                    method: 'DELETE',
                });
    
                let errorMessage = '';
                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.message || response.statusText;
                    } catch (jsonError) {
                        errorMessage = response.statusText;
                    }
                    throw new Error(`Erreur lors de la suppression des sorties: ${errorMessage}`);
                }
    
                const result = await response.json();
                setMessage(`${result.message} ${result.count} sorties supprimées.`);
                setSorties([]);
                await fetchSorties();
            } catch (error) {
                console.error('Erreur détaillée lors de la suppression des sorties:', error);
                setMessage(`Erreur lors de la suppression des sorties: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };

    const handleEdit = (sortie: Sortie) => {
        console.log("handleEdit called with sortie:", sortie);
        setSortieToEdit(sortie);
        setIsEditSortieModalOpen(true);
        console.log("isEditSortieModalOpen set to true");
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sortie ?')) {
            try {
                const response = await fetch(`/api/sortie/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression de la sortie');
                }

                setMessage('Sortie supprimée avec succès');
                await fetchSorties();
            } catch (error) {
                console.error('Erreur lors de la suppression de la sortie:', error);
                setMessage(`Erreur: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gestion des stocks</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => {
                            setSortieToEdit(undefined);
                            setIsAddSortieModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Ajouter une sortie
                    </button>
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Importer
                    </button>
                    <button 
                        onClick={handleDeleteAllSorties}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Supprimer toutes les sorties
                    </button>
                </div>
            </div>

            <SortieTable 
                isLoading={isLoading} 
                apiError={apiError} 
                sorties={sorties.map(sortie => ({...sortie, destination: sortie.destination || ''}))} 
                onEdit={handleEdit}
                onDelete={handleDelete} 
            />

            <Dialog open={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-8 max-w-md w-full mx-auto">
                        <Dialog.Title className="text-2xl font-bold mb-6 text-gray-800">Importation de fichier</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="file-upload" className="text-sm font-medium text-gray-700">Fichier</label>
                                <input 
                                    id="file-upload"
                                    type="file" 
                                    onChange={handleFileChange} 
                                    required 
                                    className="border border-gray-300 rounded-md p-2 text-sm"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Importer
                            </button>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <Dialog open={isImportingModalOpen} onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-8 max-w-md w-full mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                            <p className="mt-4 text-lg font-semibold">Importation en cours...</p>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <Dialog 
                open={isAddSortieModalOpen || isEditSortieModalOpen} 
                onClose={() => {
                    setIsAddSortieModalOpen(false);
                    setIsEditSortieModalOpen(false);
                    setSortieToEdit(undefined);
                }} 
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-8 max-w-md w-full mx-auto">
                        <Dialog.Title className="text-2xl font-bold mb-6 text-gray-800">
                            {sortieToEdit ? 'Modifier une sortie' : 'Ajouter une sortie'}
                        </Dialog.Title>
                        <Sorties 
                            onClose={() => {
                                setIsAddSortieModalOpen(false);
                                setIsEditSortieModalOpen(false);
                                setSortieToEdit(undefined);
                            }} 
                            onSortieAdded={() => {
                                console.log('Sortie ajoutée ou modifiée avec succès!');
                                fetchSorties();
                            }}
                            sortieToEdit={sortieToEdit ? {
                                ...sortieToEdit,
                                nombre: String(sortieToEdit.nombre),
                                achatId: sortieToEdit.id
                            } : undefined}
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default FileUpload;