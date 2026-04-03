import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Save, CheckCircle2, User as UserIcon, Lock, Bell, Eye, EyeOff, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Toggle({ label, desc, value, onChange }) {
    return (
        <div className="flex items-center justify-between p-5 bg-stone-50 border border-stone-200 rounded-2xl hover:border-emerald-200 transition-colors group cursor-pointer" onClick={() => onChange(!value)}>
            <div className="pr-4">
                <p className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{label}</p>
                {desc && <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">{desc}</p>}
            </div>
            <button className={`w-12 h-6.5 rounded-full border-2 transition-all relative shrink-0 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${value ? 'bg-emerald-500 border-emerald-500' : 'bg-stone-200 border-stone-200'}`}>
                <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all duration-300 ease-spring ${value ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
        </div>
    );
}

const TABS = [
    { id: 'profile', icon: UserIcon, label: 'Profile Information' }, 
    { id: 'security', icon: Lock, label: 'Security & Access' }, 
    { id: 'notifications', icon: Bell, label: 'Alert Preferences' }
];

export default function Settings() {
    const { user } = useAuth();
    const [tab, setTab] = useState('profile');
    const [saved, setSaved] = useState(false);
    const [showPw, setShowPw] = useState(false);
    
    // Form States
    const [profile, setProfile] = useState({ fullName: user?.fullName || '', email: user?.email || '', location: '', bio: '' });
    const [notifs, setNotifs] = useState({ emailAlerts: true, pushAlerts: false, weeklyDigest: true, diseaseOutbreaks: true });

    const saveSettings = () => { 
        setSaved(true); 
        setTimeout(() => setSaved(false), 2500); 
    };

    const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

    return (
        <div className="min-h-full bg-stone-50 text-stone-900 pb-20 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-400/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-14 pt-8 relative z-10">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Account Management</p>
                        <h1 className="font-display font-black text-4xl text-stone-900 tracking-tight">System Settings</h1>
                        <p className="text-sm text-stone-500 font-medium mt-2">Manage your personal profile, security credentials, and alert preferences.</p>
                    </div>
                    <button onClick={saveSettings} className="btn-primary py-3 px-8 text-sm shrink-0 shadow-emerald-600/20">
                        {saved ? <><CheckCircle2 size={18} /> Updates Saved</> : <><Save size={18} /> Save Changes</>}
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar (Desktop) / Top Nav (Mobile) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Avatar Card */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-stone-200 shadow-xl shadow-stone-200/40 rounded-3xl p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-500 to-green-600" />
                            <div className="relative z-10 mt-10">
                                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-emerald-600 text-3xl font-black mx-auto mb-4 ring-1 ring-stone-200">
                                    {initials}
                                </div>
                                <h2 className="font-display font-black text-2xl text-stone-900 leading-tight">{user?.fullName || 'User'}</h2>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1 mb-4">{user?.role || 'FARMER'}</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-stone-400" /> Account Active
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Tabs */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-stone-200 shadow-lg shadow-stone-200/30 rounded-3xl p-3 flex flex-col gap-1">
                            {TABS.map(t => {
                                const Icon = t.icon; 
                                const active = tab === t.id;
                                return (
                                    <button 
                                        key={t.id} 
                                        onClick={() => setTab(t.id)} 
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold text-left transition-all
                                        ${active ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900 border border-transparent'}`}
                                    >
                                        <Icon size={18} className={active ? 'text-emerald-600' : 'text-stone-400'} />
                                        {t.label}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={tab}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                                className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-3xl overflow-hidden"
                            >
                                {tab === 'profile' && (
                                    <div>
                                        <div className="p-8 border-b border-stone-100 bg-stone-50/50">
                                            <h2 className="font-display font-black text-2xl text-stone-900 flex items-center gap-3">
                                                <UserIcon size={24} className="text-stone-400" /> Profile Information
                                            </h2>
                                            <p className="text-sm text-stone-500 font-medium mt-2">Manage your personal details and how others see you on the platform.</p>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block flex items-center gap-2"><UserIcon size={14}/> Full Legal Name</label>
                                                    <input value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className="input-field shadow-inner bg-stone-50" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block flex items-center gap-2"><Mail size={14}/> Email Address</label>
                                                    <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="input-field shadow-inner bg-stone-50" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block flex items-center gap-2"><MapPin size={14}/> Agricultural Zone / Location</label>
                                                    <input placeholder="e.g. Krishnagiri, Tamil Nadu" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="input-field shadow-inner bg-stone-50" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 pt-2 border-t border-stone-100">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mt-4">Farm Profile / Bio</label>
                                                <textarea 
                                                    rows={4} 
                                                    value={profile.bio} 
                                                    placeholder="Describe your farming operations, primary crops, and acreage..." 
                                                    onChange={e => setProfile({ ...profile, bio: e.target.value })} 
                                                    className="input-field shadow-inner bg-stone-50 resize-none py-4" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {tab === 'security' && (
                                    <div>
                                        <div className="p-8 border-b border-stone-100 bg-stone-50/50">
                                            <h2 className="font-display font-black text-2xl text-stone-900 flex items-center gap-3">
                                                <Lock size={24} className="text-stone-400" /> Security & Access
                                            </h2>
                                            <p className="text-sm text-stone-500 font-medium mt-2">Update your password to keep your farm data secure.</p>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            {['Current Password', 'New Password', 'Confirm New Password'].map((lbl, i) => (
                                                <div key={i} className="space-y-2 max-w-md">
                                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block">{lbl}</label>
                                                    <div className="relative">
                                                        <input type={showPw ? 'text' : 'password'} placeholder="••••••••" className="input-field shadow-inner bg-stone-50 pr-12 font-mono" />
                                                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors">
                                                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-2">
                                                <button className="btn-outline text-sm py-3 px-6 shadow-sm hover:!bg-stone-900 hover:!text-white hover:!border-stone-900 transition-colors">
                                                    Update Password
                                                </button>
                                            </div>
                                            
                                            <div className="mt-8 pt-6 border-t border-stone-100">
                                                <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500"/> Two-Factor Authentication</h3>
                                                        <p className="text-sm text-stone-600 font-medium mt-1">Add an extra layer of security to your farm dashboard.</p>
                                                    </div>
                                                    <button className="btn-primary !bg-emerald-600 !px-6 shrink-0">Enable 2FA</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {tab === 'notifications' && (
                                    <div>
                                        <div className="p-8 border-b border-stone-100 bg-stone-50/50">
                                            <h2 className="font-display font-black text-2xl text-stone-900 flex items-center gap-3">
                                                <Bell size={24} className="text-stone-400" /> Alert Preferences
                                            </h2>
                                            <p className="text-sm text-stone-500 font-medium mt-2">Control which alerts and diagnostics you receive.</p>
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Delivery Methods</h3>
                                            <Toggle 
                                                label="Email Communications" 
                                                desc="Receive comprehensive disease diagnostic reports and chemical spraying schedules directly to your email." 
                                                value={notifs.emailAlerts} 
                                                onChange={v => setNotifs({ ...notifs, emailAlerts: v })} 
                                            />
                                            <Toggle 
                                                label="Push Notifications" 
                                                desc="Browser-level critical alerts for immediate environmental threats (Requires browser permission)." 
                                                value={notifs.pushAlerts} 
                                                onChange={v => setNotifs({ ...notifs, pushAlerts: v })} 
                                            />
                                            
                                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-8 mb-4">Alert Types</h3>
                                            <Toggle 
                                                label="Disease Outbreak Radar" 
                                                desc="Immediate intelligence alerts when high-severity pathogens (like Late Blight) are detected near your zone based on weather models." 
                                                value={notifs.diseaseOutbreaks} 
                                                onChange={v => setNotifs({ ...notifs, diseaseOutbreaks: v })} 
                                            />
                                            <Toggle 
                                                label="Weekly Intelligence Digest" 
                                                desc="A curated summary of your farm's scan history and regional disease proliferation trends." 
                                                value={notifs.weeklyDigest} 
                                                onChange={v => setNotifs({ ...notifs, weeklyDigest: v })} 
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
