import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    LayoutDashboard, ScanLine, History, CloudLightning,
    BookOpen, MessageSquare, Settings, LogOut, Shield,
    Database, Users, Menu, X, Leaf
} from 'lucide-react';

const USER_LINKS = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scan', icon: ScanLine, label: 'Diagnostic Scan' },
    { path: '/history', icon: History, label: 'Scan History' },
    { path: '/weather', icon: CloudLightning, label: 'Weather Risk' },
    { path: '/encyclopedia', icon: BookOpen, label: 'Encyclopedia' },
    { path: '/chatbot', icon: MessageSquare, label: 'AgriBot AI' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

const ADMIN_LINKS = [
    { path: '/admin', icon: LayoutDashboard, label: 'Command Center' },
    { path: '/admin/knowledge', icon: Database, label: 'Knowledge DB' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/history', icon: History, label: 'All Scans' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

function NavItem({ path, icon: Icon, label }) {
    return (
        <NavLink
            to={path}
            end={path === '/dashboard'}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative
        ${isActive
                    ? 'bg-white shadow-md shadow-stone-200/50 border border-stone-200/60 font-bold text-emerald-700'
                    : 'text-stone-500 font-medium hover:text-stone-800 hover:bg-stone-100 border border-transparent'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                    <Icon size={18} className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-stone-400 group-hover:text-stone-600'} transition-colors`} />
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
}

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = user?.role === 'ADMIN' ? ADMIN_LINKS : USER_LINKS;
    const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarBody = () => (
        <div className="flex flex-col h-full bg-stone-50/80 backdrop-blur-xl border-r border-stone-200/60 w-64 overflow-y-auto">
            {/* Brand */}
            <div className="px-6 pt-8 pb-6 border-b border-stone-200/50">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-green-600 shadow-lg shadow-emerald-600/20 flex items-center justify-center rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                        <Leaf size={20} className="text-white relative z-10" />
                    </div>
                    <div>
                        <p className="text-xl font-display font-bold text-stone-900 leading-none">NexAgri<span className="text-emerald-600">.</span></p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-1">Intelligence</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5">
                <p className="px-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Menu</p>
                {links.map((link) => (
                    <NavItem key={link.path} {...link} />
                ))}
            </nav>

            {/* User Footer */}
            {user && (
                <div className="p-4 border-t border-stone-200/50 bg-white/40">
                    <div className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-2xl shadow-sm mb-3 relative overflow-hidden group hover:border-emerald-200 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0 shadow-inner">
                            {initials}
                        </div>
                        <div className="min-w-0 relative z-10">
                            <p className="text-sm font-bold text-stone-900 truncate">{user.fullName}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-stone-500 bg-stone-100 hover:bg-red-50 hover:text-red-600 hover:shadow-sm rounded-xl transition-all"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:flex h-screen sticky top-0 shrink-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <SidebarBody />
            </div>

            {/* Mobile toggle Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                    <Leaf size={24} className="text-emerald-600" />
                    <span className="font-display font-bold text-xl text-stone-900">NexAgri<span className="text-emerald-600">.</span></span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="text-stone-600 p-2 hover:bg-stone-100 rounded-xl transition-colors">
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 flex bg-stone-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            )}
            
            {/* Mobile Sidebar Frame */}
            <div className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarBody />
            </div>
        </>
    );
}
