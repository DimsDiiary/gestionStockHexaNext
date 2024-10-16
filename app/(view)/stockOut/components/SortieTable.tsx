'use client'

import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Sortie {
  id: string;
  date: string;
  designation: string;
  unite: string;
  nombre: number;
  classe: string;
  source: string;
  destination: string;
  observation: string;
}

interface SortieTableProps {
  isLoading: boolean;
  apiError: string | null;
  sorties: Sortie[];
  onEdit: (sortie: Sortie) => void;
  onDelete: (id: string) => Promise<void>;
}

export const sortieSchema = z.object({
  date: z.string().nonempty("La date est requise"),
  source: z.string().nonempty("La source est requise"),
  nombre: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Le nombre doit être un nombre valide"
  }),
  observation: z.string().optional(),
  destination: z.string().nonempty("La destination est requise"),
});

type SortieFormData = z.infer<typeof sortieSchema>;

const SortieTable: React.FC<SortieTableProps> = ({ isLoading, apiError, sorties, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSortie, setEditingSortie] = useState<Sortie | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 5; // Changé de 10 à 5

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SortieFormData>({
    resolver: zodResolver(sortieSchema),
  });

  useEffect(() => {
    if (editingSortie) {
      reset({
        date: new Date(editingSortie.date).toISOString().split('T')[0],
        source: editingSortie.source,
        nombre: editingSortie.nombre.toString(),
        observation: editingSortie.observation,
        destination: editingSortie.destination,
      });
    }
  }, [editingSortie, reset]);

  if (isLoading) {
    return <p className="text-center py-4">Chargement des sorties...</p>;
  }

  if (apiError) {
    return <p className="text-center py-4 text-red-500">{apiError}</p>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorties.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (sortie: Sortie) => {
    setEditingSortie(sortie);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette sortie ?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Erreur lors de la suppression de la sortie:', error);
      }
    }
  };

  const onSubmit = async (data: SortieFormData) => {
    try {
      const updatedSortie: Sortie = editingSortie 
        ? { ...editingSortie, ...data, nombre: Number(data.nombre), observation: data.observation ?? '' }
        : { ...data, id: '', designation: '', unite: '', classe: '', nombre: Number(data.nombre), observation: data.observation ?? '' };
      
      onEdit(updatedSortie);
      setIsEditModalOpen(false);
      setEditingSortie(null);
      reset();
    } catch (error) {
      console.error('Erreur lors de l\'opération sur la sortie:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Désignation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((sortie) => (
            <tr key={sortie.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sortie.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sortie.designation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sortie.unite}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sortie.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sortie.classe}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sortie.source}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sortie.destination}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sortie.observation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => handleEdit(sortie)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(sortie.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorties.length > itemsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, sorties.length)}</span> sur{' '}
                <span className="font-medium">{sorties.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Précédent</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.ceil(sorties.length / itemsPerPage) }).map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = currentPage === pageNumber;
                  const isWithinRange = pageNumber <= 3 || pageNumber === Math.ceil(sorties.length / itemsPerPage) || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                  
                  if (isWithinRange) {
                    return (
                      <button
                        key={index}
                        onClick={() => paginate(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full ${
                          isCurrentPage
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } mx-1`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === 4 && Math.ceil(sorties.length / itemsPerPage) > 5) {
                    return <span key="ellipsis" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-full mx-1">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => paginate(Math.min(Math.ceil(sorties.length / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(sorties.length / itemsPerPage)}
                  className="relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Suivant</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Modifier la sortie
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date:</label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      {...field}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Source:</label>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                />
                {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Destination:</label>
                <Controller
                  name="destination"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                />
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Observation:</label>
                <Controller
                  name="observation"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows={4}
                    />
                  )}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingSortie(null);
                    reset();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortieTable;