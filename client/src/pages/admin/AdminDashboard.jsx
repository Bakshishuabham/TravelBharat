import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, Building2, Tag, Globe, TrendingUp, LogOut } from 'lucide-react';
import { getAdminStats } from '../../services/travelService';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/Spinner';

const NAV_ITEMS = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/places',     icon: MapPin,          label: 'Places' },
  { to: '/admin/states',     icon: Globe,           label: 'States' },
  { to: '/admin/cities',     icon: Building2,       label: 'Cities' },
  { to: '/admin/categories', icon: Tag,             label: 'Categories' },
];

export function AdminLayout({ children, active }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex bg-navy-900">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-saffron-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-bold text-white">TravelBharat</span>
          </div>
          <p className="text-white/40 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === label
                  ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-2 mb-2">
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-white/40 text-xs">{user?.email}</p>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-red-400 text-sm w-full rounded-xl hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(r => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total States',  value: stats.totalStates,   icon: '🗺️',  color: 'from-blue-500/20 to-blue-600/10' },
    { label: 'Total Cities',  value: stats.totalCities,   icon: '🏙️',  color: 'from-purple-500/20 to-purple-600/10' },
    { label: 'Total Places',  value: stats.totalPlaces,   icon: '📍',  color: 'from-saffron-500/20 to-saffron-600/10' },
    { label: 'Featured',      value: stats.featuredPlaces,icon: '⭐',  color: 'from-yellow-500/20 to-yellow-600/10' },
  ] : [];

  return (
    <AdminLayout active="Dashboard">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-white">Dashboard</h1>
          <p className="text-white/50 mt-1">Overview of TravelBharat content</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {STAT_CARDS.map(({ label, value, icon, color }) => (
                <div key={label} className={`glass bg-gradient-to-br ${color} p-5 rounded-2xl`}>
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-3xl font-poppins font-bold text-white">{value}</div>
                  <div className="text-white/50 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category breakdown */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-poppins font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-saffron-500" /> Places by Category
                </h3>
                <div className="space-y-3">
                  {stats.categoryBreakdown?.map(({ _id, count }) => {
                    const pct = Math.round((count / (stats.totalPlaces || 1)) * 100);
                    return (
                      <div key={_id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">{_id}</span>
                          <span className="text-saffron-400 font-semibold">{count}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-saffron-500 rounded-full transition-all duration-700"
                               style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent places */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-poppins font-semibold text-white mb-4">Recent Places</h3>
                <div className="space-y-3">
                  {stats.recentPlaces?.map(p => (
                    <div key={p._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <MapPin className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <p className="text-white/40 text-xs">{p.cityId?.name}, {p.stateId?.name}</p>
                      </div>
                      <span className="text-xs text-saffron-400 ml-auto flex-shrink-0">{p.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { to: '/admin/places',     label: 'Manage Places',     icon: '📍' },
                { to: '/admin/states',     label: 'Manage States',     icon: '🗺️' },
                { to: '/admin/cities',     label: 'Manage Cities',     icon: '🏙️' },
                { to: '/admin/categories', label: 'Manage Categories', icon: '🏷️' },
              ].map(({ to, label, icon }) => (
                <Link key={to} to={to} className="glass p-4 rounded-xl text-center hover:border-saffron-500/50 transition-all hover:-translate-y-0.5">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-white/70 text-sm">{label}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
