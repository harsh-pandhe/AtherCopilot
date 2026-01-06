'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Loader2,
  Mic,
  StopCircle,
  Sparkles,
  Code2,
  Wand2,
  Terminal,
  FileCode,
  Braces,
  Download,
  RotateCcw,
  Zap,
  ChevronDown,
} from 'lucide-react';

import AppLayout from '../app-layout';

import { generateCodeSnippet } from '@/ai/flows/voice-activated-code-generation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const removeMarkdown = (text: string) =>
  text.replace(/```[\w-]*\n/g, '').replace(/```/g, '');

const quickPrompts = [
  { icon: Braces, label: 'React Component', prompt: 'Create a React button component with primary, secondary, and outline variants using TypeScript' },
  { icon: Terminal, label: 'API Endpoint', prompt: 'Create a Next.js API route that handles GET and POST requests with error handling' },
  { icon: FileCode, label: 'Python Script', prompt: 'Create a Python script to read a CSV file and export filtered data to JSON' },
  { icon: Code2, label: 'SQL Query', prompt: 'Write a SQL query to find the top 10 customers by total order value with joins' },
];

// Voice visualization component
function VoiceWaveform({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 bg-gradient-to-t from-red-500 to-red-400 rounded-full transition-all duration-150',
            isActive ? 'animate-voice-wave' : 'h-2'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isActive ? undefined : '8px',
          }}
        />
      ))}
    </div>
  );
}

export default function CodeGeneratorPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');

  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* 🎙 Speech Recognition Setup */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: 'Browser Not Supported',
        description:
          'Your browser does not support the Web Speech API. Please try Chrome or Edge.',
        variant: 'destructive',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript((prev) => prev + finalTranscript);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const handleGenerateCode = async () => {
    if (!transcript.trim()) {
      toast({
        title: 'No command provided',
        description:
          'Please say something or type a command to generate code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setCodeSnippet('');
    setHasCopied(false);

    try {
      const result = await generateCodeSnippet({
        voiceCommand: transcript,
      });
      setCodeSnippet(removeMarkdown(result.codeSnippet));
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Code',
        description:
          'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!codeSnippet) return;

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(codeSnippet);
      } else {
        // Fallback for environments without Clipboard API
        const el = document.createElement('textarea');
        el.value = codeSnippet;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }

      setHasCopied(true);
      toast({ title: 'Code copied to clipboard!' });
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      {/* Custom styles */}
      <style jsx global>{`
        @keyframes voice-wave {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        .animate-voice-wave {
          animation: voice-wave 0.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes code-appear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-code-appear {
          animation: code-appear 0.4s ease-out;
        }
      `}</style>

      <div className="min-h-full bg-gradient-to-b from-background to-background/95 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Quantum CodeForge™</h1>
                  <p className="text-sm text-muted-foreground">Transform your ideas into production-ready code</p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Prompts */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Start Templates</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickPrompts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setTranscript(item.prompt)}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-accent/30 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent/10 to-purple-500/10 flex items-center justify-center group-hover:from-accent/20 group-hover:to-purple-500/20 transition-colors">
                    <item.icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT: COMMAND INPUT */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5">
                {/* Input Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Your Command</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {transcript && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setTranscript('')}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* Textarea */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    placeholder="Describe the code you want to generate...

Examples:
• Create a React hook for handling form validation
• Build a REST API endpoint with authentication
• Write a function to parse and validate email addresses"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    disabled={isListening}
                    className="w-full min-h-[280px] p-4 bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none resize-none"
                  />

                  {/* Voice indicator overlay */}
                  {isListening && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center animate-pulse shadow-lg shadow-red-500/30">
                        <Mic className="h-8 w-8 text-white" />
                      </div>
                      <VoiceWaveform isActive={isListening} />
                      <p className="text-sm text-muted-foreground">Listening... Speak your command</p>
                    </div>
                  )}
                </div>

                {/* Input Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2">
                    {/* Voice Button */}
                    <Button
                      onClick={toggleListening}
                      size="sm"
                      variant={isListening ? 'destructive' : 'outline'}
                      className={cn(
                        'h-9 gap-2 transition-all duration-200',
                        isListening && 'animate-pulse'
                      )}
                    >
                      {isListening ? (
                        <>
                          <StopCircle className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Voice Input
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateCode}
                    disabled={isLoading || !transcript.trim()}
                    className={cn(
                      'h-10 px-6 gap-2 font-medium transition-all duration-300',
                      transcript.trim()
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 shadow-lg shadow-blue-500/25'
                        : ''
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10">
                <Zap className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent mb-1">Pro Tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Be specific about the language, framework, and features you need. Include details like error handling, types, and edge cases for better results.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: OUTPUT */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5 flex flex-col">
              {/* Output Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Generated Code</span>
                  {codeSnippet && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-medium">
                      Ready
                    </span>
                  )}
                </div>
                {codeSnippet && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                      onClick={handleCopy}
                    >
                      {hasCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Output Content */}
              <div className="flex-1 min-h-[340px] relative">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl animate-shimmer" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Generating your code...</p>
                      <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                    </div>
                  </div>
                )}

                {codeSnippet && !isLoading && (
                  <div className="h-full animate-code-appear">
                    <pre className="h-full p-4 text-sm font-mono leading-relaxed overflow-auto bg-[#0d1117] text-[#c9d1d9]">
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {!isLoading && !codeSnippet && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <FileCode className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">No code generated yet</p>
                    <p className="text-xs text-muted-foreground/70 max-w-xs">
                      Describe what you want to build and click "Generate Code" to see the magic happen
                    </p>
                  </div>
                )}
              </div>

              {/* Output Footer - Stats */}
              {codeSnippet && !isLoading && (
                <div className="px-4 py-2 border-t border-border/50 bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{codeSnippet.split('\n').length} lines</span>
                    <span>{codeSnippet.length} characters</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/70">Generated by Aether AI</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
