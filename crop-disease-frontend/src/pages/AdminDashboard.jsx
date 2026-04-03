import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Users, Activity, AlertTriangle, TrendingUp, Database, Shield, ArrowRight, Sun, Sunset, Moon } from 'lucide-react';
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
    const GreetIcon = hour < 12 ? Sun : hour < 17 ? Sun : hour < 21 ? Sunset : Moon;
    const iconColor = hour < 12 ? 'text-amber-400' : hour < 17 ? 'text-orange-400' : hour < 21 ? 'text-rose-400' : 'text-indigo-400';

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-white border border-amber-100 shadow-2xl shadow-stone-900/10 rounded-2xl px-5 py-4 min-w-[280px] max-w-xs"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                        <GreetIcon size={20} className={iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">{greeting}, Admin</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{name || 'Administrator'}</p>
                        <p className="text-xs text-stone-500 font-medium mt-0.5">Logged in successfully ✓</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors text-lg leading-none">&times;</button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {
            setStats({ totalUsers: 0, totalPredictions: 0, severeCount: 0, mostFrequentDisease: 'No data yet' });
        }).finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, bg: 'bg-blue-50', border: 'border-blue-100', iconColor: 'text-blue-500', valueColor: 'text-blue-700' },
        { label: 'Total Scans', value: stats?.totalPredictions ?? '—', icon: Activity, bg: 'bg-emerald-50', border: 'border-emerald-100', iconColor: 'text-emerald-500', valueColor: 'text-emerald-700' },
        { label: 'Severe Cases', value: stats?.severeCount ?? '—', icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-100', iconColor: 'text-red-500', valueColor: 'text-red-700' },
        { label: 'Top Disease', value: stats?.mostFrequentDisease?.split('_').slice(0, 2).join(' ') ?? '—', icon: TrendingUp, bg: 'bg-amber-50', border: 'border-amber-100', iconColor: 'text-amber-500', valueColor: 'text-amber-700' },
    ];

    const quickLinks = [
        { label: 'Knowledge Database', desc: 'Add and manage disease treatment records', href: '/admin/knowledge', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100 hover:border-emerald-300' },
        { label: 'User Management', desc: 'Manage user roles and platform access', href: '/admin/users', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100 hover:border-blue-300' },
        { label: 'All Scans', desc: 'Review all diagnostic predictions system-wide', href: '/history', icon: Activity, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100 hover:border-violet-300' },
    ];

    return (
        <div className="min-h-full bg-stone-50 pb-20 font-sans">
            <LoginToast name={user?.fullName} />
            <div className="max-w-5xl mx-auto px-6 pt-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 border-b border-stone-200 pb-6 relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Admin · System Overview</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live
                        </span>
                    </div>
                    <h1 className="font-display font-black text-4xl text-stone-900 tracking-tight">Command Center</h1>
                    <p className="text-sm text-stone-500 font-medium mt-2">Global platform health, user activity, and diagnostic metrics.</p>
                </motion.div>

                {/* Stat Cards */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 animate-pulse h-24" />
                        ))}
                    </div>
                ) : (
                    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map(({ label, value, icon: Icon, bg, border, iconColor, valueColor }) => (
                            <motion.div key={label} variants={item} className={`bg-white border ${border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group`}>
                                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                                    <Icon size={18} className={iconColor} />
                                </div>
                                <p className={`text-2xl font-black ${valueColor} leading-none mb-1`}>{value}</p>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Most Detected Disease card */}
                {!loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-stone-200 rounded-2xl p-6 mb-8 shadow-sm">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Most Detected Disease Platform-wide</p>
                        <p className="text-xl font-black text-stone-900">{stats?.mostFrequentDisease || 'No data yet'}</p>
                        <p className="text-xs text-stone-400 font-medium mt-1">Most frequently identified across all user scans</p>
                    </motion.div>
                )}

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickLinks.map(({ label, desc, href, icon: Icon, color, bg, border }) => (
                        <a key={label} href={href} className={`bg-white border ${border} rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col gap-3`}>
                            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                                <Icon size={20} className={color} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-stone-900 group-hover:text-stone-700">{label}</p>
                                <p className="text-xs text-stone-500 font-medium mt-0.5">{desc}</p>
                            </div>
                            <div className="mt-auto flex items-center gap-1 text-xs font-bold text-stone-400 group-hover:text-stone-600 transition-colors">
                                Open <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
