"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { Button, Label, Table, Spinner, Alert, Modal } from 'flowbite-react';
import { NextPage } from 'next';
import { uniteSchema } from './uniteSchema';
import { Unite as PrismaUnite } from '@prisma/client';
import { Edit, Trash2 } from 'lucide-react'; // Add this line to import the icons

interface Unite extends PrismaUnite {
    achatId?: string; // Add this line to include achatId
}

const UnitesPage: NextPage = () => {
    const [unites, setUnites] = useState<Unite[]>([]);
    const [formData, setFormData] = useState<{ id?: string; nom: string; symbole: string; achatId: string }>({
        nom: '',
        symbole: '',
        achatId: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchUnites = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/unite');
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des unités: ${response.statusText}`);
            }
            const data = await response.json();
            setUnites(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des unités:', error);
            setError('Erreur lors de la récupération des unités');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUnites();
    }, [fetchUnites]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const dataToSend = {
                nom: formData.nom,
                symbole: formData.symbole,
                ...(formData.achatId && { achatId: formData.achatId })
            };
            uniteSchema.parse(dataToSend);
            const url = isEditing ? `/api/unite/${formData.id}` : '/api/unite';
            const method = isEditing ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            if (!response.ok) {
                throw new Error(`Erreur lors de la soumission du formulaire: ${response.statusText}`);
            }
            await fetchUnites();
            setFormData({ nom: '', symbole: '', achatId: '' });
            setIsModalOpen(false);
            setIsEditing(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Validation Error:', error.errors);
            } else {
                console.error('Submission Error:', error);
            }
            setError('Erreur lors de la soumission du formulaire');
        }
    };
    const handleEdit = (unite: Unite) => {
        setFormData({ id: unite.id, nom: unite.nom, symbole: unite.symbole, achatId: unite.achatId || '' });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette unité ?')) {
            try {
                const response = await fetch(`/api/unite/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || `Erreur lors de la suppression de l'unité: ${response.statusText}`);
                }
                
                setUnites(prevUnites => prevUnites.filter(unite => unite.id !== id));
                setError(null);
            } catch (error: any) {
                console.error('Erreur lors de la suppression de l\'unité:', error);
                setError(error.message || 'Erreur lors de la suppression de l\'unité');
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = unites.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <Button onClick={() => { setIsEditing(false); setIsModalOpen(true); }} className="mb-4">
                Ajouter une Unité
            </Button>
            {loading ? (
                <div className="flex justify-center">
                    <Spinner aria-label="Chargement..." />
                </div>
            ) : error ? (
                <Alert color="failure">
                    {error}
                </Alert>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Unités</h2>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Nom</Table.HeadCell>
                            <Table.HeadCell>Symbole</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {currentItems.map((unite) => (
                                <Table.Row key={unite.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{unite.nom}</Table.Cell>
                                    <Table.Cell>{unite.symbole}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center space-x-2">
                                            <Button onClick={() => handleEdit(unite)} size="sm" className='bg-transparent hover:bg-transparent'>
                                                <Edit size={16} className='text-black' />
                                            </Button>
                                            <Button onClick={() => handleDelete(unite.id)} color="failure" size="sm" className='bg-transparent hover:bg-transparent'>
                                                <Trash2 size={16} className='text-red-600' />
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>

                    {unites.length > itemsPerPage && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <Button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Précédent
                                </Button>
                                <Button
                                    onClick={() => paginate(Math.min(Math.ceil(unites.length / itemsPerPage), currentPage + 1))}
                                    disabled={currentPage === Math.ceil(unites.length / itemsPerPage)}
                                >
                                    Suivant
                                </Button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                                        <span className="font-medium">{Math.min(indexOfLastItem, unites.length)}</span> sur{' '}
                                        <span className="font-medium">{unites.length}</span> résultats
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {Array.from({ length: Math.ceil(unites.length / itemsPerPage) }).map((_, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => paginate(index + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    currentPage === index + 1
                                                        ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                }`}
                                            >
                                                {index + 1}
                                            </Button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <Modal show={isModalOpen} onClose={() => { setIsModalOpen(false); setIsEditing(false); }}>
                <Modal.Header className="text-lg font-semibold">{isEditing ? 'Modifier une Unité' : 'Ajouter une Unité'}</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div className="flex flex-wrap -mx-3 mb-4">
                            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                                <Label htmlFor="nom" className="block mb-1">Nom</Label>
                                <input
                                    id="nom"
                                    type="text"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    placeholder="Nom"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <Label htmlFor="symbole" className="block mb-1">Symbole</Label>
                                <input
                                    id="symbole"
                                    type="text"
                                    value={formData.symbole}
                                    onChange={handleChange}
                                    placeholder="Symbole"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                                {isEditing ? 'Modifier' : 'Ajouter'}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UnitesPage;