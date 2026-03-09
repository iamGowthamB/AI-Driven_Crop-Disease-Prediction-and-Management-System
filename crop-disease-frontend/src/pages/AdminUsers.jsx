import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { Users, UserCheck, UserX, Shield, Trash2, Search } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const load = () => {
        api.get('/admin/users').then(r => setUsers(r.data)).catch(() => setUsers([])).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const deleteUser = async (id) => {
        if (!confirm('Delete this user permanently?')) return;
        await api.delete(`/admin/users/${id}`).catch(() => alert('Failed to delete user.'));
        load();
    };

    const updateRole = async (id, role) => {
        await api.put(`/admin/users/${id}/role`, { role }).catch(() => alert('Failed to update role.'));
        load();
    };

    const filtered = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.fullName?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6">
                <p className="label-console mb-2">Admin · Identity & Access</p>
                <h1 className="h1-console">User Management</h1>
                <p className="text-sm text-agri-text/50 font-sans mt-1">{users.length} registered operatives on the platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Users', value: users.length, icon: Users, color: 'text-white' },
                    { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, icon: Shield, color: 'text-agri-amber' },
                    { label: 'Standard Users', value: users.filter(u => u.role === 'USER').length, icon: UserCheck, color: 'text-agri-green' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="console-card-dark">
                        <div className="flex items-center gap-2 mb-2"><Icon size={14} className={color} /><span className="label-console">{label}</span></div>
                        <p className={`text-3xl font-bold font-sans ${color}`}>{loading ? '—' : value}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative group w-full max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-agri-text/30" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-9" />
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="console-card-dark border-dashed text-center py-20">
                    <Users size={36} className="text-agri-text/20 mx-auto mb-3" />
                    <p className="text-sm text-agri-text/50 font-sans">No users found.</p>
                </div>
            ) : (
                <div className="console-card p-0 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                {['Operative', 'Email', 'Role', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-agri-dark/50 transition-colors">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-sm bg-agri-green/10 border border-agri-green/20 flex items-center justify-center text-agri-green text-xs font-bold shrink-0">
                                                {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <span className="text-sm font-semibold text-white">{user.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-agri-text/70 font-mono text-xs">{user.email}</td>
                                    <td className="table-cell">
                                        <select value={user.role} onChange={e => updateRole(user.id, e.target.value)}
                                            className="text-xs font-mono uppercase bg-agri-dark border border-agri-border rounded-sm px-2 py-1.5 text-agri-text/80 focus:outline-none focus:border-agri-green transition-colors">
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="table-cell">
                                        <button onClick={() => deleteUser(user.id)} className="w-8 h-8 flex items-center justify-center border border-agri-border rounded-sm text-agri-text/50 hover:text-agri-red hover:border-agri-red transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
