import { useState, useEffect } from 'react';
import { KPICards } from './components/KPICards';
import { DataTable } from './components/DataTable';
import { Gauge, AlertCircle, Loader2 } from 'lucide-react';
import { FeedbackModal } from './components/FeedbackModal';
import type { FeedbackItem } from './types/feedback';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'postponed'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeServerForFeedback, setActiveServerForFeedback] = useState<string | null>(null);

  const API_URL = '/api/feedback';

  const fetchFeedback = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const json = await res.json();
        setFeedbackData(json);
      }
    } catch (err) {
      console.warn('Failed to fetch feedback data. Ensure API is running.', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
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
    fetchFeedback();
  }, []);

  const handleFeedbackSubmit = async (reason: string) => {
    if (!activeServerForFeedback) return;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ server_name: activeServerForFeedback, reason })
    });
    if (!res.ok) throw new Error('Failed to submit feedback API');
    await fetchFeedback();
  };

  const feedbackMap = feedbackData.reduce((acc, curr) => {
    acc[curr.server_name] = curr.reason;
    return acc;
  }, {} as Record<string, string>);

  const displayData = activeTab === 'overview' 
    ? data 
    : data.filter(d => feedbackMap[d.server_name]);

  const handleCardClick = (type: string) => {
    if (type === 'POSTPONED') {
        setActiveTab('postponed');
    } else {
        setActiveTab('overview');
        setFilterStatus(type === 'TOTAL' ? 'ALL' : type);
    }
    // Defer perfectly to allow React render cycle to catch up, then scroll dynamically to the table start
    setTimeout(() => {
        document.getElementById('data-table-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-brand-navy p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col pb-6 border-b border-panel-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-brand-orange/20 p-2 rounded-lg">
                  <Gauge className="h-8 w-8 text-brand-orange" />
                </div>
                <h1 className="text-3xl font-bold text-white transform transition-all duration-300 hover:scale-105 origin-left">
                  Durugörü Efficiency
                </h1>
              </div>
              <p className="text-brand-silver text-sm">
                Executive Infrastructure Dashboard &bull; AI-Powered Anomaly Detection
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 mt-2">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-brand-slate hover:text-brand-silver'}`}
            >
              Infrastructure Overview
            </button>
            <button 
              onClick={() => setActiveTab('postponed')} 
              className={`pb-2 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'postponed' ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-brand-slate hover:text-brand-silver'}`}
            >
              Postponed 
              {feedbackData.length > 0 && (
                <span className="bg-brand-cyan/20 text-brand-cyan py-0.5 px-2 rounded-full text-[10px]">
                  {feedbackData.length}
                </span>
              )}
            </button>
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
              {activeTab === 'overview' && (
                <section aria-label="Key Performance Indicators">
                  <KPICards data={data} postponedCount={feedbackData.length} onCardClick={handleCardClick} />
                </section>
              )}

              <section id="data-table-section" aria-label="Server Audit Data">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {activeTab === 'overview' ? 'Infrastructure Overview' : 'Postponed Servers'}
                  </h2>
                  <p className="text-sm text-brand-silver">
                    {activeTab === 'overview' 
                      ? 'Click on any server row to view the full AI Evidence Trail.' 
                      : 'These servers have been manually postponed by the operations team.'}
                  </p>
                </div>
                <DataTable 
                  data={displayData} 
                  feedbackMap={feedbackMap}
                  filterStatus={activeTab === 'postponed' ? 'ALL' : filterStatus}
                  onFilterChange={(status) => {
                      if (activeTab === 'postponed') setActiveTab('overview');
                      setFilterStatus(status);
                  }}
                  onMarkFalsePositive={(serverName) => {
                    setActiveServerForFeedback(serverName);
                    setIsFeedbackModalOpen(true);
                  }}
                />
              </section>
            </>
          )}
        </main>

        <footer className="pt-8 pb-4 text-center text-xs text-brand-slate">
          <p>&copy; 2026 Durugörü Efficiency Platform. Confidential & Proprietary.</p>
        </footer>

      </div>
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        serverName={activeServerForFeedback}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}

export default App;
