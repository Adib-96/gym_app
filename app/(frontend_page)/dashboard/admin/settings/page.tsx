"use client";
import React, { useState } from 'react';
import {
    Settings,
    Bell,
    Lock,
    Globe,
    Database,
    Save,
    RefreshCcw,
    ShieldAlert
} from 'lucide-react';

interface SettingField {
    label: string;
    type: 'text' | 'email' | 'toggle' | 'number' | 'select' | string;
    defaultValue: string | boolean | number;
    options?: string[];
}

interface Section {
    title: string;
    icon: any;
    description: string;
    fields?: SettingField[];
    custom?: React.ReactNode;
}

const SettingsPage = () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const sections: Section[] = [
        {
            title: 'General Settings',
            icon: Settings,
            description: 'Configure your global system preferences.',
            fields: [
                { label: 'System Name', type: 'text', defaultValue: 'GymTracker SaaS' },
                { label: 'Admin Email', type: 'email', defaultValue: 'admin@gymtracker.com' },
                { label: 'Maintenance Mode', type: 'toggle', defaultValue: false },
            ]
        },
        {
            title: 'Security',
            icon: Lock,
            description: 'Manage authentication and security protocols.',
            fields: [
                { label: 'Two-Factor Authentication', type: 'toggle', defaultValue: true },
                { label: 'Session Timeout (minutes)', type: 'number', defaultValue: 60 },
                { label: 'Password Policy', type: 'select', options: ['Standard', 'Strong', 'Enterprise'], defaultValue: 'Strong' },
            ]
        },
        {
            title: 'System Health',
            icon: Database,
            description: 'Monitor database and server status.',
            custom: (
                <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Database Connection</span>
                        <span className="text-xs font-bold text-green-400 uppercase">Healthy</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-500 h-full w-[98%] shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    </div>
                    <button className="mt-4 flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                        <RefreshCcw size={12} />
                        Run System Diagnosis
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">System Settings</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage global configuration and monitor system health.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-purple-900/20"
                >
                    {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">
                {sections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-purple-500/10 p-2.5 rounded-xl">
                                    <Icon size={20} className="text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{section.title}</h3>
                                    <p className="text-sm text-gray-400">{section.description}</p>
                                </div>
                            </div>

                            {section.fields && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {section.fields.map((field, fIdx) => (
                                        <div key={fIdx} className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">{field.label}</label>
                                            {field.type === 'toggle' ? (
                                                <div className="flex items-center h-10">
                                                    <button className={`w-12 h-6 rounded-full transition-colors relative ${field.defaultValue ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${field.defaultValue ? 'translate-x-6' : ''}`}></div>
                                                    </button>
                                                </div>
                                            ) : field.type === 'select' ? (
                                                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-purple-500 text-sm">
                                                    {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    defaultValue={field.defaultValue as string}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {section.custom}
                        </div>
                    );
                })}

                <div className="bg-red-500/5 border border-red-900/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 text-red-400 mb-2">
                        <ShieldAlert size={20} />
                        <h3 className="font-bold">Danger Zone</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Actions here are irreversible. Please perform them with caution.</p>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-transparent border border-red-900/50 text-red-400 hover:bg-red-900/20 rounded-lg text-sm transition-all font-medium">
                            Clear All System Logs
                        </button>
                        <button className="px-4 py-2 bg-transparent border border-red-900/50 text-red-400 hover:bg-red-900/20 rounded-lg text-sm transition-all font-medium">
                            Force Cache Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
