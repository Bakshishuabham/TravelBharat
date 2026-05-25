import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const BADGE_MAP = {
  Heritage: 'badge-heritage', Nature: 'badge-nature', Religious: 'badge-religious',
  Adventure: 'badge-adventure', Beach: 'badge-beach', 'Hill Station': 'badge-hill-station',
  Wildlife: 'badge-wildlife', Cultural: 'badge-cultural',
};

export default function PlaceCard({ place }) {
  const image = place.images?.[0] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800';
  const badge = BADGE_MAP[place.category] || 'badge-heritage';

  return (
    <Link to={`/places/${place._id}`} className="card group block">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img src={image} alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'; }}
        />
        <div className="absolute inset-0 bg-card-gradient" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${badge}`}>{place.category}</span>
        </div>

        {/* Featured */}
        {place.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-saffron-500/90 text-white border-none">⭐ Featured</span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 rounded-lg px-2 py-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-white">{place.rating?.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-white text-lg leading-tight mb-1
                       group-hover:text-saffron-400 transition-colors line-clamp-1">
          {place.name}
        </h3>
        <div className="flex items-center gap-1.5 text-white/50 text-sm mb-2">
          <MapPin className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
          <span className="line-clamp-1">
            {place.cityId?.name}{place.stateId?.name ? `, ${place.stateId.name}` : ''}
          </span>
        </div>
        <p className="text-white/50 text-sm line-clamp-2">{place.description}</p>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/40">Best: {place.bestTimeToVisit}</span>
          <span className="text-saffron-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
