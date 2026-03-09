import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Shield, Mail, Lock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            await signup(form.email, form.password, form.fullName);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-agri-dark flex items-center justify-center p-6">
            <div className="fixed inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #2F8F5B 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-agri-green/10 border border-agri-green/30 rounded-sm mb-5">
                        <Shield size={28} className="text-agri-green" />
                    </div>
                    <h1 className="font-display font-bold text-4xl text-white">Agri-Tech</h1>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-agri-green mt-1">Intelligence Console</p>
                </div>

                <div className="console-card">
                    <div className="mb-7">
                        <h2 className="font-display font-semibold text-2xl text-white">Register Operative</h2>
                        <p className="text-sm text-agri-text/50 font-sans mt-1">Create your access node to the diagnostic system.</p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-center gap-3 p-3 bg-agri-red/10 border border-agri-red/30 rounded-sm text-agri-red text-xs font-sans">
                            <AlertCircle size={14} className="shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="label-console">Full Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-agri-text/30" />
                                <input required placeholder="Operative Name" value={form.fullName}
                                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                                    className="input-field pl-9" />
                            </div>
                        </div>
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
                                <input type="password" required placeholder="Min. 6 characters" value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="input-field pl-9" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="label-console">Confirm Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-agri-text/30" />
                                <input type="password" required placeholder="Repeat password" value={form.confirm}
                                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                                    className="input-field pl-9" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 py-3">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-agri-text/40 font-sans">
                        Already have access?{' '}
                        <Link to="/login" className="text-agri-green hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
