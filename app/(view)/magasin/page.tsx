"use client";

import { useEffect, useState, Suspense } from 'react';
import { Table } from "flowbite-react";
import { Modal } from "./components/modal";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";

interface Projet {
  id: string;
  nom_projet: string;
}

interface Magasin {
  id: string;
  lieu_magasin: string;
  code_magasin: string;
  projetId: string;
}

export default function Magasin() {
  const [magasins, setMagasins] = useState<Magasin[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMagasin, setSelectedMagasin] = useState<Magasin | null>(null);

  const fetchMagasins = async () => {
    try {
      const response = await fetch('/api/magasin');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des magasins');
      }
      const data = await response.json();
      setMagasins(data);
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des magasins');
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
      await Promise.all([fetchMagasins(), fetchProjets()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getProjetName = (projetId: string) => {
    const projet = projets.find((p) => p.id === projetId);
    return projet ? projet.nom_projet : 'Inconnu';
  };

  const handleEditClick = (magasin: Magasin) => {
    setSelectedMagasin(magasin);
    setIsEditModalOpen(true);
  };

  if (loading) return <div className="flex justify-center">Chargement...</div>;

  return (
    <Suspense fallback={<div className="flex justify-center">Chargement...</div>}>
      <div className="p-3">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Magasins</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white mt-4 mb-4">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un magasin
        </Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        {isEditModalOpen && selectedMagasin && (
          <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} magasin={selectedMagasin} />
        )}
        <div className="overflow-x-auto pt-2">
          <Table>
            <Table.Head>
              <Table.HeadCell>Lieu</Table.HeadCell>
              <Table.HeadCell>Code</Table.HeadCell>
              <Table.HeadCell>Projet</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {magasins.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4} className="text-center">Aucun magasin trouvé</Table.Cell>
                </Table.Row>
              ) : (
                magasins.map((magasin) => (
                  <Table.Row key={magasin.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {magasin.lieu_magasin}
                    </Table.Cell>
                    <Table.Cell>{magasin.code_magasin}</Table.Cell>
                    <Table.Cell>{getProjetName(magasin.projetId)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleEditClick(magasin)} className="bg-transparent hover:bg-transparent">
                          <Edit className="h-4 w-4 text-black" />
                        </Button>
                        <Button className="bg-transparent hover:bg-transparent">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Suspense>
  );
}