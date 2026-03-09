import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { ScanLine, AlertCircle, CheckCircle2, ChevronDown, Filter } from 'lucide-react';

const SEVERITY_BADGE = { Severe: 'badge-red', Moderate: 'badge-amber', Mild: 'badge-green', Healthy: 'badge-green' };
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
        <div className="space-y-8 max-w-5xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="label-console mb-2">Prediction Timeline</p>
                    <h1 className="h1-console">Scan History</h1>
                    <p className="text-sm text-agri-text/50 font-sans mt-1">{data.length} total records · showing {filtered.length}</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <Filter size={14} className="text-agri-text/40" />
                    {SEVERITY_OPTIONS.map(s => (
                        <button key={s} onClick={() => setSeverity(s)} className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest rounded-sm border transition-all ${severity === s ? 'border-agri-green bg-agri-green/10 text-agri-green' : 'border-agri-border text-agri-text/50 hover:text-white'}`}>{s}</button>
                    ))}
                    <div className="w-px h-4 bg-agri-border" />
                    {CROP_OPTIONS.map(c => (
                        <button key={c} onClick={() => setCrop(c)} className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest rounded-sm border transition-all ${crop === c ? 'border-agri-amber bg-agri-amber/10 text-agri-amber' : 'border-agri-border text-agri-text/50 hover:text-white'}`}>{c}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* List */}
                <div className="lg:col-span-3 space-y-2">
                    {loading ? (
                        <div className="py-20 flex justify-center"><div className="spinner" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="console-card-dark border-dashed text-center py-20">
                            <ScanLine size={36} className="text-agri-text/20 mx-auto mb-3" />
                            <p className="text-sm text-agri-text/50 font-sans">No scan records match your filters.</p>
                        </div>
                    ) : filtered.map((item) => (
                        <div key={item.id} onClick={() => setSelected(item)}
                            className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${selected?.id === item.id ? 'border-agri-green bg-agri-surface' : 'border-agri-border bg-agri-dark hover:border-agri-border'}`}>
                            <div className="w-9 h-9 rounded-sm bg-agri-green/10 border border-agri-green/20 flex items-center justify-center text-agri-green text-xs font-bold shrink-0">
                                {item.cropType?.[0] || 'C'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{item.diseaseName}</p>
                                <p className="text-[10px] font-mono text-agri-text/40 uppercase tracking-widest">{item.cropType} · {new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-mono text-agri-text/50">{(item.confidence * 100).toFixed(1)}%</span>
                                <span className={`badge ${SEVERITY_BADGE[item.severity] || 'badge-grey'}`}>{item.severity}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-2">
                    {selected ? (
                        <div className="console-card space-y-5 sticky top-4">
                            <div>
                                <p className="label-console mb-1">Disease Detected</p>
                                <h2 className="font-display font-semibold text-2xl text-white">{selected.diseaseName}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="badge badge-green">{selected.cropType}</span>
                                    <span className={`badge ${SEVERITY_BADGE[selected.severity] || 'badge-grey'}`}>{selected.severity}</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-[10px] font-mono text-agri-text/40 uppercase">
                                    <span>Confidence</span>
                                    <span className="text-white">{(selected.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-1.5 bg-agri-dark border border-agri-border rounded-full overflow-hidden">
                                    <div className="h-full bg-agri-green" style={{ width: `${(selected.confidence * 100).toFixed(1)}%` }} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 bg-agri-dark border border-agri-border rounded-sm">
                                    <p className="label-console mb-1">Scan Date</p>
                                    <p className="text-agri-text/80 font-sans">{new Date(selected.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-agri-dark border border-agri-border rounded-sm">
                                    <p className="label-console mb-1">Severity</p>
                                    <p className={selected.severity === 'Severe' ? 'text-agri-red font-semibold' : selected.severity === 'Moderate' ? 'text-agri-amber font-semibold' : 'text-agri-green font-semibold'}>{selected.severity}</p>
                                </div>
                            </div>
                            {selected.treatment && (
                                <div className="p-4 bg-agri-green/5 border border-agri-green/20 rounded-sm">
                                    <p className="label-console text-agri-green mb-2">Treatment Protocol</p>
                                    <p className="text-xs text-agri-text/70 font-sans leading-relaxed">{selected.treatment}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="console-card-dark border-dashed h-48 flex items-center justify-center">
                            <p className="text-sm text-agri-text/40 font-sans">Select a scan to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
