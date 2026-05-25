import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function StateCard({ state }) {
  const image = state.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800';
  return (
    <Link to={`/states/${state._id}`}
      className="group relative overflow-hidden rounded-2xl h-48 block
                 border border-white/10 hover:border-saffron-500/50
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-saffron-500/10">
      <img src={image} alt={state.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-poppins font-bold text-white text-lg leading-tight">{state.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-saffron-400" />
          <span className="text-white/60 text-xs">{state.region} India</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="bg-saffron-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">Explore →</span>
      </div>
    </Link>
  );
}
