"use client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { useState, useRef } from "react";
import { Loader2, BookOpen, Send, FileText, ScrollText, Sparkles } from "lucide-react";

import AppLayout from "../app-layout";
import { studyAssistant, type StudyAssistantOutput } from "@/ai/flows/ai-based-study-support";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const questionTemplates = [
  "What are the main concepts discussed?",
  "Can you explain this in simpler terms?",
  "What are the key takeaways?",
  "How does this relate to real-world applications?",
];

export default function StudySupportPage() {
  const [document, setDocument] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StudyAssistantOutput | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<"answer" | "summary">("answer");

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (document.trim()) {
      setTimeout(() => handleSubmitWithQuery(suggestion), 0);
    } else {
      inputRef.current?.focus();
    }
  };

  const handleSubmitWithQuery = async (queryText: string) => {
    if (!document.trim() || !queryText.trim()) {
      toast({ title: "Missing Information", description: "Please provide both study material and a question.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await studyAssistant({ document, query: queryText });
      setResult(response);
      setActiveTab("answer");
    } catch (error) {
      console.error(error);
      toast({ title: "Error Getting Answer", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithQuery(query);
  };

  const handleCopy = async (text: string, type: "answer" | "summary") => {
    await navigator.clipboard.writeText(text);
    if (type === "answer") {
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2000);
    } else {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
    toast({ title: "Copied to clipboard!" });
  };

  const wordCount = document.trim().split(/\s+/).filter(Boolean).length;
  const charCount = document.length;

  return (
    <AppLayout>
      <style jsx global>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 0.4s ease-out; }
      `}</style>

      <div className="min-h-full bg-gradient-to-b from-background to-background/95 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Knowledge Navigator™</h1>
              <p className="text-sm text-muted-foreground">Transform any content into personalized learning</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">Study Material</span>
                  </div>
                  <div>
                    {document && (
                      <Button variant="ghost" size="sm" onClick={() => { setDocument(""); setResult(null); }}>
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                <textarea
                  placeholder={`Paste your study material here...\n\nThis could be:\n• Lecture notes or textbook excerpts\n• Research papers or articles\n• Documentation or tutorials\n• Any text you want to learn from`}
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className="w-full min-h-[300px] p-4 bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none resize-none"
                />

                <div className="border-t border-border/50 bg-muted/20">
                  {!query && (
                    <div className="px-4 py-3 border-b border-border/30">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Suggested Questions</p>
                      <div className="flex flex-wrap gap-2">
                        {questionTemplates.map((template, i) => (
                          <button key={i} onClick={() => handleSuggestionClick(template)} className="px-3 py-1.5 rounded-full bg-background/80 border border-border/50 text-xs text-muted-foreground">
                            {template}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleGetAnswer} className="flex items-center gap-2 p-3">
                    <div className="flex-1 relative">
                      <input ref={inputRef} type="text" placeholder="Ask a question about your material..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full h-11 pl-4 pr-4 rounded-xl bg-background border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none" />
                    </div>
                    <Button type="submit" disabled={isLoading || !document.trim() || !query.trim()} className={cn('h-11 px-5 gap-2 font-medium', document.trim() && query.trim() ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : '')}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Ask
                    </Button>
                  </form>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3"></div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {result && (result.answer || result.summary) && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
                  <button onClick={() => setActiveTab('answer')} className={cn('flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium', activeTab === 'answer' ? 'bg-background text-foreground' : 'text-muted-foreground')}> <Sparkles className="h-4 w-4" /> Answer</button>
                  {result.requiresSummary && result.summary && (
                    <button onClick={() => setActiveTab('summary')} className={cn('flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium', activeTab === 'summary' ? 'bg-background text-foreground' : 'text-muted-foreground')}><ScrollText className="h-4 w-4" /> Summary</button>
                  )}
                </div>
              )}

              {result ? (
                <div className="rounded-2xl border border-border/50 bg-card/80 p-4">
                  {activeTab === 'answer' && (
                    <div>
                      <div className="prose max-w-none text-sm mb-4 whitespace-pre-wrap">{result.answer}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleCopy(result.answer, 'answer')}>{copiedAnswer ? 'Copied' : 'Copy Answer'}</Button>
                      </div>
                    </div>
                  )}
                  {activeTab === 'summary' && result.summary && (
                    <div>
                      <div className="prose max-w-none text-sm mb-4 whitespace-pre-wrap">{result.summary}</div>
                      <Button variant="outline" onClick={() => handleCopy(result.summary!, 'summary')}>{copiedSummary ? 'Copied' : 'Copy Summary'}</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-border/50 bg-card/80 p-6 text-center text-sm text-muted-foreground">Provide study material and ask a question to get started.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
