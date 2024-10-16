'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { z } from 'zod';

const magasinSchema = z.object({
  lieu_magasin: z.string().min(1, "Le lieu du magasin est requis"),
  code_magasin: z.string().min(1, "Le code du magasin est requis"),
  projetId: z.string().min(1, "L'ID du projet est requis")
});

type MagasinData = z.infer<typeof magasinSchema>;
type MagasinErrors = Partial<Record<keyof MagasinData, string>>;

interface Projet {
  id: string;
  nom_projet: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  magasin?: MagasinData & { id?: string };
}

export function Modal({ isOpen, onClose, magasin }: ModalProps) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [formData, setFormData] = useState<MagasinData>({
    lieu_magasin: magasin?.lieu_magasin || '',
    code_magasin: magasin?.code_magasin || '',
    projetId: magasin?.projetId || ''
  });
  const [errors, setErrors] = useState<MagasinErrors>({});
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
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
        setProjectError('Erreur lors de la récupération des projets');
      } finally {
        setLoading(false);
      }
    };
    fetchProjets();
  }, []);

  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      magasinSchema.parse(formData);
      const response = await fetch(`/api/magasin/${magasin?.id || ''}`, {
        method: magasin ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la soumission du formulaire');
      }
      const result = await response.json();
      console.log('Réponse du serveur:', result);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: MagasinErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0] as keyof MagasinData] = err.message;
          return acc;
        }, {} as MagasinErrors);
        setErrors(validationErrors);
      } else {
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{magasin ? 'Modifier le magasin' : 'Ajouter un nouveau magasin'}</h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="lieu_magasin" className="block text-sm font-medium text-gray-700">Lieu</label>
                          <input
                            type="text"
                            id="lieu_magasin"
                            value={formData.lieu_magasin}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.lieu_magasin && <p className="mt-2 text-sm text-red-600">{errors.lieu_magasin}</p>}
                        </div>
                        <div>
                          <label htmlFor="code_magasin" className="block text-sm font-medium text-gray-700">Code</label>
                          <input
                            type="text"
                            id="code_magasin"
                            value={formData.code_magasin}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {errors.code_magasin && <p className="mt-2 text-sm text-red-600">{errors.code_magasin}</p>}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={openProjectModal}
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Choisir un projet
                            <ChevronDown className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <Button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {magasin ? 'Enregistrer les modifications' : 'Enregistrer'}
                          </Button>
                          <Button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Choisir un projet</h3>
                    <div className="mt-2">
                      {loading ? (
                        <p>Chargement des projets...</p>
                      ) : projectError ? (
                        <p className="text-red-600">{projectError}</p>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {projets.map((projet) => (
                            <li key={projet.id} className="py-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{projet.nom_projet}</p>
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      projetId: projet.id
                                    }));
                                    closeProjectModal();
                                  }}
                                  className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Sélectionner
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  onClick={closeProjectModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}