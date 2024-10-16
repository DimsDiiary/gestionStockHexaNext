'use client'

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

interface EntreTableProps {
  isLoading: boolean;
  apiError: string | null;
  entres: Entre[];
  onEntreUpdated: () => void;
}

export const entreSchema = z.object({
  date: z.string().nonempty("La date est requise"),
  source: z.string().optional(),
  nombre: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Le nombre doit être un nombre valide"
  }),
  observation: z.string().optional(),
  chantierId: z.string().optional(),
  achatId: z.string().nonempty("L'achat est requis"),
  destination: z.string().optional(),
});

type EntreFormData = z.infer<typeof entreSchema>;

const EntreTable: React.FC<EntreTableProps> = ({ isLoading, apiError, entres, onEntreUpdated }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEntre, setEditingEntre] = useState<Entre | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 5;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EntreFormData>({
    resolver: zodResolver(entreSchema),
  });

  useEffect(() => {
    if (editingEntre) {
      reset({
        date: new Date(editingEntre.date).toISOString().split('T')[0],
        source: editingEntre.source,
        nombre: editingEntre.nombre.toString(),
        observation: editingEntre.observation,
        achatId: editingEntre.achatId,
        destination: editingEntre.destination,
      });
    }
  }, [editingEntre, reset]);

  if (isLoading) {
    return <p>Chargement des entrées...</p>;
  }

  if (apiError) {
    return <p className="text-red-500">{apiError}</p>;
  }

  const sortedEntres = [...entres].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEntres.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedEntres.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (entre: Entre) => {
    setEditingEntre(entre);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      try {
        const response = await fetch(`/api/entre/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onEntreUpdated();
        } else {
          console.error('Erreur lors de la suppression de l\'entrée');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'entrée:', error);
      }
    }
  };

  const onSubmit = async (data: EntreFormData) => {
    if (!editingEntre) return;

    try {
      const response = await fetch(`/api/entre/${editingEntre.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onEntreUpdated();
        setIsEditModalOpen(false);
        setEditingEntre(null);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la modification de l\'entrée:', errorData);
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Désignation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((entre) => (
            <tr key={entre.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entre.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entre.designation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entre.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entre.source}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entre.destination}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entre.observation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => handleEdit(entre)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(entre.id)} className="text-red-600 hover:text-red-900">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      {sortedEntres.length > itemsPerPage && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, sortedEntres.length)}</span> sur{' '}
              <span className="font-medium">{sortedEntres.length}</span> résultats
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (page <= 3 || page === totalPages || (currentPage - 1 <= page && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`flex items-center justify-center w-10 h-10 text-base ${
                        currentPage === page
                          ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      } rounded-full`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === 4 && totalPages > 5) {
                  return <span key="ellipsis" className="px-2">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingEntre && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Modifier l&apos;entrée</h3>
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
                  onClick={() => setIsEditModalOpen(false)}
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

export default EntreTable;