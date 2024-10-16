'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StockData {
  designation: string;
  stockDisponible: number;
}

export default function StockChart() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const res = await fetch('/api/stock');
      if (res.ok) {
        const data = await res.json();
        console.log('Données de stock récupérées:', data); // Ajoutez ce log
        setStockData(data);
        setTotalStock(data.reduce((acc: number, item: StockData) => acc + item.stockDisponible, 0));
      } else {
        console.error('Erreur lors de la récupération des données de stock:', res.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de stock:', error);
    }
  };

  const colors = [
    'rgba(59, 130, 246, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(231, 74, 59, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ];

  const borderColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(231, 74, 59, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  const chartData = {
    labels: stockData.map(item => item.designation),
    datasets: [
      {
        label: 'Stock restant',
        data: stockData.map(item => item.stockDisponible),
        backgroundColor: stockData.map((_, index) => colors[index % colors.length]),
        borderColor: stockData.map((_, index) => borderColors[index % borderColors.length]),
        borderWidth: 1,
        barThickness: 30, // Augmentez la taille des barres
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permet de contrôler la hauteur du conteneur
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center me-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">{totalStock}</h5>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Stock total</p>
          </div>
        </div>
      </div>

      <div id="column-chart" className="py-6" style={{ height: '300px' }}> {/* Ajustez la hauteur ici */}
        {stockData.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  );
}