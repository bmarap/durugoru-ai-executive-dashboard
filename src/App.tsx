import { serverData } from './data';
import { KPICards } from './components/KPICards';
import { DataTable } from './components/DataTable';
import { ShieldCheck } from 'lucide-react';

function App() {
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
          <section aria-label="Key Performance Indicators">
            <KPICards data={serverData} />
          </section>

          <section aria-label="Server Audit Data">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Infrastructure Overview</h2>
              <p className="text-sm text-brand-silver">Click on any server row to view the full AI Evidence Trail.</p>
            </div>
            <DataTable data={serverData} />
          </section>
        </main>

        <footer className="pt-8 pb-4 text-center text-xs text-brand-slate">
          <p>&copy; 2026 Durugörü AI Platform. Confidential & Proprietary.</p>
        </footer>

      </div>
    </div>
  );
}

export default App;
