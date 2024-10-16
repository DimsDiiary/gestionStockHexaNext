import { useState, useEffect } from 'react';
import { TextInput, Select, Button, Modal, Label } from 'flowbite-react';
import { Loader2, CircleX } from 'lucide-react';

interface Projet {
    id: string;
    nom_projet: string;
}

interface PetitCaisseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function PetitCaisseForm({ isOpen, onClose, onSubmitSuccess }: PetitCaisseFormProps) {
    const [formData, setFormData] = useState({
        date: '',
        libelle: '',
        debit: '',
        credit: '',
        projetId: '',
    });
    const [projets, setProjets] = useState<Projet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const dataToSend = {
                date: formData.date,
                libelle: formData.libelle,
                debit: formData.debit ? parseFloat(formData.debit) : 0,
                credit: formData.credit ? parseFloat(formData.credit) : 0,
                projetId: formData.projetId || null,
            };

            const response = await fetch('/api/petitCaisse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'envoi des données');
            }

            setFormData({
                date: '',
                libelle: '',
                debit: '',
                credit: '',
                projetId: '',
            });
            onSubmitSuccess();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="flex justify-end p-2">
                <CircleX onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 w-full h-full">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <div className="flex gap-4 items-start">
                    <div className="w-1/2">
                        <Label htmlFor="date">Date</Label>
                        <TextInput
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <Label htmlFor="libelle">Libellé</Label>
                        <TextInput
                            id="libelle"
                            type="text"
                            name="libelle"
                            value={formData.libelle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="w-1/2">
                        <Label htmlFor="debit">Débit</Label>
                        <TextInput
                            id="debit"
                            type="number"
                            name="debit"
                            value={formData.debit}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <Label htmlFor="credit">Crédit</Label>
                        <TextInput
                            id="credit"
                            type="number"
                            name="credit"
                            value={formData.credit}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <Label htmlFor="projetId">Projet</Label>
                    <Select
                        id="projetId"
                        name="projetId"
                        value={formData.projetId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionnez un projet</option>
                        {projets.map((projet) => (
                            <option key={projet.id} value={projet.id}>
                                {projet.nom_projet}
                            </option>
                        ))}
                    </Select>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        'Envoyer'
                    )}
                </Button>
            </form>
        </Modal>
    );
}