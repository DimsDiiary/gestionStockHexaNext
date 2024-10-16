'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

interface EntresProps {
  onClose: () => void;
  onEntreAdded: () => void;
}

interface Achat {
  id: string;
  designation: string;
  nombre: number;
}

export default function Entres({ onClose, onEntreAdded }: EntresProps) {
  const [magasins, setMagasins] = useState<{ id: string, lieu_magasin: string }[]>([]);
  const [chantiers, setChantiers] = useState<{ id: string, lieu_chantier: string }[]>([]);
  const [achats, setAchats] = useState<Achat[]>([]);
  const [destination, setDestination] = useState<'magasin' | 'chantier' | ''>('');
  const [sourceType, setSourceType] = useState<'magasin' | 'chantier' | 'quincaillerie' | ''>('');
  const [destinationOptions, setDestinationOptions] = useState<{ id: string, label: string }[]>([]);
  const [sourceOptions, setSourceOptions] = useState<{ id: string, label: string }[]>([]);

  const [, setFetchError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EntreFormData>({
    resolver: zodResolver(entreSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      source: '',
      nombre: '',
      observation: '',
      chantierId: '',
      achatId: '',
      destination: '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      setFetchError(null);
      try {
        const [magasinsResponse, chantiersResponse, achatsResponse] = await Promise.all([
          fetch('/api/magasin'),
          fetch('/api/chantier'),
          fetch('/api/achat')
        ]);

        if (magasinsResponse.ok) {
          const magasinsData = await magasinsResponse.json();
          setMagasins(magasinsData);
        } else {
          console.warn('Erreur lors de la récupération des magasins');
          setMagasins([]);
        }

        if (chantiersResponse.ok) {
          const chantiersData = await chantiersResponse.json();
          setChantiers(chantiersData);
        } else {
          console.warn('Erreur lors de la récupération des chantiers');
          setChantiers([]);
        }

        if (achatsResponse.ok) {
          const achatsData = await achatsResponse.json();
          setAchats(achatsData);
        } else {
          console.warn('Erreur lors de la récupération des achats');
          setAchats([]);
        }
      } catch (error) {
        console.error('Erreur générale lors de la récupération des données:', error);
        setFetchError('Erreur lors de la récupération des données. Veuillez réessayer.');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let options: { id: string, label: string }[] = [];

    if (destination === 'magasin') {
      options = magasins.map(magasin => ({
        id: magasin.id,
        label: magasin.lieu_magasin
      }));
    } else if (destination === 'chantier') {
      options = chantiers.map(chantier => ({
        id: chantier.id,
        label: chantier.lieu_chantier
      }));
    }

    setDestinationOptions(options);
  }, [destination, magasins, chantiers]);

  useEffect(() => {
    let options: { id: string, label: string }[] = [];

    if (sourceType === 'magasin') {
      options = magasins.map(magasin => ({
        id: magasin.id,
        label: magasin.lieu_magasin
      }));
    } else if (sourceType === 'chantier') {
      options = chantiers.map(chantier => ({
        id: chantier.id,
        label: chantier.lieu_chantier
      }));
    } else if (sourceType === 'quincaillerie') {
      options = achats.map(achat => ({
        id: achat.id,
        label: achat.designation
      }));
    }

    setSourceOptions(options);
  }, [sourceType, magasins, chantiers, achats]);

  const onSubmit = async (data: EntreFormData) => {
    try {
      const achatDetails = achats.find(achat => achat.id === data.achatId);
      if (!achatDetails) {
        throw new Error('Détails de l\'achat non disponibles');
      }

      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        nombre: parseFloat(data.nombre),
        designation: achatDetails.designation,
        chantierId: data.chantierId || null,
      };

      console.log('Données à envoyer:', formattedData);

      const response = await fetch('/api/entre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) { 
        const result = await response.json();
        console.log('Entrée ajoutée avec succès:', result);
        onEntreAdded();
        onClose();
        reset();
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'ajout de l\'entrée:', errorData);
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Désignation:</label>
        <Controller
          name="achatId"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner une désignation</option>
              {achats.map((achat) => (
                <option key={achat.id} value={achat.id}>
                  {achat.designation}
                </option>
              ))}
            </select>
          )}
        />
        {errors.achatId && <p className="text-red-500 text-sm mt-1">{errors.achatId.message}</p>}
      </div>

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
        <label className="block text-sm font-medium text-gray-700">Destination:</label>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            checked={destination === 'magasin'}
            onChange={() => {
              setDestination('magasin');
              setValue('destination', '');
            }}
            className="mr-2"
          />
          <span>Magasin</span>
          <input
            type="radio"
            checked={destination === 'chantier'}
            onChange={() => {
              setDestination('chantier');
              setValue('destination', '');
            }}
            className="ml-4 mr-2"
          />
          <span>Chantier</span>
        </div>
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner une destination</option>
              {destinationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Source:</label>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            checked={sourceType === 'magasin'}
            onChange={() => {
              setSourceType('magasin');
              setValue('source', '');
            }}
            className="mr-2"
          />
          <span>Magasin</span>
          <input
            type="radio"
            checked={sourceType === 'chantier'}
            onChange={() => {
              setSourceType('chantier');
              setValue('source', '');
            }}
            className="ml-4 mr-2"
          />
          <span>Chantier</span>
          <input
            type="radio"
            checked={sourceType === 'quincaillerie'}
            onChange={() => {
              setSourceType('quincaillerie');
              setValue('source', '');
            }}
            className="ml-4 mr-2"
          />
          <span>Quincaillerie</span>
        </div>
        {sourceType === 'quincaillerie' ? (
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}
          />
        ) : (
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionner une option</option>
                {sourceOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            )}
          />
        )}
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

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}