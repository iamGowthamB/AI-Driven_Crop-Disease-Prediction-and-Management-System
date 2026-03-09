import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
    return (
        <div className="flex h-screen bg-agri-dark overflow-hidden">
            {/* Sidebar */}
            <Navbar />
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}
