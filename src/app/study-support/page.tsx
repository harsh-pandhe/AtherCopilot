'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useRef } from 'react';
import {
  Loader2,
  BookOpen,
  Sparkles,
  Send,
  FileText,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  BookMarked,
  GraduationCap,
  Brain,
  MessageSquare,
  ChevronRight,
  Zap,
  ScrollText,
} from 'lucide-react';

import AppLayout from '../app-layout';

import { studyAssistant, type StudyAssistantOutput } from '@/ai/flows/ai-based-study-support';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const sampleTopics = [
  { icon: Brain, label: 'Explain neural networks', category: 'AI/ML' },
  { icon: BookMarked, label: 'Summarize key points', category: 'Study' },
  { icon: Lightbulb, label: 'Give me examples', category: 'Learning' },
  { icon: GraduationCap, label: 'Quiz me on this', category: 'Test' },
];

const questionTemplates = [
  'What are the main concepts discussed?',
  'Can you explain this in simpler terms?',
  'What are the key takeaways?',
  'How does this relate to real-world applications?',
];

export default function StudySupportPage() {
  const [document, setDocument] = useState('');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StudyAssistantOutput | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'answer' | 'summary'>('answer');

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Helper function to handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    // Focus the input and optionally trigger submit if document exists
    if (document.trim()) {
      // Use setTimeout to ensure state is updated before we access it
      setTimeout(() => {
        handleSubmitWithQuery(suggestion);
      }, 0);
    } else {
      inputRef.current?.focus();
    }
  };

  // Direct submit function that takes query as parameter
  const handleSubmitWithQuery = async (queryText: string) => {
    if (!document.trim() || !queryText.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both study material and a question.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await studyAssistant({ document, query: queryText });
      setResult(response);
      setActiveTab('answer');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Getting Answer',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithQuery(query);
  };

  const handleCopy = async (text: string, type: 'answer' | 'summary') => {
    await navigator.clipboard.writeText(text);
    if (type === 'answer') {
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2000);
    } else {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
    toast({ title: 'Copied to clipboard!' });
  };

  const wordCount = document.trim().split(/\s+/).filter(Boolean).length;
  const charCount = document.length;

  return (
    <AppLayout>
      {/* Custom styles */}
      <style jsx global>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.4s ease-out;
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(16, 185, 129, 0.3); }
          50% { border-color: rgba(16, 185, 129, 0.6); }
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-full bg-gradient-to-b from-background to-background/95 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Knowledge Navigator™</h1>
                  <p className="text-sm text-muted-foreground">Transform any content into personalized learning</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            {document && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  {wordCount} words
                </span>
                <span className="flex items-center gap-1.5">
                  <ScrollText className="h-4 w-4" />
                  {charCount} chars
                </span>
              </div>
            )}
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* LEFT: INPUT - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5">
                {/* Input Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">Study Material</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {document && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setDocument('');
                          setResult(null);
                        }}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  placeholder="Paste your study material here...

This could be:
• Lecture notes or textbook excerpts
• Research papers or articles
• Documentation or tutorials
• Any text you want to learn from"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className="w-full min-h-[300px] p-4 bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none resize-none"
                />

                {/* Question Input */}
                <div className="border-t border-border/50 bg-muted/20">
                  {/* Question Templates */}
                  {!query && (
                    <div className="px-4 py-3 border-b border-border/30">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Suggested Questions</p>
                      <div className="flex flex-wrap gap-2">
                        {questionTemplates.map((template, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(template)}
                            className="px-3 py-1.5 rounded-full bg-background/80 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleGetAnswer} className="flex items-center gap-2 p-3">
                    <div className="flex-1 relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask a question about your material..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !document.trim() || !query.trim()}
                      className={cn(
                        'h-11 px-5 gap-2 font-medium transition-all duration-300',
                        document.trim() && query.trim()
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 shadow-lg shadow-emerald-500/25'
                          : ''
                      )}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Ask
                    </Button>
                  </form>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {sampleTopics.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item.label)}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-emerald-500/30 hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-colors">
                      <item.icon className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground/70">{item.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: OUTPUT - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Tabs */}
              {result && (result.answer || result.summary) && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
                  <button
                    onClick={() => setActiveTab('answer')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      activeTab === 'answer'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    Answer
                  </button>
                  {result.requiresSummary && result.summary && (
                    <button
                      onClick={() => setActiveTab('summary')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        activeTab === 'summary'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ScrollText className="h-4 w-4" />
                      Summary
                    </button>
                  )}
                </div>
              )}

              {/* Answer Card */}
              <div className={cn(
                'rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5 flex flex-col',
                result?.answer && 'animate-pulse-border'
              )}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">
                      {activeTab === 'answer' ? 'AI Answer' : 'AI Summary'}
                    </span>
                    {result?.answer && !isLoading && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-medium">
                        Ready
                      </span>
                    )}
                  </div>
                  {((activeTab === 'answer' && result?.answer) || (activeTab === 'summary' && result?.summary)) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                      onClick={() => handleCopy(
                        activeTab === 'answer' ? result?.answer || '' : result?.summary || '',
                        activeTab
                      )}
                    >
                      {(activeTab === 'answer' ? copiedAnswer : copiedSummary) ? (
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
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-h-[400px] p-4">
                  {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Analyzing your material...</p>
                        <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                      </div>
                    </div>
                  )}

                  {!isLoading && activeTab === 'answer' && result?.answer && (
                    <div className="animate-fade-up">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {result.answer}
                      </p>
                    </div>
                  )}

                  {!isLoading && activeTab === 'summary' && result?.summary && (
                    <div className="animate-fade-up">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {result.summary}
                      </p>
                    </div>
                  )}

                  {!isLoading && !result && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                        <Lightbulb className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Ready to help you learn</p>
                      <p className="text-xs text-muted-foreground/70 max-w-xs">
                        Paste your study material, ask a question, and get instant AI-powered answers
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <Zap className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-500 mb-1">Study Tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Try asking follow-up questions to deepen your understanding. You can also ask for examples, comparisons, or practical applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
