import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    LayoutDashboard, ScanLine, History, CloudLightning,
    BookOpen, MessageSquare, Settings, LogOut, Shield,
    Database, Users, ChevronDown, ChevronUp, Menu, X,
} from 'lucide-react';

const USER_LINKS = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scan', icon: ScanLine, label: 'Diagnostic Scan' },
    { path: '/history', icon: History, label: 'Scan History' },
    { path: '/weather', icon: CloudLightning, label: 'Weather Risk' },
    { path: '/encyclopedia', icon: BookOpen, label: 'Disease Encyclopedia' },
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
            end={path === '/'}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-150 group relative
        ${isActive
                    ? 'bg-agri-surface border border-agri-border text-white'
                    : 'text-agri-text/50 hover:text-agri-text hover:bg-agri-surface/50 border border-transparent'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-agri-green rounded-r-full" />}
                    <Icon size={15} className={`shrink-0 ${isActive ? 'text-agri-green' : 'text-agri-text/30 group-hover:text-agri-text/60'}`} />
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
        <div className="flex flex-col h-full bg-agri-dark border-r border-agri-border w-60 overflow-y-auto">
            {/* Brand */}
            <div className="px-4 pt-6 pb-4 border-b border-agri-border">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-agri-green/10 border border-agri-green/30 flex items-center justify-center rounded-sm shrink-0">
                        <Shield size={16} className="text-agri-green" />
                    </div>
                    <div>
                        <p className="text-sm font-display font-bold text-white leading-none">Agri-Tech</p>
                        <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-agri-green">Intelligence Console</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {links.map((link) => (
                    <NavItem key={link.path} {...link} />
                ))}
            </nav>

            {/* User Footer */}
            {user && (
                <div className="px-3 pb-5 border-t border-agri-border pt-4 space-y-3">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-sm bg-agri-green/10 border border-agri-green/20 flex items-center justify-center text-agri-green text-xs font-bold shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-agri-text/40">{user.role}</p>
                        </div>
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-agri-green shrink-0" />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-agri-red/70 border border-transparent hover:border-agri-red/20 hover:bg-agri-red/5 rounded-sm transition-colors"
                    >
                        <LogOut size={13} /> Logout
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex h-screen sticky top-0 shrink-0">
                <SidebarBody />
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-agri-dark border-b border-agri-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-agri-green" />
                    <span className="font-display font-bold text-white">Agri-Tech</span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="text-agri-text/70">
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 flex" onClick={() => setMobileOpen(false)}>
                    <div className="bg-agri-dark/80 backdrop-blur-sm flex-1" />
                </div>
            )}
            {mobileOpen && (
                <div className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-60">
                    <SidebarBody />
                </div>
            )}
        </>
    );
}
