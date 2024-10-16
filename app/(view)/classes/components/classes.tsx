'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { Button, Label, Modal, Spinner, Table, TextInput, Alert } from 'flowbite-react';
import { Edit, Trash2, Plus } from 'lucide-react';

// Schéma pour classe
export const classeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
});

interface Classe {
  id: string;
  nom: string;
}

const ERROR_MESSAGES = {
  fetch: 'Erreur lors de la récupération des classes',
  submit: 'Erreur lors de la soumission du formulaire',
  delete: 'Erreur lors de la suppression de la classe',
  validation: 'Erreur de validation',
};

const ClasseForm = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [formData, setFormData] = useState<{ id?: string; nom: string }>({ nom: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/classe');
      if (!response.ok) {
        throw new Error(`${ERROR_MESSAGES.fetch}: ${response.statusText}`);
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error(ERROR_MESSAGES.fetch, error);
      setError(ERROR_MESSAGES.fetch);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

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
      classeSchema.parse(formData);
      const url = isEditing ? `/api/classe/${formData.id}` : '/api/classe';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `${ERROR_MESSAGES.submit}: ${response.statusText}`);
      }

      await fetchClasses();
      setFormData({ nom: '' });
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(ERROR_MESSAGES.validation, error.errors);
        setError(`${ERROR_MESSAGES.validation}: ${error.errors.map(e => e.message).join(', ')}`);
      } else {
        console.error(ERROR_MESSAGES.submit, error);
        setError(error instanceof Error ? error.message : ERROR_MESSAGES.submit);
      }
    }
  };

  const handleEdit = (classe: Classe) => {
    setFormData({ id: classe.id, nom: classe.nom });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      try {
        const response = await fetch(`/api/classe/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `${ERROR_MESSAGES.delete}: ${response.statusText}`);
        }
        await fetchClasses();
      } catch (error) {
        console.error(ERROR_MESSAGES.delete, error);
        setError(error instanceof Error ? error.message : ERROR_MESSAGES.delete);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = classes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
        <Button onClick={() => { setIsEditing(false); setIsModalOpen(true); }} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une Classe
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      ) : (
        <>
          <div className="overflow-x-auto">
            <ClasseTable classes={currentItems} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
          {classes.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={classes.length}
                paginate={paginate}
              />
            </div>
          )}
        </>
      )}

      <ClasseModal
        isModalOpen={isModalOpen}
        isEditing={isEditing}
        formData={formData}
        error={error}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        closeModal={() => { setIsModalOpen(false); setIsEditing(false); setError(null); }}
      />
    </div>
  );
};

const ClasseTable = ({ classes, onEdit, onDelete }: { classes: Classe[], onEdit: (classe: Classe) => void, onDelete: (id: string) => void }) => (
  <Table hoverable>
    <Table.Head className="bg-gray-50">
      <Table.HeadCell className="py-3">Nom</Table.HeadCell>
      <Table.HeadCell className="py-3">Actions</Table.HeadCell>
    </Table.Head>
    <Table.Body className="divide-y">
      {classes.map((classe) => (
        <Table.Row key={classe.id} className="bg-white hover:bg-gray-50">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 py-4">
            {classe.nom}
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center space-x-2">
              <Button onClick={() => onEdit(classe)} size="sm" color="light">
                <Edit className="h-4 w-4 text-blue-500" />
              </Button>
              <Button onClick={() => onDelete(classe.id)} size="sm" color="light">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const Pagination = ({ currentPage, itemsPerPage, totalItems, paginate }: { currentPage: number, itemsPerPage: number, totalItems: number, paginate: (pageNumber: number) => void }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
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
    <div className="flex justify-center mt-4">
      {/* Previous Button */}
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="mx-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        &lt;
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && paginate(page)}
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
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="mx-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

const ClasseModal = ({ isModalOpen, isEditing, formData, error, handleChange, handleSubmit, closeModal }: { isModalOpen: boolean, isEditing: boolean, formData: { id?: string; nom: string }, error: string | null, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void, closeModal: () => void }) => (
  <Modal show={isModalOpen} onClose={closeModal}>
    <Modal.Header>{isEditing ? 'Modifier une Classe' : 'Ajouter une Classe'}</Modal.Header>
    <Modal.Body>
      {error && <Alert color="failure" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="nom" value="Nom de la classe" className="mb-2 block" />
          <TextInput
            id="nom"
            type="text"
            placeholder="Entrez le nom de la classe"
            required
            value={formData.nom}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal.Body>
  </Modal>
);

export default ClasseForm; 