import React from 'react'; // {{ edit_1 }}
import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';

interface PetitCaisse {
  id: string;
  date: string;
  libelle: string;
  debit: string;
  credit: string;
  solde: string;
  projetId: string;
  projet?: { nom_projet: string };
}

interface PetitCaisseListProps {
  shouldRefresh: boolean;
  onRefreshComplete: () => void;
}

const ITEMS_PER_PAGE = 5;

const PetitCaisseList = ({ shouldRefresh, onRefreshComplete }: PetitCaisseListProps) => {
  const [petitCaissesList, setPetitCaissesList] = useState<PetitCaisse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPetitCaisses = async () => {
    try {
      const response = await fetch('/api/petitCaisse');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      setPetitCaissesList(data);
    } catch (err) {
      setError('Erreur lors de la récupération des données');
      console.error('Erreur:', err);
    }
    onRefreshComplete(); // {{ edit_2 }}
  };

  useEffect(() => {
    if (shouldRefresh) {
      fetchPetitCaisses();
    }
  }, [shouldRefresh]);

  useEffect(() => {
    fetchPetitCaisses();
  }, []);

  const totalPages = Math.ceil(petitCaissesList.length / ITEMS_PER_PAGE);
  const displayedItems = petitCaissesList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
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

    return (
      <div className="flex justify-center mt-4">
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          &lt;
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            className={`mx-1 w-10 h-10 flex items-center justify-center rounded-full ${
              page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Table striped hoverable>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Libellé</Table.HeadCell>
          <Table.HeadCell>Débit</Table.HeadCell>
          <Table.HeadCell>Crédit</Table.HeadCell>
          <Table.HeadCell>Solde</Table.HeadCell>
          <Table.HeadCell>Projet</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {displayedItems.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center">
                Aucune donnée disponible
              </Table.Cell>
            </Table.Row>
          ) : (
            displayedItems.map((petitCaisse) => (
              <Table.Row key={petitCaisse.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(petitCaisse.date).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{petitCaisse.libelle}</Table.Cell>
                <Table.Cell>{petitCaisse.debit}</Table.Cell>
                <Table.Cell>{petitCaisse.credit}</Table.Cell>
                <Table.Cell>{petitCaisse.solde}</Table.Cell>
                <Table.Cell>{petitCaisse.projet?.nom_projet || 'N/A'}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {petitCaissesList.length > ITEMS_PER_PAGE && renderPagination()}
    </div>
  );
};

export default PetitCaisseList;