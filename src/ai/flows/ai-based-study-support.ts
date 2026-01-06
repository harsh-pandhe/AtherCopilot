'use server';

/**
 * @fileOverview Provides AI-based study support by summarizing content and answering questions.
 *
 * - studyAssistant - A function that handles study assistance.
 * - StudyAssistantInput - The input type for the studyAssistant function.
 * - StudyAssistantOutput - The return type for the studyAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Retry helper with exponential backoff for handling transient API errors
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message || '';

      // Only retry on 503 (overloaded) or 429 (rate limit) errors
      const isRetryable =
        errorMessage.includes('503') ||
        errorMessage.includes('overloaded') ||
        errorMessage.includes('429') ||
        errorMessage.includes('rate limit');

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.log(`API call failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

const StudyAssistantInputSchema = z.object({
  query: z.string().describe('The question asked by the student.'),
  document: z.string().describe('The document content to study.'),
});

export type StudyAssistantInput = z.infer<typeof StudyAssistantInputSchema>;

const StudyAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  requiresSummary: z.boolean().describe('Whether the question requires summarization of the document to answer.'),
  summary: z.string().optional().describe('A summary of the document, if the question requires it.'),
});

export type StudyAssistantOutput = z.infer<typeof StudyAssistantOutputSchema>;

export async function studyAssistant(input: StudyAssistantInput): Promise<StudyAssistantOutput> {
  return studyAssistantFlow(input);
}

const requiresSummaryPrompt = ai.definePrompt({
  name: 'requiresSummaryPrompt',
  input: { schema: StudyAssistantInputSchema },
  output: { schema: z.object({ requiresSummary: z.boolean() }) },
  prompt: `You are an AI study assistant. Determine if the following question requires a summary of the document to answer it. Return true if a summary is required, false otherwise.\n\nQuestion: {{{query}}}\nDocument: {{{document}}}`,
});

const summaryPrompt = ai.definePrompt({
  name: 'summaryPrompt',
  input: { schema: StudyAssistantInputSchema },
  output: { schema: z.object({ summary: z.string() }) },
  prompt: `You are an AI study assistant. Summarize the following document.\n\nDocument: {{{document}}}`,
});

const answerPrompt = ai.definePrompt({
  name: 'answerPrompt',
  input: { schema: z.object({ query: z.string(), document: z.string(), summary: z.string().optional() }) },
  output: { schema: z.object({ answer: z.string() }) },
  prompt: `You are an AI study assistant. Answer the following question using the provided document and summary if available.\n\nQuestion: {{{query}}}\nDocument: {{{document}}}\nSummary: {{{summary}}}`,
});

const studyAssistantFlow = ai.defineFlow(
  {
    name: 'studyAssistantFlow',
    inputSchema: StudyAssistantInputSchema,
    outputSchema: StudyAssistantOutputSchema,
  },
  async input => {
    try {
      const requiresResp = await withRetry(() => requiresSummaryPrompt(input));
      const requiresSummary = requiresResp?.output?.requiresSummary ?? false;

      let summary: string | undefined = undefined;
      if (requiresSummary) {
        const summaryResp = await withRetry(() => summaryPrompt(input));
        const generatedSummary = summaryResp?.output?.summary ?? undefined;
        summary = generatedSummary;
      }

      const answerResp = await withRetry(() => answerPrompt({
        query: input.query,
        document: input.document,
        summary,
      }));
      const answer = answerResp?.output?.answer ?? '';

      return {
        answer,
        requiresSummary,
        summary,
      };
    } catch (error: any) {
      console.error('Study assistant failed after retries:', error?.message);
      // Return a helpful fallback response
      return {
        answer: "I'm having trouble processing your request right now. Please try again in a moment. If the issue persists, try with a shorter document or a more specific question.",
        requiresSummary: false,
        summary: undefined,
      };
    }
  }
);
