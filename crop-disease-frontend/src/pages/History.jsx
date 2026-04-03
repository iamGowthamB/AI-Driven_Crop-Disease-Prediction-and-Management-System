import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { ScanLine, CheckCircle2, Filter, Leaf, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEVERITY_BADGE = { Severe: 'badge-red', Moderate: 'badge-amber', Mild: 'badge-emerald', Healthy: 'badge-emerald' };
const SEVERITY_OPTIONS = ['All', 'Severe', 'Moderate', 'Mild', 'Healthy'];
const CROP_OPTIONS = ['All', 'Tomato', 'Potato', 'Pepper'];

export default function History() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [severity, setSeverity] = useState('All');
    const [crop, setCrop] = useState('All');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        api.get('/predictions/history').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const filtered = data.filter(d => {
        const matchS = severity === 'All' || d.severity === severity;
        const matchC = crop === 'All' || d.cropType === crop;
        return matchS && matchC;
    });

    return (
        <div className="min-h-full bg-stone-50 text-stone-900 pb-20 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-400/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-14 pt-8 relative z-10">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Prediction Timeline</p>
                        <h1 className="font-display font-black text-4xl text-stone-900 tracking-tight">Diagnostic History</h1>
                        <p className="text-sm text-stone-500 font-medium mt-2">{data.length} total records • showing {filtered.length} results</p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex gap-4 items-center flex-wrap bg-white p-2 rounded-2xl border border-stone-200 shadow-sm">
                        <div className="flex items-center gap-2 pl-2 border-r border-stone-100 pr-4">
                            <Filter size={16} className="text-stone-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Filters</span>
                        </div>
                        <div className="flex gap-1">
                            {SEVERITY_OPTIONS.map(s => (
                                <button key={s} onClick={() => setSeverity(s)} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${severity === s ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 border border-transparent'}`}>{s}</button>
                            ))}
                        </div>
                        <div className="w-px h-6 bg-stone-200 hidden sm:block" />
                        <div className="flex gap-1">
                            {CROP_OPTIONS.map(c => (
                                <button key={c} onClick={() => setCrop(c)} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${crop === c ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 border border-transparent'}`}>{c}</button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LIST PANEL */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7 space-y-3">
                        {loading ? (
                            <div className="py-32 flex justify-center"><div className="spinner" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl text-center py-32 flex flex-col items-center">
                                <HistoryIcon size={48} className="text-stone-300 mb-4" strokeWidth={1.5} />
                                <p className="text-sm font-bold text-stone-500">No diagnostic records match your active filters.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((item, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        key={item.id} onClick={() => setSelected(item)}
                                        className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${selected?.id === item.id ? 'border-emerald-300 bg-white shadow-lg shadow-emerald-500/10' : 'border-stone-200 bg-stone-50 hover:bg-white hover:border-stone-300 hover:shadow-md'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-colors ${selected?.id === item.id ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-stone-200 text-stone-400 group-hover:text-emerald-500'}`}>
                                            <Leaf size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold text-lg leading-tight truncate transition-colors ${selected?.id === item.id ? 'text-emerald-700' : 'text-stone-900 group-hover:text-emerald-600'}`}>{item.diseaseName}</p>
                                            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1">{item.cropType} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${SEVERITY_BADGE[item.severity] || 'badge-grey'}`}>{item.severity}</span>
                                            <span className="text-[10px] font-mono text-stone-400 font-bold">CONF: {(item.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* DETAILS PANEL */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-8">
                            <AnimatePresence mode="wait">
                                {selected ? (
                                    <motion.div key={selected.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white border border-stone-200 shadow-2xl shadow-stone-200/50 rounded-3xl p-8">
                                        <div className="mb-8">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Selected Diagnostic</p>
                                            <h2 className="font-display font-black text-3xl text-stone-900 leading-tight mb-3">{selected.diseaseName}</h2>
                                            <div className="flex items-center gap-2">
                                                <span className="badge badge-grey bg-stone-100 border-stone-200">{selected.cropType}</span>
                                                <span className={`badge ${SEVERITY_BADGE[selected.severity] || 'badge-grey'}`}>{selected.severity} Risk</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Confidence */}
                                            <div>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">AI Confidence</span>
                                                    <span className="text-xl font-bold font-mono text-stone-900">{(selected.confidence * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${selected.confidence * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-emerald-500" />
                                                </div>
                                            </div>

                                            {/* Meta */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Date Scanned</p>
                                                    <p className="text-sm font-bold text-stone-900">{new Date(selected.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[10px] font-mono text-stone-500 mt-0.5">{new Date(selected.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                                <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Assessed Severity</p>
                                                    <p className={`text-base font-bold ${selected.severity === 'Severe' ? 'text-red-600' : selected.severity === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'}`}>{selected.severity}</p>
                                                </div>
                                            </div>

                                            {/* Treatment */}
                                            {selected.treatment && (
                                                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl relative overflow-hidden">
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <CheckCircle2 size={14} /> Prescribed Treatment
                                                    </p>
                                                    <p className="text-sm text-stone-700 font-medium leading-relaxed">{selected.treatment}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-[500px] border-2 border-dashed border-stone-200 bg-white/50 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-20 h-20 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-300 mb-6">
                                            <ScanLine size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-stone-900 mb-2">No Selection</h3>
                                        <p className="text-sm font-medium text-stone-400">Select a diagnostic scan from the timeline to view detailed pathology reports and treatments.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
