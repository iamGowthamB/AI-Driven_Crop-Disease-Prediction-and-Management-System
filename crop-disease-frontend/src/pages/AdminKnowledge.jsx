import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { Plus, Edit2, Trash2, Database, X, Loader2, CheckCircle2, Search, ChevronDown, Activity, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY = { cropType: 'Tomato', diseaseName: '', description: '', chemicalSolution: '', organicSolution: '', preventionTips: '' };

const CROP_TABS = ['All', 'Tomato', 'Potato', 'Pepper'];
const CROP_STYLE = {
    Tomato:  { badge: 'bg-red-50 text-red-700 border-red-200',    dot: 'bg-red-500' },
    Potato:  { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    Pepper:  { badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
};
const SEV_STYLE = {
    Severe:   'bg-red-50 text-red-700 border-red-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    Mild:     'bg-blue-50 text-blue-700 border-blue-200',
    Healthy:  'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const rowV = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

export default function AdminKnowledge() {
    // ── Disease DB state ────────────────────────────────────────────────────
    const [data, setData]         = useState([]);
    const [loading, setLoading]   = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId]     = useState(null);
    const [form, setForm]         = useState(EMPTY);
    const [saving, setSaving]     = useState(false);
    const [saved, setSaved]       = useState(false);
    const [search, setSearch]     = useState('');
    const [cropTab, setCropTab]   = useState('All');
    const [expanded, setExpanded] = useState(null);

    // ── User Detections state ────────────────────────────────────────────────
    const [mainTab, setMainTab]   = useState('db');       // 'db' | 'detections'
    const [detections, setDetections]   = useState([]);
    const [detLoading, setDetLoading]   = useState(false);
    const [detSearch, setDetSearch]     = useState('');
    const [detCrop, setDetCrop]         = useState('All');

    const load = () =>
        api.get('/admin/knowledge').then(r => setData(r.data)).catch(() => setData([])).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const loadDetections = () => {
        setDetLoading(true);
        api.get('/admin/predictions').then(r => setDetections(r.data)).catch(() => setDetections([])).finally(() => setDetLoading(false));
    };

    useEffect(() => { if (mainTab === 'detections' && detections.length === 0) loadDetections(); }, [mainTab]);

    const submit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editId) await api.put(`/admin/knowledge/${editId}`, form);
            else        await api.post('/admin/knowledge', form);
            setSaved(true); setShowForm(false); setEditId(null); setForm(EMPTY);
            setTimeout(() => setSaved(false), 2000); load();
        } catch { alert('Operation failed.'); }
        finally { setSaving(false); }
    };
    const remove = async (id) => { if (!confirm('Delete this record?')) return; await api.delete(`/admin/knowledge/${id}`).catch(() => {}); load(); };
    const edit = (item) => {
        setForm({ cropType: item.cropType, diseaseName: item.diseaseName, description: item.description || '', chemicalSolution: item.chemicalSolution || '', organicSolution: item.organicSolution || '', preventionTips: item.preventionTips || '' });
        setEditId(item.id); setShowForm(true);
    };

    const filtered = data
        .filter(d => cropTab === 'All' || d.cropType === cropTab)
        .filter(d => !search || d.diseaseName?.toLowerCase().includes(search.toLowerCase()) || d.cropType?.toLowerCase().includes(search.toLowerCase()));

    const filteredDet = detections
        .filter(d => detCrop === 'All' || d.cropType?.toLowerCase().includes(detCrop.toLowerCase()))
        .filter(d => !detSearch || d.diseaseName?.toLowerCase().includes(detSearch.toLowerCase()) || d.user?.fullName?.toLowerCase().includes(detSearch.toLowerCase()));

    const Field = ({ label, area, ...p }) => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">{label}</label>
            {area
                ? <textarea rows={3} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none" {...p} />
                : <input   className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" {...p} />
            }
        </div>
    );

    return (
        <div className="min-h-full bg-stone-50 pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-6 pt-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Admin · Knowledge Database</p>
                        <h1 className="font-display font-black text-4xl text-stone-900 tracking-tight">Disease Database</h1>
                        <p className="text-sm text-stone-500 font-medium mt-2">
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full mr-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> ML Model
                            </span>
                            {data.length} disease protocols · {detections.length > 0 ? `${detections.length} user detections` : 'Load detections to see stats'}
                        </p>
                    </div>
                    {mainTab === 'db' && (
                        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}
                            className="btn-primary shadow-lg shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap">
                            <Plus size={16} /> Add Disease
                        </button>
                    )}
                </motion.div>

                {/* Main Tabs: Disease DB vs User Detections */}
                <div className="flex gap-1 p-1 bg-stone-100 border border-stone-200 rounded-xl mb-6 w-fit">
                    <button onClick={() => setMainTab('db')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${mainTab === 'db' ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60' : 'text-stone-500 hover:text-stone-800'}`}>
                        <Database size={15} /> Disease Protocols
                    </button>
                    <button onClick={() => setMainTab('detections')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${mainTab === 'detections' ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60' : 'text-stone-500 hover:text-stone-800'}`}>
                        <Activity size={15} /> User Detections
                        {detections.length > 0 && <span className="ml-1 bg-emerald-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5">{detections.length}</span>}
                    </button>
                </div>

                {/* ══════════════════════ DISEASE DB TAB ══════════════════════ */}
                {mainTab === 'db' && (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                            <div className="flex gap-1 p-1 bg-stone-100 border border-stone-200 rounded-xl">
                                {CROP_TABS.map(tab => (
                                    <button key={tab} onClick={() => setCropTab(tab)}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${cropTab === tab ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60' : 'text-stone-500 hover:text-stone-800'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-1 max-w-xs">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search disease..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm" />
                            </div>
                        </div>

                        {loading ? (
                            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                                {[...Array(6)].map((_, i) => <div key={i} className="h-14 border-b border-stone-100 animate-pulse bg-stone-50/60 last:border-0" />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-stone-200 rounded-2xl py-20 text-center">
                                <Database size={36} className="text-stone-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-stone-500">No records found.</p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="grid grid-cols-[2fr_2fr_3fr_auto] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-100">
                                    {['Crop', 'Disease', 'Chemical Treatment', 'Actions'].map(h => (
                                        <p key={h} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{h}</p>
                                    ))}
                                </div>
                                <motion.div variants={container} initial="hidden" animate="visible">
                                    <AnimatePresence>
                                        {filtered.map((item) => {
                                            const style = CROP_STYLE[item.cropType] || { badge: 'bg-stone-50 text-stone-600 border-stone-200', dot: 'bg-stone-400' };
                                            const isOpen = expanded === item.id;
                                            return (
                                                <motion.div key={item.id} variants={rowV} exit={{ opacity: 0 }} className="border-b border-stone-100 last:border-0">
                                                    <div className="grid grid-cols-[2fr_2fr_3fr_auto] gap-4 items-center px-5 py-4 hover:bg-stone-50/70 transition-colors">
                                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold border rounded-full px-2.5 py-1 w-fit ${style.badge}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />{item.cropType}
                                                        </span>
                                                        <p className="text-sm font-bold text-stone-900">{item.diseaseName}</p>
                                                        <p className="text-xs text-stone-500 font-medium line-clamp-2">{item.chemicalSolution || '—'}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <button onClick={() => setExpanded(isOpen ? null : item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                                                                <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                                            </button>
                                                            <button onClick={() => edit(item)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"><Edit2 size={12} /></button>
                                                            <button onClick={() => remove(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"><Trash2 size={12} /></button>
                                                        </div>
                                                    </div>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                                className="overflow-hidden border-t border-emerald-50 bg-emerald-50/30">
                                                                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    {[['📋 Description', item.description], ['🌿 Organic Solution', item.organicSolution], ['🛡️ Prevention Tips', item.preventionTips]].map(([label, val]) => (
                                                                        <div key={label}>
                                                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
                                                                            <p className="text-xs text-stone-700 font-medium leading-relaxed">{val || '—'}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        )}
                    </>
                )}

                {/* ══════════════════════ USER DETECTIONS TAB ══════════════════════ */}
                {mainTab === 'detections' && (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                            <div className="flex gap-1 p-1 bg-stone-100 border border-stone-200 rounded-xl">
                                {CROP_TABS.map(tab => (
                                    <button key={tab} onClick={() => setDetCrop(tab)}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${detCrop === tab ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60' : 'text-stone-500 hover:text-stone-800'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-1 max-w-xs">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input value={detSearch} onChange={e => setDetSearch(e.target.value)} placeholder="Search disease or user..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm" />
                            </div>
                        </div>

                        {detLoading ? (
                            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-14 border-b border-stone-100 animate-pulse bg-stone-50/60 last:border-0" />)}
                            </div>
                        ) : filteredDet.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-stone-200 rounded-2xl py-20 text-center">
                                <Activity size={36} className="text-stone-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-stone-500">No user detections yet.</p>
                                <p className="text-xs text-stone-400 mt-1">Detections will appear here as users scan crops.</p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                                {/* Table header */}
                                <div className="grid grid-cols-[1.5fr_2fr_2fr_1fr_1fr_1.5fr] gap-3 px-5 py-3 bg-stone-50 border-b border-stone-100">
                                    {['Crop', 'Disease Detected', 'User', 'Confidence', 'Severity', 'Date'].map(h => (
                                        <p key={h} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{h}</p>
                                    ))}
                                </div>
                                <motion.div variants={container} initial="hidden" animate="visible">
                                    {filteredDet.slice().reverse().map((det, idx) => {
                                        const crop = det.cropType?.split('_')[0] || 'Unknown';
                                        const style = CROP_STYLE[crop] || { badge: 'bg-stone-50 text-stone-600 border-stone-200', dot: 'bg-stone-400' };
                                        const sevStyle = SEV_STYLE[det.severity] || 'bg-stone-50 text-stone-600 border-stone-200';
                                        return (
                                            <motion.div key={det.id} variants={rowV}
                                                className="grid grid-cols-[1.5fr_2fr_2fr_1fr_1fr_1.5fr] gap-3 items-center px-5 py-3.5 border-b border-stone-100 last:border-0 hover:bg-stone-50/70 transition-colors">
                                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold border rounded-full px-2.5 py-1 w-fit ${style.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />{crop}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-stone-900 truncate">{det.diseaseName?.replace(/_/g, ' ')}</p>
                                                </div>
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-black shrink-0`}>
                                                        {det.user?.fullName?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '??'}
                                                    </div>
                                                    <span className="text-sm font-medium text-stone-700 truncate">{det.user?.fullName || '—'}</span>
                                                </div>
                                                <span className="text-sm font-bold text-stone-700">{det.confidence ? `${(det.confidence * 100).toFixed(1)}%` : '—'}</span>
                                                <span className={`inline-flex items-center text-[10px] font-bold border rounded-full px-2 py-0.5 w-fit ${sevStyle}`}>{det.severity}</span>
                                                <span className="text-xs text-stone-500 font-medium">{det.createdAt ? new Date(det.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}</span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6 pb-5 border-b border-stone-100">
                                <h2 className="font-display font-black text-2xl text-stone-900">{editId ? 'Edit Protocol' : 'Add Disease Protocol'}</h2>
                                <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:bg-red-50 hover:text-red-500 transition-colors"><X size={16} /></button>
                            </div>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">Crop</label>
                                        <select value={form.cropType} onChange={e => setForm({ ...form, cropType: e.target.value })} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all">
                                            <option>Tomato</option><option>Potato</option><option>Pepper</option>
                                        </select>
                                    </div>
                                    <Field label="Disease Name *" required value={form.diseaseName} onChange={e => setForm({ ...form, diseaseName: e.target.value })} placeholder="e.g. Late Blight" />
                                </div>
                                <Field label="Description" area value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
                                <Field label="Chemical Solution" area value={form.chemicalSolution} onChange={e => setForm({ ...form, chemicalSolution: e.target.value })} placeholder="Pesticide / chemical treatment" />
                                <Field label="Organic Solution" area value={form.organicSolution} onChange={e => setForm({ ...form, organicSolution: e.target.value })} placeholder="Organic / bio treatment" />
                                <Field label="Prevention Tips" area value={form.preventionTips} onChange={e => setForm({ ...form, preventionTips: e.target.value })} placeholder="Cultural practices..." />
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center py-3">Cancel</button>
                                    <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3 shadow-lg shadow-emerald-500/20">
                                        {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <><CheckCircle2 size={15} /> Saved!</> : 'Commit Record'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
