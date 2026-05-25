import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Ticket, Navigation, ChevronRight, Star, Info } from 'lucide-react';
import { getPlace, getPlaces } from '../services/travelService';
import PlaceCard from '../components/PlaceCard';
import { PageLoader } from '../components/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BADGE_MAP = {
  Heritage:'badge-heritage', Nature:'badge-nature', Religious:'badge-religious',
  Adventure:'badge-adventure', Beach:'badge-beach', 'Hill Station':'badge-hill-station',
  Wildlife:'badge-wildlife', Cultural:'badge-cultural',
};

export default function PlaceDetailPage() {
  const { id } = useParams();
  const [place,   setPlace]   = useState(null);
  const [related, setRelated] = useState([]);
  const [selImg,  setSelImg]  = useState(0);
  const [loading, setLoading] = useState(true);
  useDocumentTitle(place ? place.name : '');

  useEffect(() => {
    setLoading(true);
    getPlace(id)
      .then(r => {
        setPlace(r.data.data);
        setSelImg(0);
        return getPlaces({ category: r.data.data.category, limit: 3 });
      })
      .then(r => setRelated(r.data.data.filter(p => p._id !== id)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!place)  return <div className="min-h-screen flex items-center justify-center text-white/50">Place not found</div>;

  const images = place.images?.length > 0 ? place.images : ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'];
  const badge  = BADGE_MAP[place.category] || 'badge-heritage';

  const INFO_ITEMS = [
    { icon: Clock,   label: 'Best Time to Visit', value: place.bestTimeToVisit },
    { icon: Ticket,  label: 'Entry Fee',           value: place.entryFee || 'Free' },
    { icon: Info,    label: 'Timings',             value: place.timings || 'Open all days' },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="pt-20 pb-4 page-container">
        <nav className="flex items-center gap-2 text-white/40 text-sm mt-4">
          <Link to="/" className="hover:text-saffron-400">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/places" className="hover:text-saffron-400">Places</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{place.name}</span>
        </nav>
      </div>

      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left col */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden mb-4 aspect-video bg-navy-800">
              <img src={images[selImg]} alt={place.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selImg ? 'border-saffron-500' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title */}
            <div className="mt-6">
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <span className={`badge ${badge}`}>{place.category}</span>
                {place.isFeatured && <span className="badge bg-saffron-500/20 text-saffron-400 border-saffron-500/30">⭐ Featured</span>}
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-white">{place.rating?.toFixed(1)}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">{place.name}</h1>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-saffron-500" />
                <Link to={`/states/${place.stateId?._id}`} className="hover:text-saffron-400">
                  {place.cityId?.name}, {place.stateId?.name}
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-poppins font-semibold text-white text-xl mb-3">About</h2>
              <p className="text-white/70 leading-relaxed">{place.description}</p>
            </div>

            {/* Historical significance */}
            {place.historicalSignificance && (
              <div className="mt-6 p-5 glass border-l-4 border-saffron-500">
                <h3 className="font-semibold text-saffron-400 mb-2">Historical Significance</h3>
                <p className="text-white/70 text-sm leading-relaxed">{place.historicalSignificance}</p>
              </div>
            )}

            {/* Nearby attractions */}
            {place.nearbyAttractions?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-poppins font-semibold text-white text-xl mb-4">Nearby Attractions</h2>
                <div className="flex flex-wrap gap-2">
                  {place.nearbyAttractions.map((attr, i) => (
                    <span key={i} className="px-4 py-2 bg-white/10 hover:bg-saffron-500/20
                        border border-white/20 hover:border-saffron-500/40 rounded-xl text-sm
                        text-white/70 hover:text-saffron-400 transition-all cursor-default">
                      📍 {attr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col – Info card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass p-6 rounded-2xl sticky top-24">
              <h3 className="font-poppins font-semibold text-white text-lg mb-5">Travel Info</h3>
              {INFO_ITEMS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 mb-4 pb-4 border-b border-white/10 last:border-0 last:mb-0 last:pb-0">
                  <div className="w-9 h-9 bg-saffron-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-saffron-500" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}

              {place.location && (
                <a href={place.location} target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full justify-center mt-4">
                  <Navigation className="w-4 h-4" />
                  View on Google Maps
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Related Places */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-6">More {place.category} Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.slice(0, 3).map(p => <PlaceCard key={p._id} place={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
