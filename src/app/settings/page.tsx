'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
    User,
    Bell,
    Palette,
    Shield,
    Key,
    Globe,
    Moon,
    Sun,
    Monitor,
    Check,
    ChevronRight,
    Mail,
    Smartphone,
    Volume2,
    Eye,
    Lock,
    Download,
    Trash2,
    LogOut,
    Settings,
    Sparkles,
} from 'lucide-react';

import AppLayout from '../app-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'language', label: 'Language & Region', icon: Globe },
];

const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
];

const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', label: 'French', flag: '🇫🇷' },
    { code: 'de', label: 'German', flag: '🇩🇪' },
    { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
];

export default function SettingsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [activeSection, setActiveSection] = useState('profile');
    const [theme, setTheme] = useState('dark');
    const [language, setLanguage] = useState('en');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sound: true,
    });

    const handleSave = () => {
        toast({
            title: 'Settings saved',
            description: 'Your preferences have been updated successfully.',
        });
    };

    return (
        <AppLayout>
            <div className="min-h-full bg-gradient-to-b from-background to-background/95 p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
                            <Settings className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
                            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                                <div className="p-2">
                                    {settingsSections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                                                activeSection === section.id
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                            )}
                                        >
                                            <section.icon className="h-4 w-4" />
                                            {section.label}
                                            {activeSection === section.id && (
                                                <ChevronRight className="h-4 w-4 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-3">
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                                {/* Profile Section */}
                                {activeSection === 'profile' && (
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold mb-1">Profile Settings</h2>
                                            <p className="text-sm text-muted-foreground">Update your personal information</p>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                                                {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{user?.fullName || 'User'}</p>
                                                <p className="text-sm text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress}</p>
                                            </div>
                                            <Button variant="outline" size="sm">Change Photo</Button>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">First Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={user?.firstName || ''}
                                                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Last Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={user?.lastName || ''}
                                                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Email</label>
                                            <input
                                                type="email"
                                                defaultValue={user?.emailAddresses?.[0]?.emailAddress || ''}
                                                disabled
                                                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Managed by your authentication provider</p>
                                        </div>

                                        <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                                            Save Changes
                                        </Button>
                                    </div>
                                )}

                                {/* Notifications Section */}
                                {activeSection === 'notifications' && (
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold mb-1">Notification Preferences</h2>
                                            <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { key: 'email', icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
                                                { key: 'push', icon: Smartphone, label: 'Push Notifications', desc: 'Get notified on your device' },
                                                { key: 'sound', icon: Volume2, label: 'Sound Alerts', desc: 'Play sounds for new messages' },
                                            ].map((item) => (
                                                <div
                                                    key={item.key}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                                                            <item.icon className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{item.label}</p>
                                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                                                        className={cn(
                                                            'w-11 h-6 rounded-full transition-colors relative',
                                                            notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                                                            notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                                                        )} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Appearance Section */}
                                {activeSection === 'appearance' && (
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold mb-1">Appearance</h2>
                                            <p className="text-sm text-muted-foreground">Customize the look of your workspace</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-3 block">Theme</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {themes.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setTheme(t.id)}
                                                        className={cn(
                                                            'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                                                            theme === t.id
                                                                ? 'border-primary bg-primary/10'
                                                                : 'border-border/50 bg-muted/30 hover:border-border'
                                                        )}
                                                    >
                                                        <t.icon className={cn('h-6 w-6', theme === t.id ? 'text-primary' : 'text-muted-foreground')} />
                                                        <span className="text-sm font-medium">{t.label}</span>
                                                        {theme === t.id && <Check className="h-4 w-4 text-primary" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="h-4 w-4 text-purple-500" />
                                                <span className="text-sm font-medium">Pro Tip</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                System theme will automatically switch between light and dark based on your device settings.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Privacy Section */}
                                {activeSection === 'privacy' && (
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold mb-1">Privacy & Security</h2>
                                            <p className="text-sm text-muted-foreground">Manage your security settings</p>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { icon: Eye, label: 'Profile Visibility', desc: 'Control who can see your profile', action: 'Public' },
                                                { icon: Lock, label: 'Two-Factor Auth', desc: 'Add an extra layer of security', action: 'Enable' },
                                                { icon: Download, label: 'Download Data', desc: 'Get a copy of your data', action: 'Download' },
                                                { icon: Trash2, label: 'Delete Account', desc: 'Permanently delete your account', action: 'Delete', danger: true },
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            'h-10 w-10 rounded-lg flex items-center justify-center',
                                                            item.danger ? 'bg-red-500/10' : 'bg-muted/50'
                                                        )}>
                                                            <item.icon className={cn('h-5 w-5', item.danger ? 'text-red-500' : 'text-muted-foreground')} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{item.label}</p>
                                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant={item.danger ? 'destructive' : 'outline'}
                                                        size="sm"
                                                    >
                                                        {item.action}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* API Keys Section */}
                                {activeSection === 'api' && (
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold mb-1">API Keys</h2>
                                            <p className="text-sm text-muted-foreground">Manage your API access tokens</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium">Production Key</span>
                                                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Active</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <code className="flex-1 px-3 py-2 rounded-lg bg-background/50 text-xs font-mono">
                                                    sk-••••••••••••••••••••••••••••••••
                                                </code>
                                                <Button variant="outline" size="sm">Reveal</Button>
                                                <Button variant="outline" size="sm">Copy</Button>
                                            </div>
                                        </div>

                                        <Button variant="outline" className="gap-2">
                                            <Key className="h-4 w-4" />
                                            Generate New Key
                                        </Button>
                                    </div>
                                )}

                                {/* Language Section */}
                                {activeSection === 'language' && (
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h2 className="text-lg font-semibold mb-1">Language & Region</h2>
                                            <p className="text-sm text-muted-foreground">Set your preferred language</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-3 block">Language</label>
                                            <div className="grid gap-2">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => setLanguage(lang.code)}
                                                        className={cn(
                                                            'flex items-center gap-3 p-3 rounded-xl border transition-all',
                                                            language === lang.code
                                                                ? 'border-primary bg-primary/10'
                                                                : 'border-border/50 bg-muted/30 hover:border-border'
                                                        )}
                                                    >
                                                        <span className="text-xl">{lang.flag}</span>
                                                        <span className="text-sm font-medium">{lang.label}</span>
                                                        {language === lang.code && <Check className="h-4 w-4 text-primary ml-auto" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
