'use client';

import { useState } from 'react';
import {
    HelpCircle,
    Search,
    Book,
    MessageCircle,
    Video,
    FileText,
    ChevronRight,
    ChevronDown,
    ExternalLink,
    Mail,
    Github,
    Twitter,
    Sparkles,
    Zap,
    Shield,
    Code,
    Bot,
    Mic,
    BookOpen,
    Clock,
} from 'lucide-react';

import AppLayout from '../app-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    { id: 'features', label: 'Features', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Code, color: 'from-orange-500 to-amber-500' },
];

const faqs = [
    {
        category: 'getting-started',
        questions: [
            {
                q: 'How do I get started with Aether Co-Pilot?',
                a: 'Simply sign in with your account, and you\'ll be taken to the dashboard. From there, you can access all features including AI Chat, Code Generator, Study Support, and Task Automation.',
            },
            {
                q: 'What AI model powers Aether Co-Pilot?',
                a: 'Aether Co-Pilot is powered by advanced language models through Google\'s Genkit framework, providing state-of-the-art natural language understanding and generation capabilities.',
            },
            {
                q: 'Is my data secure?',
                a: 'Yes! We use Firebase for secure authentication and data storage. Your conversations and generated content are encrypted and only accessible to you.',
            },
        ],
    },
    {
        category: 'features',
        questions: [
            {
                q: 'What is the Chat feature?',
                a: 'The Chat feature provides an intelligent conversation interface with memory. It remembers context from your previous messages to provide more relevant and personalized responses.',
            },
            {
                q: 'How does Voice-Activated Code Generation work?',
                a: 'Simply click the microphone button and speak your code requirements. Our AI will convert your voice input into working code in your preferred programming language.',
            },
            {
                q: 'What is Task Automation?',
                a: 'Task Automation helps you create scripts to automate repetitive tasks. Describe what you want to automate, and the AI will generate a working script with explanations.',
            },
        ],
    },
    {
        category: 'security',
        questions: [
            {
                q: 'How is my data protected?',
                a: 'We use industry-standard encryption for data in transit and at rest. Authentication is handled by Clerk, a trusted identity management platform.',
            },
            {
                q: 'Can I delete my data?',
                a: 'Yes, you can request data deletion from the Settings page. This will permanently remove all your conversations and generated content.',
            },
        ],
    },
    {
        category: 'troubleshooting',
        questions: [
            {
                q: 'Why is the AI response slow?',
                a: 'Response times can vary based on the complexity of your request and server load. For faster responses, try breaking complex requests into smaller parts.',
            },
            {
                q: 'What if the generated code doesn\'t work?',
                a: 'AI-generated code should be reviewed and tested before use. You can provide feedback or refine your prompt to get better results.',
            },
        ],
    },
];

const quickLinks = [
    { icon: Book, label: 'Documentation', href: '#', color: 'text-blue-500' },
    { icon: Video, label: 'Video Tutorials', href: '#', color: 'text-red-500' },
    { icon: MessageCircle, label: 'Community Forum', href: '#', color: 'text-green-500' },
    { icon: FileText, label: 'Release Notes', href: '#', color: 'text-purple-500' },
];

const contactMethods = [
    { icon: Mail, label: 'Email Support', value: 'support@aether-copilot.com', href: 'mailto:support@aether-copilot.com' },
    { icon: Github, label: 'GitHub Issues', value: 'Report a bug', href: '#' },
    { icon: Twitter, label: 'Twitter', value: '@AetherCoPilot', href: '#' },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('getting-started');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    const currentFaqs = faqs.find(f => f.category === activeCategory)?.questions || [];

    const filteredFaqs = searchQuery
        ? faqs.flatMap(f => f.questions).filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : currentFaqs;

    return (
        <AppLayout>
            <div className="min-h-full bg-gradient-to-b from-background to-background/95 p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 mx-auto">
                            <HelpCircle className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Help Center</h1>
                            <p className="text-sm text-muted-foreground mt-1">Find answers, learn features, and get support</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for help..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/80 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/80 hover:bg-card hover:border-border hover:shadow-lg transition-all"
                            >
                                <link.icon className={cn('h-5 w-5', link.color)} />
                                <span className="text-sm font-medium">{link.label}</span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Categories Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden p-2">
                                <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Categories</p>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setActiveCategory(category.id);
                                            setSearchQuery('');
                                        }}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                                            activeCategory === category.id && !searchQuery
                                                ? 'bg-gradient-to-r text-white ' + category.color
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        )}
                                    >
                                        <category.icon className="h-4 w-4" />
                                        {category.label}
                                    </button>
                                ))}
                            </div>

                            {/* Feature Guides */}
                            <div className="mt-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden p-4 space-y-3">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Feature Guides</p>
                                {[
                                    { icon: MessageCircle, label: 'AI Chat', href: '/chat' },
                                    { icon: Code, label: 'Code Generator', href: '/code-generator' },
                                    { icon: BookOpen, label: 'Study Support', href: '/study-support' },
                                    { icon: Bot, label: 'Task Automation', href: '/task-automation' },
                                ].map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                        <ChevronRight className="h-3 w-3 ml-auto" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Content */}
                        <div className="lg:col-span-3 space-y-4">
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
                                    <h2 className="font-semibold">
                                        {searchQuery ? `Search Results (${filteredFaqs.length})` : `Frequently Asked Questions`}
                                    </h2>
                                </div>

                                <div className="divide-y divide-border/50">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.map((faq, index) => (
                                            <div key={index} className="px-6">
                                                <button
                                                    onClick={() => setExpandedFaq(expandedFaq === faq.q ? null : faq.q)}
                                                    className="w-full flex items-start gap-3 py-4 text-left"
                                                >
                                                    <div className={cn(
                                                        'h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                                                        expandedFaq === faq.q ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                    )}>
                                                        <ChevronDown className={cn(
                                                            'h-3 w-3 transition-transform',
                                                            expandedFaq === faq.q && 'rotate-180'
                                                        )} />
                                                    </div>
                                                    <span className="text-sm font-medium">{faq.q}</span>
                                                </button>
                                                {expandedFaq === faq.q && (
                                                    <div className="pb-4 pl-8">
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-6 py-12 text-center">
                                            <HelpCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                            <p className="text-sm font-medium text-muted-foreground">No results found</p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Support */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
                                    <h2 className="font-semibold">Still need help?</h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Can't find what you're looking for? Reach out to us through any of these channels.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {contactMethods.map((method, index) => (
                                            <a
                                                key={index}
                                                href={method.href}
                                                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors text-center"
                                            >
                                                <method.icon className="h-6 w-6 text-muted-foreground" />
                                                <span className="text-sm font-medium">{method.label}</span>
                                                <span className="text-xs text-muted-foreground">{method.value}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Response Time */}
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                <Clock className="h-5 w-5 text-indigo-500" />
                                <div>
                                    <p className="text-sm font-medium text-indigo-500">Average Response Time</p>
                                    <p className="text-xs text-muted-foreground">We typically respond within 24 hours for email inquiries.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
