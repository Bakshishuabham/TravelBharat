import { Link } from 'react-router-dom';
import { MapPin, Mail, Globe, Heart, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/10 mt-20">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-saffron-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-poppins font-bold text-xl">
                Travel<span className="text-saffron-500">Bharat</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Your digital encyclopedia of India's tourism — exploring every state,
              city, and hidden gem across the subcontinent.
            </p>
            <div className="flex gap-3 mt-5">
              {[Globe, Heart, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-saffron-500
                   rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/50 hover:text-saffron-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/states" className="text-white/50 hover:text-saffron-400 text-sm transition-colors">All States</Link></li>
              <li><Link to="/places" className="text-white/50 hover:text-saffron-400 text-sm transition-colors">All Places</Link></li>
              <li><Link to="/places?featured=true" className="text-white/50 hover:text-saffron-400 text-sm transition-colors">Featured</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">Contact</h4>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Mail className="w-4 h-4 text-saffron-500" />
              <span>hello@travelbharat.in</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row
            justify-between items-center gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} TravelBharat. All rights reserved.</p>
          <p>Made with ❤️ for India</p>
        </div>
      </div>
    </footer>
  );
}
