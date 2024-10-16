'use client';

import { useState } from 'react';
import fileDownload from 'js-file-download';

interface StockItem {
  // Define the properties of a stock item here
  id: number;
  name: string;
  quantity: number;
  price: number;
  // Add any other relevant properties
}

interface ExportButtonProps {
  stockData: StockItem[];
}

export default function ExportButton({ stockData }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'exportation');
      }

      const blob = await response.blob();
      fileDownload(blob, 'stock_data.xlsx');
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
    >
      {isExporting ? 'Exportation...' : 'Exporter en Excel'}
    </button>
  );
}
