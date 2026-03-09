import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { Plus, Edit2, Trash2, Database, X, Loader2, CheckCircle2 } from 'lucide-react';

const EMPTY = { cropName: 'Tomato', diseaseName: '', pesticide: '', organicSolution: '', prevention: '' };

export default function AdminKnowledge() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const load = () => {
        api.get('/admin/knowledge').then(r => setData(r.data)).catch(() => setData([])).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editId) { await api.put(`/admin/knowledge/${editId}`, form); }
            else { await api.post('/admin/knowledge', form); }
            setSaved(true); setShowForm(false); setEditId(null); setForm(EMPTY);
            setTimeout(() => setSaved(false), 2000);
            load();
        } catch { alert('Operation failed. Check permissions.'); }
        finally { setSaving(false); }
    };

    const remove = async (id) => {
        if (!confirm('Delete this disease record?')) return;
        await api.delete(`/admin/knowledge/${id}`).catch(() => { });
        load();
    };

    const edit = (item) => { setForm({ cropName: item.cropName, diseaseName: item.diseaseName, pesticide: item.pesticide, organicSolution: item.organicSolution, prevention: item.prevention }); setEditId(item.id); setShowForm(true); };

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6 flex items-end justify-between">
                <div>
                    <p className="label-console mb-2">Admin · Content Management</p>
                    <h1 className="h1-console">Knowledge Database</h1>
                    <p className="text-sm text-agri-text/50 font-sans mt-1">{data.length} disease protocols registered.</p>
                </div>
                <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }} className="btn-primary"><Plus size={15} /> Add Disease</button>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><div className="spinner" /></div>
            ) : data.length === 0 ? (
                <div className="console-card-dark border-dashed text-center py-20">
                    <Database size={36} className="text-agri-text/20 mx-auto mb-3" />
                    <p className="text-sm text-agri-text/50 font-sans">No disease records yet. Add the first one.</p>
                </div>
            ) : (
                <div className="overflow-hidden console-card p-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                {['Crop', 'Disease', 'Pesticide Protocol', 'Organic Solution', 'Actions'].map(h => (
                                    <th key={h} className="table-header">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-agri-dark/50 transition-colors">
                                    <td className="table-cell"><span className="badge badge-green font-mono">{item.cropName}</span></td>
                                    <td className="table-cell font-semibold text-white">{item.diseaseName}</td>
                                    <td className="table-cell text-agri-text/70 max-w-[180px] truncate">{item.pesticide}</td>
                                    <td className="table-cell text-agri-text/70 max-w-[180px] truncate">{item.organicSolution}</td>
                                    <td className="table-cell">
                                        <div className="flex gap-2">
                                            <button onClick={() => edit(item)} className="w-8 h-8 flex items-center justify-center border border-agri-border rounded-sm text-agri-text/50 hover:text-agri-green hover:border-agri-green transition-colors"><Edit2 size={13} /></button>
                                            <button onClick={() => remove(item.id)} className="w-8 h-8 flex items-center justify-center border border-agri-border rounded-sm text-agri-text/50 hover:text-agri-red hover:border-agri-red transition-colors"><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-agri-dark/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative w-full max-w-xl console-card shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-agri-border mb-5">
                            <h2 className="h2-console text-xl">{editId ? 'Edit Disease Protocol' : 'Add Disease Protocol'}</h2>
                            <button onClick={() => setShowForm(false)}><X size={18} className="text-agri-text/40 hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="label-console">Crop</label>
                                    <select value={form.cropName} onChange={e => setForm({ ...form, cropName: e.target.value })} className="input-field">
                                        <option>Tomato</option><option>Potato</option><option>Pepper</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="label-console">Disease Name *</label>
                                    <input required value={form.diseaseName} onChange={e => setForm({ ...form, diseaseName: e.target.value })} className="input-field" placeholder="e.g. Late Blight" />
                                </div>
                            </div>
                            <div className="space-y-1.5"><label className="label-console">Pesticide Protocol</label><input value={form.pesticide} onChange={e => setForm({ ...form, pesticide: e.target.value })} className="input-field" placeholder="Chemical treatment details" /></div>
                            <div className="space-y-1.5"><label className="label-console">Organic Solution</label><input value={form.organicSolution} onChange={e => setForm({ ...form, organicSolution: e.target.value })} className="input-field" placeholder="Organic/bio treatment" /></div>
                            <div className="space-y-1.5"><label className="label-console">Prevention Guidelines</label><textarea rows={2} value={form.prevention} onChange={e => setForm({ ...form, prevention: e.target.value })} className="input-field h-16 resize-none" placeholder="Cultural and preventive practices..." /></div>
                            <div className="flex gap-3 pt-2 border-t border-agri-border">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                                    {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <><CheckCircle2 size={15} /> Saved</> : 'Commit Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
