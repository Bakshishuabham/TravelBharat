import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './AdminDashboard';
import { getPlaces, createPlace, updatePlace, deletePlace,
         getStates, getCities } from '../../services/travelService';
import { Spinner } from '../../components/Spinner';

const EMPTY = {
  name:'', stateId:'', cityId:'', category:'Heritage', description:'',
  historicalSignificance:'', bestTimeToVisit:'', entryFee:'', timings:'',
  nearbyAttractions:'', location:'', images:'', isFeatured: false, rating: 4.0,
};
const CATEGORIES = ['Heritage','Nature','Religious','Adventure','Beach','Hill Station','Wildlife','Cultural'];

export default function AdminPlaces() {
  const [places,  setPlaces]  = useState([]);
  const [states,  setStates]  = useState([]);
  const [cities,  setCities]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    getPlaces({ limit: 100 }).then(r => setPlaces(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    getStates().then(r => setStates(r.data.data));
  }, []);

  useEffect(() => {
    if (form.stateId) getCities({ stateId: form.stateId }).then(r => setCities(r.data.data));
    else setCities([]);
  }, [form.stateId]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      ...p,
      stateId: p.stateId?._id || p.stateId,
      cityId:  p.cityId?._id  || p.cityId,
      nearbyAttractions: (p.nearbyAttractions || []).join(', '),
      images: (p.images || []).join('\n'),
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        nearbyAttractions: form.nearbyAttractions.split(',').map(s => s.trim()).filter(Boolean),
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
        rating: parseFloat(form.rating),
      };
      if (editing) await updatePlace(editing, payload);
      else         await createPlace(payload);
      toast.success(editing ? 'Place updated!' : 'Place created!');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deletePlace(id);
      toast.success('Place deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout active="Places">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-white">Places</h1>
            <p className="text-white/50 mt-1">{places.length} places total</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Place
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Name','State / City','Category','Featured','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-white/50 text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {places.map(p => (
                  <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-white/50 text-sm">{p.cityId?.name}, {p.stateId?.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-lg text-white/70">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.isFeatured
                        ? <Check className="w-4 h-4 text-green-400" />
                        : <X className="w-4 h-4 text-white/20" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-poppins font-bold text-white text-xl">{editing ? 'Edit Place' : 'Add New Place'}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">Place Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">State *</label>
                  <select required value={form.stateId} onChange={e => setForm({...form, stateId: e.target.value, cityId: ''})} className="input">
                    <option value="">Select State</option>
                    {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">City *</label>
                  <select required value={form.cityId} onChange={e => setForm({...form, cityId: e.target.value})} className="input">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Best Time to Visit *</label>
                  <input required value={form.bestTimeToVisit} onChange={e => setForm({...form, bestTimeToVisit: e.target.value})} className="input" placeholder="e.g. October to March" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Entry Fee</label>
                  <input value={form.entryFee} onChange={e => setForm({...form, entryFee: e.target.value})} className="input" placeholder="e.g. ₹200 or Free" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Timings</label>
                  <input value={form.timings} onChange={e => setForm({...form, timings: e.target.value})} className="input" placeholder="e.g. 9AM–5PM" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">Historical Significance</label>
                  <textarea rows={2} value={form.historicalSignificance} onChange={e => setForm({...form, historicalSignificance: e.target.value})} className="input resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">Nearby Attractions (comma separated)</label>
                  <input value={form.nearbyAttractions} onChange={e => setForm({...form, nearbyAttractions: e.target.value})} className="input" placeholder="Place A, Place B, Place C" />
                </div>
                <div className="col-span-2">
                  <label className="text-white/60 text-xs mb-1 block">Image URLs (one per line)</label>
                  <textarea rows={3} value={form.images} onChange={e => setForm({...form, images: e.target.value})} className="input resize-none font-mono text-xs" placeholder="https://..." />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Google Maps URL</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input" placeholder="https://maps.google.com/..." />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className="input" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.isFeatured}
                    onChange={e => setForm({...form, isFeatured: e.target.checked})}
                    className="w-4 h-4 accent-saffron-500" />
                  <label htmlFor="featured" className="text-white/70 text-sm">Mark as Featured</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? <Spinner size="sm" /> : (editing ? 'Update Place' : 'Create Place')}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
