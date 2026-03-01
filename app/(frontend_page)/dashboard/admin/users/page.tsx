"use client";
import React, { useEffect, useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    Mail,
    Calendar,
    Loader2
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (roleFilter) params.append('role', roleFilter);

            const response = await fetch(`/api/admin/users?${params.toString()}`);
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, roleFilter]);

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            setUpdatingId(userId);
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            });
            const data = await response.json();
            if (data.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <select
                            className="bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-10 pr-8 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none text-sm"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="user">Clients</option>
                            <option value="coach">Coaches</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-purple-900/20">
                        <UserPlus size={18} />
                        Add User
                    </button>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 bg-gray-800/30">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin text-purple-500 w-8 h-8 mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center font-bold text-gray-300 ring-1 ring-gray-700">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{user.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Mail size={12} />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                disabled={updatingId === user.id}
                                                className={`text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:ring-1 focus:ring-purple-500 transition-all ${user.role === 'admin' ? 'text-red-400' : user.role === 'coach' ? 'text-purple-400' : 'text-blue-400'
                                                    }`}
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            >
                                                <option value="user">Client</option>
                                                <option value="coach">Coach</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            {updatingId === user.id && <Loader2 className="animate-spin inline-block ml-2 w-3 h-3 text-purple-500" />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar size={14} />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
