import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { ScanLine, History, CloudLightning, TrendingUp, AlertTriangle, CheckCircle2, Activity, Leaf, ChevronRight, Wind, Sun, ArrowRight, CheckCircle, Sun as SunIcon, Sunset, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Login Toast ───────────────────────────────────────────────────────────────
function LoginToast({ name }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const key = 'login_toast_shown';
        if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, '1');
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 4500);
            return () => clearTimeout(t);
        }
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : hour < 21 ? 'Good Evening' : 'Good Night';
    const GreetIcon = hour < 12 ? SunIcon : hour < 17 ? SunIcon : hour < 21 ? Sunset : Moon;
    const iconColor = hour < 12 ? 'text-amber-400' : hour < 17 ? 'text-orange-400' : hour < 21 ? 'text-rose-400' : 'text-indigo-400';

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-white border border-stone-200 shadow-2xl shadow-stone-900/10 rounded-2xl px-5 py-4 min-w-[280px] max-w-xs"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <GreetIcon size={20} className={iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{greeting}</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{name || 'Welcome back'}</p>
                        <p className="text-xs text-stone-500 font-medium mt-0.5">Logged in successfully ✓</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors text-lg leading-none">&times;</button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const SEVERITY_COLOR = { Severe: 'text-red-600 bg-red-100', Moderate: 'text-amber-600 bg-amber-100', Mild: 'text-emerald-600 bg-emerald-100', Healthy: 'text-green-600 bg-green-100' };

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

    // Time-based greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="min-h-full bg-stone-50 text-stone-900 pb-20 relative overflow-hidden font-sans selection:bg-emerald-500/30">
            <LoginToast name={user?.fullName} />
            {/* Ambient Animated Orbs */}
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300/20 blur-[150px] rounded-full pointer-events-none" 
            />
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-300/20 blur-[150px] rounded-full pointer-events-none" 
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-14 pt-8">
                
                {/* Dashboard Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">{greeting}</p>
                        <h1 className="font-display font-black text-4xl md:text-5xl text-stone-900 tracking-tight">
                            {user?.fullName || 'Operative'}
                        </h1>
                    </div>
                </motion.div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
                    
                    {/* PRIMARY ACTION: Run Diagnostic (Large, highly interactive) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="col-span-1 md:col-span-2 lg:col-span-4 row-span-2 relative group cursor-pointer"
                    >
                        <Link to="/scan" className="block w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 shadow-xl shadow-emerald-500/20 border border-emerald-400/50 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                            <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                                <ScanLine size={200} strokeWidth={1} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <ScanLine size={32} />
                                </div>
                                <div className="mt-12">
                                    <h2 className="text-3xl font-display font-bold text-white mb-2 leading-none">Run Diagnostic</h2>
                                    <p className="text-emerald-50 font-medium">Upload crop images to neural networks for instant pathology analysis.</p>
                                </div>
                                <div className="flex items-center gap-2 mt-6 text-white font-bold text-sm bg-white/20 w-max px-4 py-2 rounded-full group-hover:bg-white/30 transition-colors">
                                    Start Scanner <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* KPI: Overview Multi-block */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="col-span-1 md:col-span-2 lg:col-span-5 row-span-1 bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-3xl flex items-center divide-x divide-stone-100 overflow-hidden"
                    >
                        <div className="flex-1 p-6 flex flex-col justify-center h-full hover:bg-stone-50 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={16} className="text-stone-400" />
                                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Total Scans</span>
                            </div>
                            <span className="text-4xl font-display font-bold text-stone-900">{loading ? '—' : total}</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-center h-full hover:bg-stone-50 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Avg Confidence</span>
                            </div>
                            <span className="text-4xl font-display font-bold text-stone-900">{loading ? '—' : `${avgConf}%`}</span>
                        </div>
                    </motion.div>

                    {/* KPI: Severe vs Healthy */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-stone-900 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl shadow-stone-900/20 block"
                    >
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-center w-full">
                                <div>
                                    <span className="text-[10px] font-mono uppercase text-stone-400 tracking-widest block mb-1">Severe Risk</span>
                                    <span className="text-2xl font-bold text-red-500">{loading ? '-' : severe}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-mono uppercase text-stone-400 tracking-widest block mb-1">Healthy</span>
                                    <span className="text-2xl font-bold text-emerald-500">{loading ? '-' : healthy}</span>
                                </div>
                            </div>
                            
                            {/* Visual Ratio Bar */}
                            <div className="w-full h-3 bg-stone-800 rounded-full mt-4 flex overflow-hidden">
                                {total > 0 && !loading && (
                                    <>
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: `${(severe / total) * 100}%` }} 
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-red-500" 
                                        />
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: `${(healthy / total) * 100}%` }} 
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-emerald-500 ml-auto" 
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* HISTORY: Masonry / Scrollable List (Large block) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="col-span-1 md:col-span-4 lg:col-span-8 row-span-2 bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-3xl p-8 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-bold text-2xl text-stone-900">Recent Diagnostics</h3>
                            <Link to="/history" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
                                View Full History <ChevronRight size={16} />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-stone-100 border-t-emerald-500 rounded-full animate-spin" />
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                                <History size={48} strokeWidth={1} className="mb-4 opacity-50" />
                                <p className="font-medium">No diagnostics logged yet.</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                <AnimatePresence>
                                    {history.slice(0, 4).map((h, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + idx * 0.1 }}
                                            key={h.id} 
                                            className="group relative flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-transparent hover:border-stone-200 hover:bg-white hover:shadow-lg hover:shadow-stone-200/50 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-stone-100 shadow-sm flex items-center justify-center text-stone-400 group-hover:text-emerald-600 transition-colors">
                                                    <Leaf size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{h.diseaseName}</p>
                                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1">
                                                        {h.cropType} • {new Date(h.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${SEVERITY_COLOR[h.severity] || 'bg-stone-100 text-stone-500'}`}>
                                                    {h.severity}
                                                </span>
                                                <span className="text-[10px] font-mono text-stone-400">
                                                    CONF: {(h.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>

                    {/* SECONDARY ACTION: Encyclopedia */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
                    >
                        <Link to="/encyclopedia" className="block w-full h-full bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-3xl p-6 group relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 bg-stone-50 w-32 h-32 rounded-full group-hover:bg-emerald-50 transition-colors duration-500" />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                    <Leaf size={20} />
                                </div>
                                <div className="mt-8">
                                    <h3 className="font-display font-bold text-xl text-stone-900">Encyclopedia</h3>
                                    <p className="text-xs text-stone-500 font-medium mt-1">Browse crop data.</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* SECONDARY ACTION: Weather Risk */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
                    >
                        <Link to="/weather" className="block w-full h-full bg-amber-500 border border-amber-400 shadow-xl shadow-amber-500/20 rounded-3xl p-6 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                                    <CloudLightning size={20} />
                                </div>
                                <div className="mt-8">
                                    <h3 className="font-display font-bold text-xl text-white">Weather Risk</h3>
                                    <p className="text-xs text-amber-50 font-medium mt-1">Live climate threats.</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
            `}} />
        </div>
    );
}
