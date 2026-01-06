'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  MessageCircle,
  CodeXml,
  BookOpenText,
  Bot,
  ArrowRight,
  Check,
  Globe,
  Lock,
  Cpu,
  Layers,
  Terminal,
  Wand2,
} from 'lucide-react';

// Smooth animated gradient mesh background
function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(142,68,173,0.15),rgba(255,255,255,0))]" />
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeOpacity="0.03" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// Animated orbs
function AnimatedOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-full blur-3xl animate-orb-1" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/5 to-purple-500/5 rounded-full blur-3xl animate-orb-3" />
    </div>
  );
}

// Feature pill component
function FeaturePill({ icon: Icon, text, delay }: { icon: React.ElementType; text: string; delay: number }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/40 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-card/80 transition-all duration-300 cursor-default animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="h-4 w-4 text-accent" />
      <span>{text}</span>
    </div>
  );
}

// Testimonial badge
function TrustBadge({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <Icon className="h-3 w-3 text-emerald-500" />
      </div>
      <span>{text}</span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const words = ['development', 'productivity', 'creativity', 'automation'];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/chat');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-accent to-purple-500 animate-pulse" />
            <div className="absolute inset-[2px] rounded-[10px] bg-background flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-accent to-purple-500 rounded-full animate-loading-bar" />
            </div>
            <p className="text-sm text-muted-foreground">Loading your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  const capabilities = [
    { icon: Terminal, text: 'Code Generation' },
    { icon: MessageCircle, text: 'AI Chat' },
    { icon: Wand2, text: 'Task Automation' },
    { icon: BookOpenText, text: 'Knowledge Base' },
  ];

  const features = [
    {
      icon: CodeXml,
      title: 'Quantum CodeForge™',
      description: 'Generate production-ready code with natural language or voice commands',
    },
    {
      icon: Cpu,
      title: 'Cognitive Memory Core™',
      description: 'Context-aware AI that remembers your preferences and past conversations',
    },
    {
      icon: Layers,
      title: 'Knowledge Navigator™',
      description: 'Instantly summarize, analyze, and learn from any content',
    },
    {
      icon: Bot,
      title: 'Workflow Automation',
      description: 'Describe complex workflows and get executable automation scripts',
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Custom styles */}
      <style jsx global>{`
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -40px) scale(1.1); }
        }
        @keyframes orb-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes word-slide {
          0%, 20% { transform: translateY(0); opacity: 1; }
          25%, 100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes border-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-orb-1 { animation: orb-1 20s ease-in-out infinite; }
        .animate-orb-2 { animation: orb-2 25s ease-in-out infinite; }
        .animate-orb-3 { animation: orb-3 15s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
        .animate-loading-bar { animation: loading-bar 1.5s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-border-flow {
          background-size: 300% 300%;
          animation: border-flow 4s ease infinite;
        }
      `}</style>

      <GradientMesh />
      <AnimatedOrbs />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-6 lg:px-12 py-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-semibold tracking-tight">Aether</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Features
              </a>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-sm">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent mb-8 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Now with GPT-4 & Claude Integration
            </div>

            {/* Main heading */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              The AI co-pilot for
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {words.map((word, index) => (
                    <span
                      key={word}
                      className={`absolute left-0 transition-all duration-500 ${currentWord === index
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 -translate-y-8'
                        }`}
                    >
                      {word}
                    </span>
                  ))}
                  <span className="invisible">{words[0]}</span>
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              Supercharge your workflow with AI-powered code generation, intelligent conversations,
              and seamless task automation — all in one elegant workspace.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up"
              style={{ animationDelay: '500ms' }}
            >
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-medium bg-gradient-to-r from-accent to-purple-500 hover:opacity-90 shadow-lg shadow-accent/20 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 animate-shimmer" />
                </Button>
              </SignInButton>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-medium border-border/60 hover:border-accent/40 hover:bg-accent/5"
              >
                <Globe className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Capability pills */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-fade-in-up"
              style={{ animationDelay: '600ms' }}
            >
              {capabilities.map((cap, index) => (
                <FeaturePill key={cap.text} icon={cap.icon} text={cap.text} delay={700 + index * 100} />
              ))}
            </div>

            {/* Trust indicators */}
            <div
              className="flex flex-wrap items-center justify-center gap-6 animate-fade-in-up"
              style={{ animationDelay: '900ms' }}
            >
              <TrustBadge icon={Check} text="No credit card required" />
              <TrustBadge icon={Lock} text="Enterprise-grade security" />
              <TrustBadge icon={Globe} text="Used by 10,000+ developers" />
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="w-full px-6 lg:px-12 py-16 border-t border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Everything you need to build faster
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Powerful AI capabilities designed for modern developers and teams
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-accent/30 transition-all duration-500 animate-fade-in-up cursor-default"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-accent/40 transition-all duration-300">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full px-6 lg:px-12 py-6 border-t border-border/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aether Co-Pilot. Built for developers.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
