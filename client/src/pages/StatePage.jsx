import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { getState, getCities, getPlaces } from '../services/travelService';
import PlaceCard from '../components/PlaceCard';
import { PageLoader, GridSkeleton } from '../components/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function StatePage() {
  const { id } = useParams();
  const [state,   setState]   = useState(null);
  const [cities,  setCities]  = useState([]);
  const [places,  setPlaces]  = useState([]);
  const [selCity, setSelCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(false);
  useDocumentTitle(state ? state.name : '');

  useEffect(() => {
    Promise.all([getState(id), getCities({ stateId: id })])
      .then(([sRes, cRes]) => {
        setState(sRes.data.data);
        setCities(cRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setPlacesLoading(true);
    const params = { state: id, limit: 20 };
    if (selCity) params.city = selCity;
    getPlaces(params)
      .then(r => setPlaces(r.data.data))
      .finally(() => setPlacesLoading(false));
  }, [id, selCity]);

  if (loading) return <PageLoader />;
  if (!state)  return <div className="min-h-screen flex items-center justify-center text-white/50">State not found</div>;

  return (
    <div className="min-h-screen pb-16">
      {/* Hero banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={state.image} alt={state.name}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-navy-900" />
        <div className="absolute inset-0 flex flex-col justify-end page-container pb-10">
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link to="/" className="hover:text-saffron-400">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/states" className="hover:text-saffron-400">States</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{state.name}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-poppins font-bold text-white">{state.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-white/60">
            <MapPin className="w-4 h-4 text-saffron-400" />
            <span>{state.region} India • Capital: {state.capital}</span>
          </div>
        </div>
      </div>

      <div className="page-container py-10">
        <p className="text-white/60 text-lg max-w-3xl mb-10">{state.description}</p>

        {/* City filter */}
        {cities.length > 0 && (
          <div className="mb-8">
            <h3 className="font-poppins font-semibold text-white mb-3">Filter by City</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelCity('')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !selCity ? 'bg-saffron-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                All Cities
              </button>
              {cities.map(c => (
                <button key={c._id} onClick={() => setSelCity(c._id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selCity === c._id ? 'bg-saffron-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-poppins font-bold text-white mb-6">
          Tourist Places {selCity ? `in ${cities.find(c => c._id === selCity)?.name || ''}` : `in ${state.name}`}
          <span className="text-saffron-500 ml-2">({places.length})</span>
        </h2>

        {placesLoading ? <GridSkeleton count={6} /> : places.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <p className="text-4xl mb-3">📍</p>
            <p>No places found. More coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map(p => <PlaceCard key={p._id} place={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
