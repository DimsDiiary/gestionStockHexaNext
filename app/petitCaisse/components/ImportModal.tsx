import { useState, useEffect } from 'react';
import { Modal, Button, Label, Select, FileInput, Spinner } from 'flowbite-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface Projet {
  id: string;
  nom_projet: string;
}

export default function ImportModal({ isOpen, onClose, onImportSuccess }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [projetId, setProjetId] = useState('');
  const [projets, setProjets] = useState<Projet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await fetch('/api/projet');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des projets');
        }
        const data = await response.json();
        setProjets(data);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchProjets();
  }, []);

  const handleImport = async () => {
    if (!file || !projetId) {
      setError('Veuillez sélectionner un fichier et un projet');
      return;
    }

    setIsImporting(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projetId', projetId);

    try {
      const response = await fetch('/api/petitCaisse/Import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'importation');
      }

      onImportSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      {!isImporting ? (
        <>
          <Modal.Header>Importer des données</Modal.Header>
          <Modal.Body>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <Label htmlFor="projet">Choisir le projet</Label>
                <Select
                  id="projet"
                  value={projetId}
                  onChange={(e) => setProjetId(e.target.value)}
                >
                  <option value="">Sélectionnez un projet</option>
                  {projets.map((projet) => (
                    <option key={projet.id} value={projet.id}>
                      {projet.nom_projet}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Sélectionner un fichier Excel</Label>
                <FileInput
                  id="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={onClose}>
              Annuler
            </Button>
            <Button color="blue" onClick={handleImport}>
              Importer
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Modal.Body>
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="xl" />
            <p className="mt-4 text-lg font-semibold">Importation en cours...</p>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
}