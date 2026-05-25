import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from './AdminDashboard';
import { getStates, createState, updateState, deleteState } from '../../services/travelService';
import { Spinner } from '../../components/Spinner';

const REGIONS = ['North','South','East','West','Central','Northeast','Union Territory'];
const EMPTY = { name:'', code:'', description:'', capital:'', region:'North', image:'' };

export default function AdminStates() {
  const [states,  setStates]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    getStates().then(r => setStates(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s) => { setEditing(s._id); setForm(s); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateState(editing, form);
      else         await createState(form);
      toast.success(editing ? 'State updated!' : 'State created!');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteState(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout active="States">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-poppins font-bold text-white">States</h1>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add State</button>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-white/10">
                {['Name','Code','Region','Capital','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white/50 text-sm font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {states.map(s => (
                  <tr key={s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-saffron-400 font-mono text-sm">{s.code}</td>
                    <td className="px-4 py-3 text-white/50 text-sm">{s.region}</td>
                    <td className="px-4 py-3 text-white/50 text-sm">{s.capital}</td>
                    <td className="px-4 py-3"><div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s._id, s.name)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-poppins font-bold text-white text-xl">{editing ? 'Edit State' : 'Add State'}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-white/60 text-xs mb-1 block">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" /></div>
                <div><label className="text-white/60 text-xs mb-1 block">Code * (e.g. RJ)</label>
                  <input required maxLength={4} value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="input" /></div>
                <div><label className="text-white/60 text-xs mb-1 block">Capital</label>
                  <input value={form.capital} onChange={e => setForm({...form, capital: e.target.value})} className="input" /></div>
                <div className="col-span-2"><label className="text-white/60 text-xs mb-1 block">Region *</label>
                  <select required value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="input">
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select></div>
                <div className="col-span-2"><label className="text-white/60 text-xs mb-1 block">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input resize-none" /></div>
                <div className="col-span-2"><label className="text-white/60 text-xs mb-1 block">Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? <Spinner size="sm" /> : (editing ? 'Update' : 'Create')}
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
