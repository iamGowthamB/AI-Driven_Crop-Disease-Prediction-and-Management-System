import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { Users, Shield, UserCheck, Trash2, Search, Clock, Activity, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Status helpers ───────────────────────────────────────────────────────────
function getStatus(lastLoginAt) {
    if (!lastLoginAt) return { label: 'Never', style: 'bg-stone-100 text-stone-500 border-stone-200', dot: 'bg-stone-400', dotPulse: false, online: false };
    const diff = Date.now() - new Date(lastLoginAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60)  return { label: 'Online', style: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', dotPulse: true,  online: true };
    if (hrs < 24)   return { label: 'Today',  style: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400',  dotPulse: false, online: false };
    if (days < 7)   return { label: `${days}d ago`, style: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400',  dotPulse: false, online: false };
    return { label: 'Inactive', style: 'bg-stone-100 text-stone-500 border-stone-200', dot: 'bg-stone-400', dotPulse: false, online: false };
}

function StatusBadge({ lastLoginAt }) {
    const s = getStatus(lastLoginAt);
    return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold border rounded-full px-2.5 py-1 uppercase tracking-wider ${s.style}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.dotPulse ? 'animate-pulse' : ''}`} />{s.label}
        </span>
    );
}

function fmtTime(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const AVATAR_COLORS = ['from-blue-400 to-blue-600', 'from-emerald-400 to-emerald-600', 'from-violet-400 to-violet-600', 'from-rose-400 to-rose-600', 'from-amber-400 to-amber-600'];

export default function AdminUsers() {
    const [users, setUsers]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch]   = useState('');

    const load = () => api.get('/admin/users').then(r => setUsers(r.data)).catch(() => setUsers([])).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const deleteUser = async (id) => { if (!confirm('Delete this user?')) return; await api.delete(`/admin/users/${id}`).catch(() => alert('Failed.')); load(); };
    const updateRole = async (id, role) => { await api.put(`/admin/users/${id}/role`, { role }).catch(() => alert('Failed.')); load(); };

    const now = Date.now();
    const filtered     = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.fullName?.toLowerCase().includes(search.toLowerCase()));
    const onlineNow    = users.filter(u => u.lastLoginAt && (now - new Date(u.lastLoginAt).getTime()) < 3600000).length;
    const activeToday  = users.filter(u => u.lastLoginAt && (now - new Date(u.lastLoginAt).getTime()) < 86400000).length;

    const statCards = [
        { label: 'Total Users',   value: users.length,                                    icon: Users,     bg: 'bg-blue-50',    iconColor: 'text-blue-500',    valueColor: 'text-blue-700',    border: 'border-blue-100' },
        { label: 'Admins',        value: users.filter(u => u.role === 'ADMIN').length,    icon: Shield,    bg: 'bg-amber-50',   iconColor: 'text-amber-500',   valueColor: 'text-amber-700',   border: 'border-amber-100' },
        { label: 'Standard Users',value: users.filter(u => u.role === 'USER').length,     icon: UserCheck, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', valueColor: 'text-emerald-700', border: 'border-emerald-100' },
        { label: 'Online Now',    value: onlineNow,                                       icon: Wifi,      bg: 'bg-violet-50',  iconColor: 'text-violet-500',  valueColor: 'text-violet-700',  border: 'border-violet-100' },
        { label: 'Active Today',  value: activeToday,                                     icon: Activity,  bg: 'bg-rose-50',    iconColor: 'text-rose-500',    valueColor: 'text-rose-700',    border: 'border-rose-100' },
    ];

    // Sort: online first, then recently active
    const sorted = [...filtered].sort((a, b) => {
        if (!a.lastLoginAt && !b.lastLoginAt) return 0;
        if (!a.lastLoginAt) return 1;
        if (!b.lastLoginAt) return -1;
        return new Date(b.lastLoginAt) - new Date(a.lastLoginAt);
    });

    return (
        <div className="min-h-full bg-stone-50 pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-6 pt-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-stone-200 pb-6">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Admin · Identity &amp; Access</p>
                    <h1 className="font-display font-black text-4xl text-stone-900 tracking-tight">User Management</h1>
                    <p className="text-sm text-stone-500 font-medium mt-2">
                        {users.length} registered users ·
                        <span className="ml-1.5 inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            {onlineNow} online now
                        </span>
                    </p>
                </motion.div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {statCards.map(({ label, value, icon: Icon, bg, iconColor, valueColor, border }) => (
                        <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`bg-white border ${border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all`}>
                            <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-2`}><Icon size={16} className={iconColor} /></div>
                            <p className={`text-2xl font-black leading-none mb-0.5 ${valueColor}`}>{loading ? '—' : value}</p>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-5 w-full max-w-md">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all shadow-sm" />
                </div>

                {/* Table */}
                {loading ? (
                    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-16 border-b border-stone-100 animate-pulse bg-stone-50/50 last:border-0" />)}
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-stone-200 rounded-2xl py-20 text-center">
                        <Users size={36} className="text-stone-300 mx-auto mb-3" /><p className="text-sm font-bold text-stone-500">No users found.</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-[2fr_2.5fr_1fr_1fr_2fr_auto] gap-3 px-5 py-3 bg-stone-50 border-b border-stone-100">
                            {['User', 'Email', 'Role', 'Status', 'Last Login', ''].map(h => (
                                <p key={h} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{h}</p>
                            ))}
                        </div>
                        <AnimatePresence>
                            {sorted.map((user, idx) => {
                                const status = getStatus(user.lastLoginAt);
                                return (
                                    <motion.div key={user.id}
                                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className={`grid grid-cols-[2fr_2.5fr_1fr_1fr_2fr_auto] gap-3 items-center px-5 py-3.5 border-b border-stone-100 last:border-0 transition-colors ${status.online ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-stone-50/70'}`}
                                    >
                                        {/* Name + Avatar */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative shrink-0">
                                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
                                                    {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                                                </div>
                                                {status.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />}
                                            </div>
                                            <span className="text-sm font-bold text-stone-900 truncate">{user.fullName}</span>
                                        </div>

                                        {/* Email */}
                                        <span className="text-xs text-stone-500 font-mono truncate">{user.email}</span>

                                        {/* Role */}
                                        <select value={user.role} onChange={e => updateRole(user.id, e.target.value)}
                                            className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer">
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>

                                        {/* Status */}
                                        <StatusBadge lastLoginAt={user.lastLoginAt} />

                                        {/* Last Login */}
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <Clock size={11} className="shrink-0 text-stone-400" />
                                            <span className="text-xs text-stone-500 font-medium truncate">{fmtTime(user.lastLoginAt)}</span>
                                        </div>

                                        {/* Delete */}
                                        <button onClick={() => deleteUser(user.id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                                            <Trash2 size={13} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
