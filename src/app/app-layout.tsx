'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import {
  LayoutDashboard,
  MessageCircle,
  CodeXml,
  BookOpenText,
  Bot,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Crown,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    href: '/chat',
    label: 'Chat',
    icon: MessageCircle,
    description: 'AI conversations',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    href: '/code-generator',
    label: 'Code Generator',
    icon: CodeXml,
    description: 'Generate code snippets',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/study-support',
    label: 'Study Support',
    icon: BookOpenText,
    description: 'Learn & summarize',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    href: '/task-automation',
    label: 'Task Automation',
    icon: Bot,
    description: 'Automate workflows',
    gradient: 'from-orange-500 to-amber-500',
  },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="flex h-screen bg-background">
      {/* Enhanced Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-[280px] md:flex md:flex-col md:border-r border-border/50 bg-gradient-to-b from-card via-card to-card/95">
        {/* Logo Section */}
        <div className="p-5 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-accent/25 group-hover:shadow-xl group-hover:shadow-accent/30 transition-all duration-300 group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-accent to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight group-hover:text-accent transition-colors">Aether</h1>
              <p className="text-[11px] text-muted-foreground">AI Co-Pilot</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200',
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-accent to-purple-500 rounded-r-full" />
                )}

                {/* Icon container */}
                <div className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200',
                  active
                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-md`
                    : 'bg-muted/50 group-hover:bg-muted'
                )}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Label & description */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-medium truncate transition-colors',
                    active ? 'text-accent' : 'text-foreground'
                  )}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className={cn(
                  'h-4 w-4 transition-all duration-200',
                  active
                    ? 'opacity-100 text-accent'
                    : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                )} />
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-4 mx-3 h-px bg-border/50" />

          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Support
          </p>

          <Link
            href="/settings"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
              <Settings className="h-4 w-4" />
            </div>
            <span>Settings</span>
          </Link>

          <Link
            href="/help"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
              <HelpCircle className="h-4 w-4" />
            </div>
            <span>Help & Support</span>
          </Link>
        </nav>

        {/* Upgrade Card */}
        <div className="p-3">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 p-4">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-accent">Upgrade to Pro</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                Get unlimited access to all AI features and priority support.
              </p>
              <Button size="sm" className="w-full h-8 text-xs bg-gradient-to-r from-accent to-purple-500 hover:opacity-90 shadow-md shadow-accent/20">
                <Zap className="h-3 w-3 mr-1.5" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-md">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.firstName || 'User'}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
              </p>
            </div>
            <SignOutButton>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all">
                <LogOut className="h-4 w-4" />
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed inset-x-0 top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold">Aether</span>
          </div>
          <div className="flex items-center gap-1">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    active ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-[280px] pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
