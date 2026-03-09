import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { ScanLine, History, CloudLightning, TrendingUp, AlertTriangle, CheckCircle2, Activity, Leaf, ChevronRight } from 'lucide-react';

const SEVERITY_COLOR = { Severe: 'badge-red', Moderate: 'badge-amber', Mild: 'badge-green', Healthy: 'badge-green' };

export default function Dashboard() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/predictions/history').then(r => setHistory(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const total = history.length;
    const severe = history.filter(h => h.severity === 'Severe').length;
    const healthy = history.filter(h => h.diseaseName?.toLowerCase().includes('healthy')).length;
    const avgConf = total > 0 ? (history.reduce((s, h) => s + (h.confidence || 0), 0) / total * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-slide-up">
            {/* Header */}
            <div className="border-b border-agri-border pb-6">
                <p className="label-console mb-2">Welcome back</p>
                <h1 className="h1-console">
                    {user?.fullName || 'Operative'}
                </h1>
                <p className="text-sm text-agri-text/50 font-sans mt-1">Crop disease detection & agricultural intelligence platform.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Scans', value: total, icon: Activity, color: 'text-white' },
                    { label: 'Severe Cases', value: severe, icon: AlertTriangle, color: 'text-agri-red' },
                    { label: 'Healthy Scans', value: healthy, icon: CheckCircle2, color: 'text-agri-green' },
                    { label: 'Avg. Confidence', value: `${avgConf}%`, icon: TrendingUp, color: 'text-agri-amber' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="console-card-dark">
                        <div className="flex items-center gap-2 mb-3">
                            <Icon size={14} className={`${color} opacity-70`} />
                            <span className="label-console">{label}</span>
                        </div>
                        <p className={`text-3xl font-sans font-bold ${color}`}>{loading ? '—' : value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/scan" className="console-card border-agri-green/30 hover:border-agri-green/60 transition-all group flex items-center gap-4">
                    <div className="w-10 h-10 bg-agri-green/10 border border-agri-green/30 rounded-sm flex items-center justify-center text-agri-green shrink-0">
                        <ScanLine size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">Run Diagnostic</p>
                        <p className="text-xs text-agri-text/50 font-sans mt-0.5">Upload crop image for CNN analysis</p>
                    </div>
                    <ChevronRight size={16} className="text-agri-text/30 group-hover:text-agri-green transition-colors shrink-0" />
                </Link>
                <Link to="/weather" className="console-card hover:border-agri-amber/40 transition-all group flex items-center gap-4">
                    <div className="w-10 h-10 bg-agri-amber/10 border border-agri-amber/20 rounded-sm flex items-center justify-center text-agri-amber shrink-0">
                        <CloudLightning size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">Weather Risk</p>
                        <p className="text-xs text-agri-text/50 font-sans mt-0.5">Check environmental disease risk</p>
                    </div>
                    <ChevronRight size={16} className="text-agri-text/30 group-hover:text-agri-amber transition-colors shrink-0" />
                </Link>
                <Link to="/encyclopedia" className="console-card hover:border-agri-text/20 transition-all group flex items-center gap-4">
                    <div className="w-10 h-10 bg-agri-text/5 border border-agri-border rounded-sm flex items-center justify-center text-agri-text/60 shrink-0">
                        <Leaf size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">Encyclopedia</p>
                        <p className="text-xs text-agri-text/50 font-sans mt-0.5">Browse disease knowledge base</p>
                    </div>
                    <ChevronRight size={16} className="text-agri-text/30 group-hover:text-white transition-colors shrink-0" />
                </Link>
            </div>

            {/* Recent History */}
            <div className="console-card">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="h2-console text-xl">Recent Scans</h2>
                    <Link to="/history" className="text-xs font-mono uppercase tracking-widest text-agri-green hover:underline">View All</Link>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner" /></div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12">
                        <ScanLine size={36} className="text-agri-text/20 mx-auto mb-3" />
                        <p className="text-sm text-agri-text/50 font-sans">No scans yet. Upload a crop image to get started.</p>
                        <Link to="/scan" className="btn-primary mt-4 inline-flex">Run First Diagnostic</Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {history.slice(0, 5).map((h) => (
                            <div key={h.id} className="flex items-center gap-4 p-3 bg-agri-dark border border-agri-border/50 rounded-sm hover:border-agri-border transition-colors">
                                <div className="w-8 h-8 bg-agri-green/10 border border-agri-green/20 rounded-sm flex items-center justify-center text-agri-green shrink-0 text-xs font-mono">
                                    {h.cropType?.[0] || 'C'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{h.diseaseName}</p>
                                    <p className="text-[10px] font-mono text-agri-text/40 uppercase tracking-widest">{h.cropType} • {new Date(h.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs font-mono text-agri-text/50">{(h.confidence * 100).toFixed(1)}%</span>
                                    <span className={`badge ${SEVERITY_COLOR[h.severity] || 'badge-grey'}`}>{h.severity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
