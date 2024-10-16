import { useState } from 'react';
import { Modal, Button, Label, FileInput, Spinner, TextInput } from 'flowbite-react';

interface ImportExcelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: () => void;
}

export default function ImportExcelModal({ isOpen, onClose, onImportSuccess }: ImportExcelModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>(''); // État pour la méthode de paiement
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            setIsImporting(true);
            setError(null);
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('mode_paiement', paymentMethod); // Ajout de la méthode de paiement

            try {
                const response = await fetch('/api/grandCaisse/Import', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'importation');
                }

                const result = await response.json();
                console.log('Importation réussie:', result);
                onImportSuccess();
                // Ne fermez pas la modale ici pour afficher le spinner
            } catch (error) {
                console.error('Erreur d\'importation:', error);
                setError("Une erreur s'est produite lors de l'importation. Veuillez réessayer.");
                setIsImporting(false);
            }
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            {!isImporting ? (
                <>
                    <Modal.Header>Importer des données Excel</Modal.Header>
                    <Modal.Body>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="file" className="block mb-2">Fichier Excel</Label>
                                <FileInput 
                                    id="file" 
                                    accept=".xlsx, .xls" 
                                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                                    required 
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="paymentMethod" className="block mb-2">Méthode de Paiement</Label>
                                <TextInput 
                                    id="paymentMethod" 
                                    value={paymentMethod} 
                                    onChange={(e) => setPaymentMethod(e.target.value)} 
                                    required 
                                    className="w-full"
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={!file || !paymentMethod} // Désactiver si le fichier ou la méthode de paiement est manquant
                        >
                            Importer
                        </Button>
                        <Button color="gray" onClick={onClose}>
                            Annuler
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