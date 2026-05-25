import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Compass, Star } from 'lucide-react';
import { getStates, getPlaces } from '../services/travelService';
import StateCard from '../components/StateCard';
import PlaceCard from '../components/PlaceCard';
import { GridSkeleton } from '../components/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

const CATEGORIES = [
  { name: 'Heritage', icon: '🏛️', color: 'from-yellow-500/20 to-yellow-600/10' },
  { name: 'Nature',   icon: '🌿', color: 'from-green-500/20 to-green-600/10' },
  { name: 'Religious',icon: '🕌', color: 'from-orange-500/20 to-orange-600/10' },
  { name: 'Adventure',icon: '🏔️', color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'Beach',    icon: '🏖️', color: 'from-cyan-500/20 to-cyan-600/10' },
  { name: 'Wildlife', icon: '🐯', color: 'from-amber-500/20 to-amber-600/10' },
];

const STATS = [
  { label: 'Indian States', value: '28+', icon: '🗺️' },
  { label: 'Tourist Places', value: '500+', icon: '📍' },
  { label: 'Categories',    value: '8',    icon: '🏷️' },
  { label: 'Hidden Gems',   value: '100+', icon: '💎' },
];

export default function HomePage() {
  const [states,        setStates]        = useState([]);
  const [featuredPlaces,setFeaturedPlaces]= useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [searchVal,     setSearchVal]     = useState('');
  const navigate = useNavigate();
  useDocumentTitle('');

  useEffect(() => {
    getStates().then(r => setStates(r.data.data.slice(0, 6))).finally(() => setLoadingStates(false));
    getPlaces({ featured: 'true', limit: 6 }).then(r => setFeaturedPlaces(r.data.data)).finally(() => setLoadingPlaces(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/places?search=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-saffron-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-india-green/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
                          bg-saffron-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative page-container pt-28 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-saffron-500/10 border border-saffron-500/30
              rounded-full px-4 py-2 mb-6 text-saffron-400 text-sm font-medium animate-fadeIn">
            <Compass className="w-4 h-4" />
            Explore India – State by State
          </div>

          <h1 className="text-5xl md:text-7xl font-poppins font-bold leading-tight mb-6 animate-fadeInUp">
            Discover the Soul<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-600">
              of Incredible India
            </span>
          </h1>

          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-10 animate-fadeInUp"
             style={{ animationDelay: '0.15s', opacity: 0 }}>
            Your complete travel encyclopedia — every state, every city, every hidden gem.
            From ancient temples to Himalayan peaks.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8 animate-fadeInUp"
            style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search places, states, categories..."
                className="input pl-12 h-14 text-base" />
            </div>
            <button type="submit" className="btn-primary h-14 px-8 text-base whitespace-nowrap">
              Search
            </button>
          </form>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto animate-fadeInUp"
               style={{ animationDelay: '0.45s', opacity: 0 }}>
            {STATS.map(({ label, value, icon }) => (
              <div key={label} className="glass p-4 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-poppins font-bold text-2xl text-saffron-400">{value}</div>
                <div className="text-white/50 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#12263A" />
          </svg>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-navy-800 py-16">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Choose your travel style</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, icon, color }) => (
              <Link key={name} to={`/places?category=${name}`}
                className={`group glass bg-gradient-to-br ${color} p-5 text-center
                   rounded-2xl hover:border-saffron-500/50 hover:-translate-y-1
                   transition-all duration-300 cursor-pointer`}>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
                <div className="font-semibold text-sm text-white/80 group-hover:text-saffron-400 transition-colors">{name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Places ── */}
      <section className="py-20">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Destinations</h2>
              <p className="section-subtitle">Hand-picked highlights of India</p>
            </div>
            <Link to="/places?featured=true" className="btn-outline hidden md:flex">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loadingPlaces ? <GridSkeleton count={6} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlaces.map(p => <PlaceCard key={p._id} place={p} />)}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link to="/places" className="btn-primary">Explore All Places</Link>
          </div>
        </div>
      </section>

      {/* ── States ── */}
      <section className="py-20 bg-navy-800">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Explore by State</h2>
              <p className="section-subtitle">Every corner of India awaits</p>
            </div>
            <Link to="/states" className="btn-outline hidden md:flex">
              All States <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loadingStates ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {states.map(s => <StateCard key={s._id} state={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="page-container">
          <div className="glass bg-gradient-to-br from-saffron-500/10 to-navy-700/50 rounded-3xl p-12 text-center">
            <Star className="w-12 h-12 text-saffron-500 mx-auto mb-4" />
            <h2 className="section-title mb-3">Plan Your Next Adventure</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
              Explore thousands of destinations across all 28 states of India. Find your perfect journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/places" className="btn-primary">Browse All Places</Link>
              <Link to="/states" className="btn-outline">View All States</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
