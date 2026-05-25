import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('Access restricted to admins only');
        return;
      }
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-saffron-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-saffron-500/30">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-poppins font-bold text-2xl text-white">TravelBharat Admin</h1>
          <p className="text-white/50 text-sm mt-1">Content Management System</p>
        </div>

        <div className="glass p-8 rounded-2xl">
          <div className="flex items-center gap-2 mb-6 p-3 bg-saffron-500/10 border border-saffron-500/30 rounded-xl">
            <Lock className="w-4 h-4 text-saffron-500" />
            <p className="text-saffron-400 text-sm">Default: admin@travelbharat.com / Admin@1234</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Email Address</label>
              <input type="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@travelbharat.com" className="input" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} required
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center h-12">
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
