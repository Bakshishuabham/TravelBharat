import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, MapPin, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const { user, logout, isAdmin }   = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/places?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/',        label: 'Home' },
    { to: '/states',  label: 'States' },
    { to: '/places',  label: 'Explore' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-saffron-500 rounded-xl flex items-center justify-center
                            group-hover:bg-saffron-400 transition-colors">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-poppins font-bold text-xl">
              Travel<span className="text-saffron-500">Bharat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === to
                    ? 'text-saffron-500 bg-saffron-500/10'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Search + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search places..."
                className="bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm
                           text-white placeholder-white/40 focus:outline-none focus:border-saffron-500 w-48"
              />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-white/40" />
            </form>
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="btn-ghost text-sm">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button onClick={logout} className="btn-ghost text-sm">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="btn-primary text-sm py-2 px-4">Sign In</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-navy-800 border-t border-white/10 py-4 space-y-2 animate-fadeIn">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-white/80 hover:text-saffron-500 transition-colors">
                {label}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="px-4 pt-2">
              <input type="text" value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search places..."
                className="input text-sm"
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
