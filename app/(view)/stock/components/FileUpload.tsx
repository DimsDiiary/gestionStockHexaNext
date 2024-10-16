'use client'

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import Entres from './Entres';
import EntreTable from './EntreTable';

interface Entre {
  id: string;
  date: string;
  designation: string;
  unite: string;
  nombre: number;
  classe: string;
  source: string;
  observation: string;
  destination: string;
  achatId: string;
}

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [entres, setEntres] = useState<Entre[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImportingModalOpen, setIsImportingModalOpen] = useState(false);
    const [isAddEntreModalOpen, setIsAddEntreModalOpen] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEntres();
    }, []);

    const fetchEntres = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/entre');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des entrées');
            }
            const data = await response.json();
            setEntres(data);
        } catch (error) {
            console.error('Erreur lors du chargement des entrées:', error);
            setApiError("Erreur lors du chargement des entrées. Veuillez réessayer.");
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
            const response = await fetch('/api/entre/Import', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'importation');
            }

            const result = await response.json();
            setMessage(`${result.message} ${result.count} entrées importées.`);
            await fetchEntres();
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            setMessage("Erreur lors de l'envoi du fichier. Veuillez réessayer.");
        } finally {
            setIsImportingModalOpen(false);
        }
    };

    const handleDeleteAllEntres = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les entrées ? Cette action est irréversible.")) {
            try {
                const response = await fetch('/api/entre/Delete', {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erreur lors de la suppression des entrées: ${errorData.error || response.statusText}`);
                }

                const result = await response.json();
                setMessage(`${result.message} ${result.count} entrées supprimées.`);
                setEntres([]);
                await fetchEntres();
            } catch (error) {
                console.error('Erreur détaillée lors de la suppression des entrées:', error);
                setMessage(`Erreur lors de la suppression des entrées: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gestion des stocks</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => setIsAddEntreModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Ajouter une entrée
                    </button>
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Importer
                    </button>
                    <button 
                        onClick={handleDeleteAllEntres}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Supprimer toutes les entrées
                    </button>
                </div>
            </div>

            <EntreTable 
                isLoading={isLoading}
                apiError={apiError}
                entres={entres as Entre[]} onEntreUpdated={function (): void {
                    throw new Error('Function not implemented.');
                } }            />

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
                        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
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

            <Dialog open={isAddEntreModalOpen} onClose={() => setIsAddEntreModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-8 max-w-md w-full mx-auto">
                        <Dialog.Title className="text-2xl font-bold mb-6 text-gray-800">Ajouter une entrée</Dialog.Title>
                        <Entres onClose={() => setIsAddEntreModalOpen(false)} onEntreAdded={() => console.log('Entrée ajoutée avec succès!')} />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default FileUpload;
