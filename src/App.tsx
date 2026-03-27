import { useState, useEffect } from 'react';
import { KPICards } from './components/KPICards';
import { DataTable } from './components/DataTable';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = import.meta.env.VITE_API_URL;
        if (!url) {
          throw new Error('VITE_API_URL is not defined in environment variables');
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-brand-navy p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-panel-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-brand-orange/20 p-2 rounded-lg">
                <ShieldCheck className="h-8 w-8 text-brand-orange" />
              </div>
              <h1 className="text-3xl font-bold text-white transform transition-all duration-300 hover:scale-105 origin-left">
                Durugörü AI
              </h1>
            </div>
            <p className="text-brand-silver text-sm">
              Executive Infrastructure Dashboard &bull; AI-Powered Anomaly Detection
            </p>
          </div>

        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand-silver">
              <Loader2 className="h-10 w-10 animate-spin text-brand-cyan mb-4" />
              <p>Loading infrastructure data...</p>
            </div>
          ) : error ? (
            <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-6 flex items-start gap-4 mb-6">
              <AlertCircle className="h-6 w-6 text-brand-orange flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-brand-orange mb-1">Error Loading Data</h3>
                <p className="text-brand-silver text-sm">{error}</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-brand-silver bg-panel-bg border border-panel-border rounded-lg shadow-xl">
              <p>No data available. Please check the API configuration.</p>
            </div>
          ) : (
            <>
              <section aria-label="Key Performance Indicators">
                <KPICards data={data} />
              </section>

              <section aria-label="Server Audit Data">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white">Infrastructure Overview</h2>
                  <p className="text-sm text-brand-silver">Click on any server row to view the full AI Evidence Trail.</p>
                </div>
                <DataTable data={data} />
              </section>
            </>
          )}
        </main>

        <footer className="pt-8 pb-4 text-center text-xs text-brand-slate">
          <p>&copy; 2026 Durugörü AI Platform. Confidential & Proprietary.</p>
        </footer>

      </div>
    </div>
  );
}

export default App;
