import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getStates } from '../services/travelService';
import StateCard from '../components/StateCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast', 'Union Territory'];

export default function StatesPage() {
  const [states,    setStates]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [region,    setRegion]    = useState('All');
  const [search,    setSearch]    = useState('');
  useDocumentTitle('Explore Indian States');

  useEffect(() => {
    setLoading(true);
    const params = region !== 'All' ? { region } : {};
    getStates(params)
      .then(r => setStates(r.data.data))
      .finally(() => setLoading(false));
  }, [region]);

  const filtered = states.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title text-4xl md:text-5xl">Explore Indian States</h1>
          <p className="section-subtitle mt-3">
            Navigate through all 28 states and 8 union territories of India
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search state..." className="input pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  region === r
                    ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-white/40 text-sm mb-6">
          Showing {filtered.length} state{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="text-xl">No states found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(s => <StateCard key={s._id} state={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
