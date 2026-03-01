"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth-client';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Activity,
    ShieldCheck
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<{ name: string; role: string;[key: string]: unknown } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/auth/signin');
            return;
        }
        // eslint-disable-next-line
        setUser(currentUser);
        setLoading(false);
    }, [router]);

    const handleLogout = async () => {
        await logout();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const navItems = [
        { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
        { name: 'System Logs', href: '/dashboard/admin/logs', icon: Activity },
        { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <div className="flex items-center space-x-2">
                            <ShieldCheck className="text-purple-500 w-8 h-8" />
                            <span className="text-xl font-extrabold tracking-tight">ADMIN</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={22} className={isActive ? 'text-purple-400' : 'group-hover:text-white'} />
                                {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
                                {isActive && isSidebarOpen && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
                    >
                        <LogOut size={22} />
                        {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
                <header className="h-16 flex items-center justify-between px-8 border-b border-gray-800 backdrop-blur-md bg-black/50 sticky top-0 z-10">
                    <h1 className="text-lg font-semibold text-gray-200">
                        {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                            {user.name[0]}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
