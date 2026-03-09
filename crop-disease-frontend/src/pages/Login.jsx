import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            navigate(user.role === 'ADMIN' ? '/admin' : '/');
        } catch {
            setError('Invalid credentials. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-agri-dark flex items-center justify-center p-6">
            {/* Subtle grid pattern */}
            <div className="fixed inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #2F8F5B 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-agri-green/10 border border-agri-green/30 rounded-sm mb-5">
                        <Shield size={28} className="text-agri-green" />
                    </div>
                    <h1 className="font-display font-bold text-4xl text-white">Agri-Tech</h1>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-agri-green mt-1">Intelligence Console</p>
                </div>

                {/* Card */}
                <div className="console-card">
                    <div className="mb-7">
                        <h2 className="font-display font-semibold text-2xl text-white">Initialize Access</h2>
                        <p className="text-sm text-agri-text/50 font-sans mt-1">Provide credentials to access the diagnostic cluster.</p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-center gap-3 p-3 bg-agri-red/10 border border-agri-red/30 rounded-sm text-agri-red text-xs font-sans">
                            <AlertCircle size={14} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="label-console">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-agri-text/30" />
                                <input type="email" required placeholder="operative@agri-tech.org" value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="input-field pl-9" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="label-console">Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-agri-text/30" />
                                <input type="password" required placeholder="••••••••" value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="input-field pl-9" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 py-3">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Establish Connection'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-agri-text/40 font-sans">
                        No operative account?{' '}
                        <Link to="/signup" className="text-agri-green hover:underline">Register Node</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
