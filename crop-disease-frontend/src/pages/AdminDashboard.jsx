import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { Users, Activity, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {
            // Mock data if endpoint unavailable
            setStats({ totalUsers: 0, totalPredictions: 0, severeCount: 0, mostFrequentDisease: 'No data yet' });
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6">
                <p className="label-console mb-2">Admin · System Overview</p>
                <h1 className="h1-console">Command Center</h1>
                <p className="text-sm text-agri-text/50 font-sans mt-1">Global platform health, user activity, and diagnostic metrics.</p>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><div className="spinner" /></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'text-agri-green' },
                            { label: 'Total Scans', value: stats?.totalPredictions ?? '—', icon: Activity, color: 'text-white' },
                            { label: 'Severe Cases', value: stats?.severeCount ?? '—', icon: AlertTriangle, color: 'text-agri-red' },
                            { label: 'Top Disease', value: stats?.mostFrequentDisease?.split(' ').slice(0, 2).join(' ') ?? '—', icon: TrendingUp, color: 'text-agri-amber' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="console-card-dark">
                                <div className="flex items-center gap-2 mb-3"><Icon size={14} className={color} /><span className="label-console">{label}</span></div>
                                <p className={`text-3xl font-bold font-sans ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="console-card">
                        <div className="flex items-center gap-2 mb-5"><BarChart3 size={18} className="text-agri-text/50" /><h2 className="h2-console text-xl">Most Detected Disease</h2></div>
                        {stats?.mostFrequentDisease ? (
                            <div className="p-4 bg-agri-dark border border-agri-border rounded-sm">
                                <p className="text-lg font-display font-semibold text-white">{stats.mostFrequentDisease}</p>
                                <p className="text-xs text-agri-text/50 font-sans mt-1">Most frequently detected across all user scans.</p>
                            </div>
                        ) : (
                            <p className="text-sm text-agri-text/50 font-sans">Insufficient scan data to determine top disease.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Manage Knowledge Base', 'Manage Users', 'View All Scans'].map((action, i) => (
                            <a key={i} href={['/admin/knowledge', '/admin/users', '/history'][i]} className="console-card hover:border-agri-green/40 transition-all group">
                                <p className="text-sm font-semibold text-white mb-1">{action}</p>
                                <p className="text-xs text-agri-text/50 font-sans">{['Add and edit disease treatments', 'Manage user roles and access', 'Review all system predictions'][i]}</p>
                            </a>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
