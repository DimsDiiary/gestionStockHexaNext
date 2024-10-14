'use client'

import { useState } from 'react';
import { Button } from 'flowbite-react';
import PetitCaisseList from './components/PetitCaisseList';
import PetitCaisseForm from './components/PetitCaisseForm';
import ImportModal from './components/ImportModal';

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const handleFormSubmit = () => {
    setIsFormModalOpen(false);
    setShouldRefresh(true);
  };

  const handleImportSuccess = () => {
    setIsImportModalOpen(false);
    setShouldRefresh(true);
  };

  const handleDelete = async () => {
    const response = await fetch('/api/petitCaisse/delete', {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Entries deleted successfully');
      setShouldRefresh(true);
    } else {
      alert('Failed to delete entries');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 sm:mr-6">Gestion de la Petite Caisse</h1>
      <div className="flex flex-col sm:flex-row sm:items-center mb-8">

        <div className="flex flex-wrap gap-4">
          <Button 
            color="blue" 
            onClick={() => setIsFormModalOpen(true)}
            className="font-semibold py-1 px-3 text-xs rounded shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
          >
            Ajouter une entrée
          </Button>
          <Button 
            color="green"
            onClick={() => setIsImportModalOpen(true)}
            className="font-semibold py-1 px-3 text-xs rounded shadow-sm transition duration-300 ease-in-out transform hover:scale-105 bg-green-500 hover:bg-green-600 text-white"
          >
            Importer des données
          </Button>
          <Button 
            color="red"
            onClick={handleDelete}
            className="font-semibold py-1 px-3 text-xs rounded shadow-sm transition duration-300 ease-in-out transform hover:scale-105 bg-red-500 hover:bg-red-600 text-white"
          >
            Supprimer des entrées
          </Button>
        </div>
      </div>
      
      <PetitCaisseList shouldRefresh={shouldRefresh} onRefreshComplete={() => setShouldRefresh(false)} />
      
      <PetitCaisseForm 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitSuccess={handleFormSubmit}
      />
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}