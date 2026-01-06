'use client';

export const dynamic = 'force-dynamic';

import { chatAction } from './actions';

import { useState, useRef, useEffect } from 'react';
import {
  Loader2,
  Send,
  User,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
  Code2,
  Brain,
  BookOpen,
  Zap,
  Settings2,
  PanelLeftClose,
  PanelLeft,
  Copy,
  Check,
  Search,
  Command,
  Clock,
  Star,
  Archive,
  ArchiveRestore,
} from 'lucide-react';

import AppLayout from '../app-layout';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import {
  useCollection,
  useFirebase,
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase';
import { useUser as useClerkUser, SignInButton } from '@clerk/nextjs';

import {
  collection,
  query,
  orderBy,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const modes = [
  { id: 'general', label: 'General', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'coding', label: 'Coding', icon: Code2, color: 'from-blue-500 to-cyan-500' },
  { id: 'cognitive', label: 'Memory', icon: Brain, color: 'from-emerald-500 to-teal-500' },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen, color: 'from-orange-500 to-amber-500' },
  { id: 'task', label: 'Tasks', icon: Zap, color: 'from-red-500 to-rose-500' },
] as const;

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-muted-foreground ml-2">Aether is thinking...</span>
    </div>
  );
}

// Message component with copy functionality
function ChatMessage({ message, isLast }: { message: Message; isLast: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group flex gap-3 px-4 py-4 transition-colors',
        isUser ? 'bg-transparent' : 'bg-muted/30',
        isLast && !isUser && 'animate-fade-in'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
        isUser
          ? 'bg-gradient-to-br from-accent to-purple-500'
          : 'bg-gradient-to-br from-primary to-primary/80'
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? 'You' : 'Aether'}
          </span>
          <span className="text-xs text-muted-foreground">
            just now
          </span>
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        'flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ onSuggestionClick }: { onSuggestionClick: (suggestion: string) => void }) {
  const suggestions = [
    'Help me write a React component',
    'Explain how async/await works',
    'Create a Python script to process CSV files',
    'Summarize the key concepts of machine learning',
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        I'm Aether, your AI co-pilot. I can help with coding, answer questions,
        automate tasks, and remember our conversations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(suggestion)}
            className="group p-4 text-left rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-accent/40 hover:shadow-md transition-all duration-200"
          >
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {suggestion}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<'general' | 'coding' | 'cognitive' | 'knowledge' | 'task'>('general');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'recent' | 'starred' | 'archived'>('recent');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const { firestore } = useFirebase();
  const { isLoaded, isSignedIn, user } = useClerkUser();

  const currentMode = modes.find(m => m.id === mode) || modes[0];

  /* 🔐 Require Clerk sign-in instead of anonymous sign-in */
  useEffect(() => {
    // If Clerk is loaded and user is not signed in, we could prompt sign-in UI.
    // The UI below will show a SignIn button when not signed in.
  }, [isLoaded, isSignedIn]);

  /* 📂 Sessions */
  const sessionsQuery = useMemoFirebase(
    () =>
      user
        ? query(
          collection(firestore, `users/${user?.id}/sessions`),
          orderBy('startTime', 'desc')
        )
        : null,
    [firestore, user]
  );

  const { data: sessions } = useCollection(sessionsQuery);

  const filteredSessions = sessions?.filter(s => {
    // Search filter
    const matchesSearch = s.sessionName?.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    if (activeFilter === 'starred') {
      return matchesSearch && s.isStarred === true;
    } else if (activeFilter === 'archived') {
      return matchesSearch && s.isArchived === true;
    } else {
      // Recent: show non-archived sessions
      return matchesSearch && s.isArchived !== true;
    }
  });

  /* 💬 Messages */
  const messagesQuery = useMemoFirebase(
    () =>
      user && activeSessionId
        ? query(
          collection(
            firestore,
            `users/${user?.id}/sessions/${activeSessionId}/messages`
          ),
          orderBy('createdAt')
        )
        : null,
    [firestore, user, activeSessionId]
  );

  const { data: firestoreMessages } = useCollection(messagesQuery);

  useEffect(() => {
    if (firestoreMessages) {
      setMessages(
        firestoreMessages.map((m) => ({
          role: m.isUserMessage ? 'user' : 'assistant',
          content: m.content,
        }))
      );
    } else {
      setMessages([]);
    }
  }, [firestoreMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    if (!activeSessionId && sessions?.length) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  /* ➕ New session */
  const handleNewSession = async () => {
    if (!user) return;
    const ref = collection(firestore, `users/${user?.id}/sessions`);
    const docRef = await addDocumentNonBlocking(ref, {
      startTime: serverTimestamp(),
      sessionName: `Chat ${(sessions?.length ?? 0) + 1}`,
      isStarred: false,
      isArchived: false,
    });
    if (docRef) {
      setActiveSessionId(docRef.id);
      setActiveFilter('recent'); // Switch to recent to see the new chat
    }
  };

  /* ⭐ Toggle star session */
  const handleToggleStar = async (id: string, currentStarred: boolean) => {
    if (!user) return;
    const docRef = doc(firestore, `users/${user?.id}/sessions`, id);
    updateDocumentNonBlocking(docRef, { isStarred: !currentStarred });
  };

  /* 📦 Toggle archive session */
  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    if (!user) return;
    const docRef = doc(firestore, `users/${user?.id}/sessions`, id);
    updateDocumentNonBlocking(docRef, { isArchived: !currentArchived });
    // If archiving the active session, clear selection
    if (!currentArchived && id === activeSessionId) {
      setActiveSessionId(null);
    }
  };

  /* 🗑 Delete session */
  const handleDeleteSession = async (id: string) => {
    if (!user) return;
    await deleteDocumentNonBlocking(
      doc(firestore, `users/${user?.id}/sessions`, id)
    );
    if (id === activeSessionId) setActiveSessionId(null);
  };

  /* ✉ Send message — SERVER ACTION (FINAL FIX) */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !activeSessionId) return;

    const content = input;
    setInput('');
    setIsLoading(true);

    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);

    const ref = collection(
      firestore,
      `users/${user?.id}/sessions/${activeSessionId}/messages`
    );

    await addDocumentNonBlocking(ref, {
      content,
      isUserMessage: true,
      createdAt: serverTimestamp(),
    });

    try {
      // Build authoritative history from Firestore if available, otherwise fall back to local `messages` state
      const baseHistory: Message[] =
        (firestoreMessages?.map((m) => ({
          role: (m.isUserMessage ? 'user' : 'assistant') as Message['role'],
          content: m.content,
        })) as Message[]) ?? messages;

      const cleanHistory: Message[] = [...baseHistory, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await chatAction(content, cleanHistory, mode);

      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await addDocumentNonBlocking(ref, {
        content: result.response,
        isUserMessage: false,
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Chat error',
        description: err.message || 'AI failed',
        variant: 'destructive',
      });

      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Custom styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>

      <div className="flex h-full bg-background">
        {/* Enhanced Sidebar */}
        <aside
          className={cn(
            'hidden md:flex flex-col border-r bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm transition-all duration-300 ease-in-out',
            sidebarOpen ? 'w-80' : 'w-0 overflow-hidden border-r-0'
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Conversations</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleNewSession}
              className="w-full justify-center gap-2 h-10 bg-gradient-to-r from-accent via-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-accent/25 font-medium transition-all duration-300 hover:shadow-xl hover:shadow-accent/30"
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </Button>
          </div>

          {/* Search with keyboard shortcut */}
          <div className="px-3 py-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-16 rounded-xl bg-background/80 border border-border/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 focus:bg-background transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">
                <Command className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium">K</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30">
              <button
                onClick={() => setActiveFilter('recent')}
                className={cn(
                  'flex-1 h-7 text-xs flex items-center justify-center gap-1.5 rounded-md transition-all',
                  activeFilter === 'recent'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                Recent
              </button>
              <button
                onClick={() => setActiveFilter('starred')}
                className={cn(
                  'flex-1 h-7 text-xs flex items-center justify-center gap-1.5 rounded-md transition-all',
                  activeFilter === 'starred'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Star className="h-3.5 w-3.5" />
                Starred
              </button>
              <button
                onClick={() => setActiveFilter('archived')}
                className={cn(
                  'flex-1 h-7 text-xs flex items-center justify-center gap-1.5 rounded-md transition-all',
                  activeFilter === 'archived'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </button>
            </div>
          </div>

          {/* Divider with label */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Conversations</span>
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-[10px] text-muted-foreground">{filteredSessions?.length || 0}</span>
            </div>
          </div>

          {/* Sessions List */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {filteredSessions?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                    {activeFilter === 'starred' ? (
                      <Star className="h-6 w-6 text-muted-foreground/50" />
                    ) : activeFilter === 'archived' ? (
                      <Archive className="h-6 w-6 text-muted-foreground/50" />
                    ) : (
                      <MessageSquare className="h-6 w-6 text-muted-foreground/50" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {activeFilter === 'starred'
                      ? 'No starred conversations'
                      : activeFilter === 'archived'
                        ? 'No archived conversations'
                        : 'No conversations yet'}
                  </p>
                  <p className="text-xs text-muted-foreground/70 text-center mt-1">
                    {activeFilter === 'starred'
                      ? 'Star important chats to find them here'
                      : activeFilter === 'archived'
                        ? 'Archived chats will appear here'
                        : 'Start a new chat to begin'}
                  </p>
                </div>
              )}
              {filteredSessions?.map((s, index) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200',
                    activeSessionId === s.id
                      ? 'bg-accent/10 shadow-sm'
                      : 'hover:bg-muted/40'
                  )}
                >
                  {/* Active indicator */}
                  {activeSessionId === s.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-accent to-purple-500 rounded-r-full" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                    activeSessionId === s.id
                      ? 'bg-gradient-to-br from-accent/20 to-purple-500/20 text-accent'
                      : 'bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                  )}>
                    <MessageSquare className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate transition-colors',
                      activeSessionId === s.id ? 'text-accent' : 'text-foreground'
                    )}>
                      {s.sessionName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {index === 0 ? 'Just now' : `${index + 1} days ago`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className={cn(
                    'flex items-center gap-0.5 transition-opacity',
                    activeSessionId === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-7 w-7 hover:bg-muted/80',
                        s.isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-yellow-500'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(s.id, s.isStarred || false);
                      }}
                      title={s.isStarred ? 'Unstar' : 'Star'}
                    >
                      <Star className={cn('h-3 w-3', s.isStarred && 'fill-current')} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleArchive(s.id, s.isArchived || false);
                      }}
                      title={s.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      {s.isArchived ? <ArchiveRestore className="h-3 w-3" /> : <Archive className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(s.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Sidebar Footer - Mode Quick Switch */}
          <div className="p-3 border-t border-border/50 bg-gradient-to-t from-card/60 to-transparent">
            <div className="p-2 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">Current Mode</p>
              <div className="flex items-center gap-1.5">
                {modes.slice(0, 4).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-all duration-200',
                      mode === m.id
                        ? `bg-gradient-to-r ${m.color} text-white shadow-sm`
                        : 'bg-background/50 text-muted-foreground hover:text-foreground hover:bg-background'
                    )}
                    title={m.label}
                  >
                    <m.icon className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* If Clerk is loaded and user is not signed in, prompt to sign in */}
          {isLoaded && !isSignedIn ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md p-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center mb-6 mx-auto shadow-lg shadow-accent/20">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Welcome to Aether Chat</h2>
                <p className="text-muted-foreground mb-6">Sign in to access your AI-powered conversations with persistent memory.</p>
                <SignInButton mode="modal">
                  <Button className="bg-gradient-to-r from-accent to-purple-500 hover:opacity-90">
                    Sign in to continue
                  </Button>
                </SignInButton>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="h-14 px-4 border-b flex items-center justify-between gap-4 bg-card/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hidden md:flex"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br',
                      currentMode.color
                    )}>
                      <currentMode.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold">Aether Co-pilot</h1>
                      <p className="text-xs text-muted-foreground">{currentMode.label} Mode</p>
                    </div>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50">
                    {modes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id as any)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                          mode === m.id
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <m.icon className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline">{m.label}</span>
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </header>

              {/* Messages Area */}
              {messages.length === 0 && !isLoading ? (
                <EmptyState onSuggestionClick={(suggestion) => {
                  setInput(suggestion);
                  inputRef.current?.focus();
                }} />
              ) : (
                <ScrollArea ref={scrollRef} className="flex-1">
                  <div className="max-w-4xl mx-auto">
                    {messages.map((m, i) => (
                      <ChatMessage
                        key={i}
                        message={m}
                        isLast={i === messages.length - 1}
                      />
                    ))}
                    {isLoading && (
                      <div className="px-4 py-4 bg-muted/30">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <TypingIndicator />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}

              {/* Input Area */}
              <div className="border-t bg-card/30 backdrop-blur-sm p-4">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                  <div className="relative flex items-end gap-2 p-2 rounded-2xl border border-border/60 bg-background shadow-sm focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Message Aether..."
                      rows={1}
                      className="flex-1 resize-none bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none min-h-[40px] max-h-[200px]"
                      style={{ height: 'auto' }}
                    />
                    <div className="flex items-center gap-1 pr-1">
                      <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                        <Command className="h-3 w-3" />
                        <span>Enter</span>
                      </div>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className={cn(
                          'h-9 w-9 rounded-xl transition-all duration-200',
                          input.trim()
                            ? 'bg-gradient-to-r from-accent to-purple-500 hover:opacity-90 shadow-md'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Aether can make mistakes. Consider checking important information.
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
