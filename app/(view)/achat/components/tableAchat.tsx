'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination } from 'flowbite-react';
import { Edit, Trash2 } from 'lucide-react';

interface Achat {
  id: string;
  date: string;
  designation: string;
  nombre: number;
  prix_unitaire: number;
  total: number;
  uniteId: string;
  classeId: string;
  unite?: { nom: string };
  classe?: { nom: string };
}

interface AchatTableProps {
  onEdit: (achat: Achat) => void;
  onDelete: (id: string) => void;
}

const AchatTable: React.FC<AchatTableProps> = ({ onEdit, onDelete }) => {
  const [achats, setAchats] = useState<Achat[]>([]);
  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/achat');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setAchats(data);
        setIsLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des achats');
        setIsLoading(false);
        console.error('Erreur:', err);
      }
    };

    fetchAchats();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedAchats = achats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Désignation</Table.HeadCell>
          <Table.HeadCell>Nombre</Table.HeadCell>
          <Table.HeadCell>Prix Unitaire</Table.HeadCell>
          <Table.HeadCell>Total</Table.HeadCell>
          <Table.HeadCell>Unité</Table.HeadCell>
          <Table.HeadCell>Classe</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {paginatedAchats.map((achat) => (
            <Table.Row key={achat.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(achat.date).toLocaleDateString()}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{achat.designation}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{achat.nombre}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{achat.prix_unitaire.toFixed(2)}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{achat.total.toFixed(2)}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{achat.unite?.nom || 'N/A'}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{achat.classe?.nom || 'N/A'}</Table.Cell>
              <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2 justify-center items-center">
                  <Button onClick={() => onEdit(achat)} size="sm" className='bg-transparent hover:bg-transparent'>
                    <Edit size={16} className='text-black'/>
                  </Button>
                  <Button onClick={() => onDelete(achat.id)} color="failure" size="sm" className='bg-transparent hover:bg-transparent'>
                    <Trash2 size={16} className='text-red-600'/>
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {achats.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(achats.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AchatTable;