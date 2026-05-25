import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { getPlaces, getStates, getCities, getCategories } from '../services/travelService';
import PlaceCard from '../components/PlaceCard';
import Pagination from '../components/Pagination';
import { GridSkeleton } from '../components/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

const LIMIT = 9;

export default function PlacesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [places,      setPlaces]      = useState([]);
  const [states,      setStates]      = useState([]);
  const [cities,      setCities]      = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search   = searchParams.get('search')   || '';
  const state    = searchParams.get('state')    || '';
  const city     = searchParams.get('city')     || '';
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') || '';
  const page     = parseInt(searchParams.get('page') || '1');
  useDocumentTitle(search ? `Search: ${search}` : category ? `${category} Places` : 'Explore Tourist Places');

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  useEffect(() => {
    getStates().then(r => setStates(r.data.data));
    getCategories().then(r => setCategories(r.data.data));
  }, []);

  useEffect(() => {
    if (state) getCities({ stateId: state }).then(r => setCities(r.data.data));
    else setCities([]);
  }, [state]);

  const fetchPlaces = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search)   params.search   = search;
    if (state)    params.state    = state;
    if (city)     params.city     = city;
    if (category) params.category = category;
    if (featured) params.featured = featured;
    getPlaces(params).then(r => {
      setPlaces(r.data.data);
      setTotal(r.data.total);
      setTotalPages(r.data.totalPages);
    }).finally(() => setLoading(false));
  }, [search, state, city, category, featured, page]);

  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);

  const clearAll = () => setSearchParams({});
  const hasFilters = search || state || city || category || featured;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="section-title">
              {search ? `Results for "${search}"` : 'Explore Tourist Places'}
            </h1>
            <p className="text-white/50 mt-1">{total} places found</p>
          </div>
          <div className="flex gap-3">
            {hasFilters && (
              <button onClick={clearAll} className="btn-ghost text-sm">
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-outline text-sm py-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="glass p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">State</label>
              <select value={state} onChange={e => setParam('state', e.target.value)} className="input">
                <option value="">All States</option>
                {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">City</label>
              <select value={city} onChange={e => setParam('city', e.target.value)} className="input" disabled={!state}>
                <option value="">All Cities</option>
                {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Category</label>
              <select value={category} onChange={e => setParam('category', e.target.value)} className="input">
                <option value="">All Categories</option>
                {['Heritage','Nature','Religious','Adventure','Beach','Hill Station','Wildlife','Cultural'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Featured</label>
              <select value={featured} onChange={e => setParam('featured', e.target.value)} className="input">
                <option value="">All Places</option>
                <option value="true">Featured Only</option>
              </select>
            </div>
          </div>
        )}

        {loading ? <GridSkeleton count={9} /> : places.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl">No places found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map(p => <PlaceCard key={p._id} place={p} />)}
            </div>
            <Pagination page={page} totalPages={totalPages}
              onPageChange={p => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp); }} />
          </>
        )}
      </div>
    </div>
  );
}
