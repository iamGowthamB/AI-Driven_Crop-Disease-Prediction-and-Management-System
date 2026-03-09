import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Save, CheckCircle2, User, Lock, Bell, Eye, EyeOff, Loader2 } from 'lucide-react';

function Toggle({ label, desc, value, onChange }) {
    return (
        <div className="flex items-center justify-between p-4 bg-agri-dark border border-agri-border rounded-sm">
            <div><p className="text-sm font-medium text-white">{label}</p>{desc && <p className="text-xs text-agri-text/50 font-sans mt-0.5">{desc}</p>}</div>
            <button onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full border transition-all relative shrink-0 ${value ? 'bg-agri-green border-agri-green' : 'bg-agri-surface border-agri-border'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? 'left-5' : 'left-0.5'}`} />
            </button>
        </div>
    );
}

const TABS = [{ id: 'profile', icon: User, label: 'Profile' }, { id: 'security', icon: Lock, label: 'Security' }, { id: 'notifications', icon: Bell, label: 'Notifications' }];

export default function Settings() {
    const { user } = useAuth();
    const [tab, setTab] = useState('profile');
    const [saved, setSaved] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [profile, setProfile] = useState({ fullName: user?.fullName || '', email: user?.email || '', location: '', bio: '' });
    const [notifs, setNotifs] = useState({ emailAlerts: true, pushAlerts: false, weeklyDigest: true, diseaseOutbreaks: true });

    const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6 flex items-end justify-between">
                <div>
                    <p className="label-console mb-2">Account Management</p>
                    <h1 className="h1-console">Settings</h1>
                </div>
                <button onClick={save} className="btn-primary">
                    {saved ? <><CheckCircle2 size={16} /> Saved</> : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Tab nav */}
                <div className="space-y-1">
                    {TABS.map(t => {
                        const Icon = t.icon; return (
                            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-left transition-all ${tab === t.id ? 'bg-agri-surface border border-agri-border text-white' : 'text-agri-text/50 hover:text-white hover:bg-agri-surface/50'}`}>
                                <Icon size={15} className={tab === t.id ? 'text-agri-green' : 'text-agri-text/30'} />{t.label}
                            </button>
                        );
                    })}
                    {/* Avatar */}
                    <div className="mt-4 console-card-dark text-center">
                        <div className="w-14 h-14 rounded-sm bg-agri-green/10 border border-agri-green/30 flex items-center justify-center text-agri-green text-xl font-bold mx-auto mb-2">
                            {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                        </div>
                        <p className="text-xs font-semibold text-white">{user?.fullName}</p>
                        <p className="text-[9px] font-mono text-agri-text/40 uppercase tracking-widest mt-0.5">{user?.role}</p>
                    </div>
                </div>

                {/* Tab content */}
                <div className="md:col-span-3">
                    {tab === 'profile' && (
                        <div className="console-card space-y-5">
                            <h2 className="h2-console text-xl pb-4 border-b border-agri-border">Profile Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="label-console">Full Name</label><input value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className="input-field" /></div>
                                <div className="space-y-1.5"><label className="label-console">Email</label><input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="input-field" /></div>
                                <div className="space-y-1.5"><label className="label-console">Location</label><input placeholder="City, State" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="input-field" /></div>
                            </div>
                            <div className="space-y-1.5"><label className="label-console">Bio</label><textarea rows={3} value={profile.bio} placeholder="Brief operative description..." onChange={e => setProfile({ ...profile, bio: e.target.value })} className="input-field h-20 resize-none" /></div>
                        </div>
                    )}
                    {tab === 'security' && (
                        <div className="console-card space-y-5">
                            <h2 className="h2-console text-xl pb-4 border-b border-agri-border">Security</h2>
                            {['Current Password', 'New Password', 'Confirm New Password'].map((lbl, i) => (
                                <div key={i} className="space-y-1.5">
                                    <label className="label-console">{lbl}</label>
                                    <div className="relative">
                                        <input type={showPw ? 'text' : 'password'} placeholder="••••••••" className="input-field pr-10" />
                                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-agri-text/30 hover:text-white">
                                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button className="btn-primary text-xs !py-2.5"><Lock size={14} /> Update Password</button>
                            <div className="p-4 bg-agri-dark border border-agri-border rounded-sm mt-4">
                                <div className="flex items-center justify-between">
                                    <div><p className="text-sm font-medium text-white">Two-Factor Authentication</p><p className="text-xs text-agri-text/50 mt-0.5 font-sans">Add an extra layer of security.</p></div>
                                    <button className="btn-outline text-xs !py-2">Enable</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {tab === 'notifications' && (
                        <div className="console-card space-y-4">
                            <h2 className="h2-console text-xl pb-4 border-b border-agri-border">Notification Preferences</h2>
                            <Toggle label="Email Alerts" desc="Receive disease scan reports via email." value={notifs.emailAlerts} onChange={v => setNotifs({ ...notifs, emailAlerts: v })} />
                            <Toggle label="Push Notifications" desc="Browser-level critical alerts." value={notifs.pushAlerts} onChange={v => setNotifs({ ...notifs, pushAlerts: v })} />
                            <Toggle label="Weekly Digest" desc="Summary of scans and community activity." value={notifs.weeklyDigest} onChange={v => setNotifs({ ...notifs, weeklyDigest: v })} />
                            <Toggle label="Disease Outbreak Alerts" desc="Immediate alerts for high-severity outbreaks." value={notifs.diseaseOutbreaks} onChange={v => setNotifs({ ...notifs, diseaseOutbreaks: v })} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
