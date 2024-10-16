import StockChart from './components/StockChart';

export default function Dashboard() {
  return (
    <div className="container w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <StockChart />
    </div>
  );
}