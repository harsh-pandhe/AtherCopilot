'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState } from 'react';
import {
  Check,
  Copy,
  Loader2,
  Bot,
  Sparkles,
  Play,
  Clock,
  Mail,
  FolderSync,
  Database,
  FileSpreadsheet,
  RotateCcw,
  Download,
  Terminal,
  Lightbulb,
  Zap,
  ChevronDown,
  Workflow,
  Cog,
  AlertCircle,
} from 'lucide-react';

import AppLayout from '../app-layout';

import { automateTask, type AutomateTaskOutput } from '@/ai/flows/task-automation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const removeMarkdown = (text: string) =>
  text.replace(/```[\w-]*\n/g, '').replace(/```/g, '');

const automationTemplates = [
  {
    icon: Mail,
    label: 'Email Processing',
    description: 'Sort, filter, and respond to emails',
    prompt: 'Every day at 9 AM, scan my unread emails for invoices and save attachments to an "Invoices" folder, then send me a summary.'
  },
  {
    icon: FileSpreadsheet,
    label: 'Data Entry',
    description: 'Automate spreadsheet tasks',
    prompt: 'When a new row is added to my Google Sheet, validate the data, format it, and create a PDF report.'
  },
  {
    icon: FolderSync,
    label: 'File Organization',
    description: 'Auto-sort and backup files',
    prompt: 'Monitor my Downloads folder and automatically organize files by type into subfolders (Documents, Images, Videos, etc.).'
  },
  {
    icon: Database,
    label: 'Database Sync',
    description: 'Keep data in sync',
    prompt: 'Every hour, sync data between my PostgreSQL database and Airtable, handling conflicts by keeping the most recent version.'
  },
];

const triggerTypes = [
  { id: 'schedule', label: 'Scheduled', icon: Clock },
  { id: 'event', label: 'Event-based', icon: Zap },
  { id: 'manual', label: 'Manual', icon: Play },
];

export default function TaskAutomationPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AutomateTaskOutput | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'explanation'>('script');
  const [selectedTrigger, setSelectedTrigger] = useState('schedule');

  const { toast } = useToast();

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please describe the task you want to automate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setHasCopied(false);

    try {
      const response = await automateTask({ taskDescription });
      setResult(response);
      setActiveTab('script');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Script',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.automationScript) {
      await navigator.clipboard.writeText(removeMarkdown(result.automationScript));
      setHasCopied(true);
      toast({ title: 'Script copied to clipboard!' });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.5); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-full bg-gradient-to-b from-background to-background/95 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Task Automation</h1>
                  <p className="text-sm text-muted-foreground">Transform repetitive tasks into automated workflows</p>
                </div>
              </div>
            </div>

            {/* Trigger Type Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trigger:</span>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50">
                {triggerTypes.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => setSelectedTrigger(trigger.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                      selectedTrigger === trigger.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <trigger.icon className="h-3.5 w-3.5" />
                    {trigger.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Automation Templates */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Popular Automation Templates</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {automationTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setTaskDescription(template.prompt)}
                  className="group flex flex-col items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-orange-500/30 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-colors">
                    <template.icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{template.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* LEFT: INPUT - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5">
                {/* Input Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Describe Your Task</span>
                  </div>
                  {taskDescription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setTaskDescription('');
                        setResult(null);
                      }}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Textarea */}
                <form onSubmit={handleGenerateScript}>
                  <textarea
                    placeholder="Describe the task you want to automate...

Be specific about:
• When should it run? (schedule, trigger, event)
• What data or files are involved?
• What actions should be performed?
• What's the expected outcome?"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full min-h-[280px] p-4 bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none resize-none"
                  />

                  {/* Input Footer */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Cog className="h-3.5 w-3.5" />
                      <span>AI-powered script generation</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !taskDescription.trim()}
                      className={cn(
                        'h-10 px-5 gap-2 font-medium transition-all duration-300',
                        taskDescription.trim()
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 shadow-lg shadow-orange-500/25'
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
                          Generate Script
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Tips */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-500 mb-1">Automation Tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Include error handling requirements and what should happen when things go wrong. The more context you provide, the more robust your automation will be.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: OUTPUT - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              {/* Tabs */}
              {result && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
                  <button
                    onClick={() => setActiveTab('script')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      activeTab === 'script'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Terminal className="h-4 w-4" />
                    Script
                  </button>
                  <button
                    onClick={() => setActiveTab('explanation')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      activeTab === 'explanation'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Explanation
                  </button>
                </div>
              )}

              {/* Output Card */}
              <div className={cn(
                'rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5 flex flex-col',
                result?.automationScript && activeTab === 'script' && 'animate-glow'
              )}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    {activeTab === 'script' ? (
                      <Terminal className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium">
                      {activeTab === 'script' ? 'Automation Script' : 'How It Works'}
                    </span>
                    {result && !isLoading && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-medium">
                        Ready
                      </span>
                    )}
                  </div>
                  {result?.automationScript && activeTab === 'script' && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                        onClick={handleCopy}
                      >
                        {hasCopied ? (
                          <>
                            <Check className="h-3 w-3 text-orange-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                      >
                        <Download className="h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-h-[400px]">
                  {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center gap-4 p-8">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl animate-shimmer" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Building your automation...</p>
                        <p className="text-xs text-muted-foreground mt-1">Analyzing task requirements and generating script</p>
                      </div>
                    </div>
                  )}

                  {!isLoading && activeTab === 'script' && result?.automationScript && (
                    <div className="h-full animate-fade-up">
                      <pre className="h-full p-4 text-sm font-mono leading-relaxed overflow-auto bg-[#0d1117] text-[#c9d1d9]">
                        <code>{removeMarkdown(result.automationScript)}</code>
                      </pre>
                    </div>
                  )}

                  {!isLoading && activeTab === 'explanation' && result?.explanation && (
                    <div className="p-4 animate-fade-up">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {result.explanation}
                      </p>
                    </div>
                  )}

                  {!isLoading && !result && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                        <Bot className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Ready to automate</p>
                      <p className="text-xs text-muted-foreground/70 max-w-xs">
                        Describe your repetitive task and get a ready-to-use automation script with detailed explanation
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Stats */}
                {result?.automationScript && !isLoading && activeTab === 'script' && (
                  <div className="px-4 py-2 border-t border-border/50 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{removeMarkdown(result.automationScript).split('\n').length} lines</span>
                      <span>{removeMarkdown(result.automationScript).length} characters</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70">Generated by Aether AI</span>
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
