import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Shield, Mail, Lock, User, AlertCircle, Loader2, Leaf, ShieldCheck, BarChart3, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Wave morph paths ──────────────────────────────────────────────────────────
const W1 = [
    "M0,60 C300,140 600,0  900,80 C1200,160 1500,20 1800,70 L1800,320 L0,320 Z",
    "M0,90 C250,20 550,150 850,60 C1100,0  1400,130 1800,50 L1800,320 L0,320 Z",
    "M0,40 C350,120 650,10 950,90 C1250,170 1550,30 1800,80 L1800,320 L0,320 Z",
];
const W2 = [
    "M0,110 C300,40 600,180 900,90 C1200,20 1500,150 1800,80 L1800,320 L0,320 Z",
    "M0,70 C280,160 580,30 880,110 C1130,180 1420,40 1800,100 L1800,320 L0,320 Z",
    "M0,130 C320,50 620,190 920,100 C1200,30 1480,160 1800,90 L1800,320 L0,320 Z",
];

// ── Variants ──────────────────────────────────────────────────────────────────
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};
const fadeLeft = {
    hidden: { opacity: 0, x: -22 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};
const errV = {
    hidden: { opacity: 0, scale: 0.93, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit:   { opacity: 0, scale: 0.93, y: -6 },
};

const features = [
    { icon: ScanLine,  text: 'AI-powered crop disease detection' },
    { icon: BarChart3, text: 'Real-time field analytics & risk maps' },
    { icon: ShieldCheck, text: 'Secure, role-based farm management' },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '', email: '', password: '', confirm: '', role: 'USER', adminSecret: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            await signup(form.email, form.password, form.fullName, form.role, form.adminSecret);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Check your information.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F0E9D6] to-[#E2D0B0] flex items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* ── Background Waves ────────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg viewBox="0 0 1800 320" preserveAspectRatio="none"
                    className="absolute top-0 left-0 w-full" style={{ height: '45%' }}>
                    <defs>
                        <linearGradient id="sglg1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#6ee7b7" stopOpacity="0.45" />
                            <stop offset="55%"  stopColor="#a7f3d0" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.28" />
                        </linearGradient>
                        <linearGradient id="sglg2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#34d399" stopOpacity="0.20" />
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.18" />
                        </linearGradient>
                    </defs>
                    <motion.path fill="url(#sglg2)"
                        animate={{ d: W2 }}
                        transition={{ duration: 11, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 1.5 }} />
                    <motion.path fill="url(#sglg1)"
                        animate={{ d: W1 }}
                        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }} />
                </svg>

                <svg viewBox="0 0 1800 320" preserveAspectRatio="none"
                    className="absolute bottom-0 left-0 w-full rotate-180" style={{ height: '40%' }}>
                    <motion.path fill="url(#sglg2)"
                        animate={{ d: W1 }}
                        transition={{ duration: 13, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.8 }} />
                    <motion.path fill="url(#sglg1)"
                        animate={{ d: W2 }}
                        transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 2 }} />
                </svg>
            </div>

            {/* ── Centre container ────────────────────────────────────────── */}
            <div className="relative z-10 w-full max-w-5xl mx-auto flex rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/12">

                {/* ═══════════════════════════════════════════════════════════
                    LEFT PANEL — branding
                ══════════════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:flex flex-col justify-between w-[42%] relative overflow-hidden p-10"
                    style={{ background: 'linear-gradient(145deg, #059669 0%, #047857 45%, #065f46 100%)' }}
                >
                    <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.14, 0.28, 0.14] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300 rounded-full blur-[80px]" />
                    <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.10, 0.20, 0.10] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-300 rounded-full blur-[70px]" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0, rotate: -140 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.2 }}
                            whileHover={{ scale: 1.1, rotate: 6 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/')}
                            className="inline-flex items-center justify-center w-13 h-13 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl mb-6 cursor-pointer shadow-lg p-2.5"
                        >
                            <Leaf size={26} className="text-white" />
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.55 }}
                            className="text-3xl font-bold text-white tracking-tight leading-tight">
                            NexAgri<span className="text-amber-300">.</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-emerald-100 text-sm font-medium mt-2 mb-8">
                            Intelligence Console
                        </motion.p>

                        <motion.ul variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                            {features.map(({ icon: Icon, text }, i) => (
                                <motion.li key={i} variants={fadeLeft} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                                        <Icon size={15} className="text-white" />
                                    </div>
                                    <span className="text-emerald-50 text-sm font-medium">{text}</span>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                            className="mt-10 p-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm"
                        >
                            <p className="text-emerald-50 text-xs font-medium leading-relaxed">
                                "Agriculture is the most healthful, most useful, and most noble employment of man."
                            </p>
                            <p className="text-emerald-300 text-xs font-bold mt-2">— George Washington</p>
                        </motion.div>
                    </div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                        className="relative z-10 text-emerald-200/50 text-xs">
                        © 2025 NexAgri. All rights reserved.
                    </motion.p>
                </motion.div>

                {/* ═══════════════════════════════════════════════════════════
                    RIGHT PANEL — signup form
                ══════════════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 bg-white/80 backdrop-blur-2xl flex flex-col justify-center px-8 py-10 md:px-12 relative overflow-hidden"
                >
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ originX: 0 }}
                        className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400" />

                    {/* Mobile brand */}
                    <div className="flex md:hidden items-center gap-3 mb-8">
                        <motion.div initial={{ scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                            onClick={() => navigate('/')}
                            className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md cursor-pointer">
                            <Leaf size={20} className="text-white" />
                        </motion.div>
                        <span className="font-bold text-xl text-stone-900">NexAgri<span className="text-emerald-600">.</span></span>
                    </div>

                    <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-sm mx-auto">

                        <motion.div variants={fadeUp} className="mb-6">
                            <h2 className="text-2xl font-bold text-stone-900">Create your account</h2>
                            <p className="text-sm text-stone-500 font-medium mt-1.5">Join to gain complete predictive insights</p>
                        </motion.div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div key="err" variants={errV} initial="hidden" animate="visible" exit="exit"
                                    className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                                    <AlertCircle size={17} className="shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Role toggle */}
                        <motion.div variants={fadeUp} className="relative flex gap-2 mb-5 p-1.5 bg-stone-100/80 border border-stone-200 rounded-xl">
                            <motion.div
                                layoutId="sg-pill"
                                className={`absolute top-1.5 bottom-1.5 rounded-lg bg-white border border-stone-200/50 shadow-sm transition-all ${form.role === 'USER' ? 'left-1.5 right-[calc(50%+3px)]' : 'left-[calc(50%+3px)] right-1.5'}`}
                                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            />
                            <button type="button" onClick={() => setForm({ ...form, role: 'USER', adminSecret: '' })}
                                className={`relative flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg z-10 transition-colors ${form.role === 'USER' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-800'}`}>
                                Farmer / User
                            </button>
                            <button type="button" onClick={() => setForm({ ...form, role: 'ADMIN' })}
                                className={`relative flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg z-10 transition-colors ${form.role === 'ADMIN' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-800'}`}>
                                Administrator
                            </button>
                        </motion.div>

                        <motion.form variants={stagger} initial="hidden" animate="visible"
                            onSubmit={handleSubmit} className="space-y-3.5">

                            {/* Admin secret */}
                            <AnimatePresence>
                                {form.role === 'ADMIN' && (
                                    <motion.div key="asec"
                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                                        className="overflow-hidden">
                                        <div className="space-y-1.5 pb-1">
                                            <label className="text-xs font-bold text-amber-700 uppercase tracking-wider">Admin Secret Key</label>
                                            <div className="relative">
                                                <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                                                <input type="password" required placeholder="Authorized key required"
                                                    value={form.adminSecret} onChange={e => setForm({ ...form, adminSecret: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 text-amber-900 placeholder-amber-400 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 transition-all" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Full Name + Email */}
                            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <motion.span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                            animate={{ color: form.fullName ? '#059669' : '#a8a29e' }} transition={{ duration: 0.2 }}>
                                            <User size={16} />
                                        </motion.span>
                                        <input required placeholder="Jane Doe" value={form.fullName}
                                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                                            className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/12 focus:border-emerald-500 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <motion.span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                            animate={{ color: form.email ? '#059669' : '#a8a29e' }} transition={{ duration: 0.2 }}>
                                            <Mail size={16} />
                                        </motion.span>
                                        <input type="email" required placeholder="you@farm.com" value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/12 focus:border-emerald-500 transition-all" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Password */}
                            <motion.div variants={fadeUp} className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <motion.span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                        animate={{ color: form.password ? '#059669' : '#a8a29e' }} transition={{ duration: 0.2 }}>
                                        <Lock size={16} />
                                    </motion.span>
                                    <input type="password" required placeholder="Min. 6 characters" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/12 focus:border-emerald-500 transition-all" />
                                </div>
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div variants={fadeUp} className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <motion.span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                        animate={{ color: form.confirm && form.confirm === form.password ? '#059669' : '#a8a29e' }}
                                        transition={{ duration: 0.2 }}>
                                        <Lock size={16} />
                                    </motion.span>
                                    <input type="password" required placeholder="Repeat password" value={form.confirm}
                                        onChange={e => setForm({ ...form, confirm: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/12 focus:border-emerald-500 transition-all" />
                                </div>
                            </motion.div>

                            {/* Submit */}
                            <motion.div variants={fadeUp} className="pt-1">
                                <motion.button type="submit" disabled={loading}
                                    whileHover={!loading ? { scale: 1.025, boxShadow: '0 12px 30px rgba(5,150,105,0.38)' } : {}}
                                    whileTap={!loading ? { scale: 0.975 } : {}}
                                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-70 transition-colors hover:bg-emerald-700">
                                    <AnimatePresence mode="wait">
                                        {loading
                                            ? <motion.span key="s" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}><Loader2 size={17} className="animate-spin" /></motion.span>
                                            : <motion.span key="l" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>Create Account</motion.span>
                                        }
                                    </AnimatePresence>
                                </motion.button>
                            </motion.div>
                        </motion.form>

                        <motion.p variants={fadeUp} initial="hidden" animate="visible"
                            transition={{ delay: 1.0 }}
                            className="mt-6 text-center text-sm text-stone-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline underline-offset-4 transition-colors">
                                Log In Instead
                            </Link>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
