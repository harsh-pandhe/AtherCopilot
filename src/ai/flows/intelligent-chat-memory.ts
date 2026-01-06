'use server';

/**
 * Intelligent Chat Memory Flow
 * Safely processes chat history and maintains conversational context.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Retry helper with exponential backoff
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

      const isRetryable =
        errorMessage.includes('503') ||
        errorMessage.includes('overloaded') ||
        errorMessage.includes('429') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('ECONNRESET') ||
        errorMessage.includes('timeout');

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt);
      console.log(`API call failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/* -------------------- SCHEMAS -------------------- */

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const IntelligentChatMemoryInputSchema = z.object({
  message: z.string().describe('The current message from the user.'),
  chatHistory: z
    .array(ChatMessageSchema)
    .optional()
    .describe('Previous conversation messages.'),
  mode: z
    .enum(['general', 'coding', 'cognitive', 'knowledge', 'task'])
    .optional()
    .describe('Operational mode to tailor assistant behavior.'),
});

export type IntelligentChatMemoryInput = z.infer<
  typeof IntelligentChatMemoryInputSchema
>;

const IntelligentChatMemoryOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response."),
});

export type IntelligentChatMemoryOutput = z.infer<
  typeof IntelligentChatMemoryOutputSchema
>;

/* -------------------- PROMPT -------------------- */

const prompt = ai.definePrompt({
  name: 'intelligentChatMemoryPrompt',
  input: {
    schema: z.object({
      message: z.string(),
      chatHistory: z.array(
        z.object({
          content: z.string(),
          isUser: z.boolean(),
        })
      ),
      mode: z.string().optional(),
    }),
  },
  output: { schema: IntelligentChatMemoryOutputSchema },
  prompt: `
You are a helpful, intelligent AI assistant.
Use the chat history to maintain context.

Mode: {{mode}}

Behavior guidance:
- If Mode is 'coding': act as a coding assistant. Provide runnable code snippets, explain design decisions, and include tests or examples when helpful.
- If Mode is 'cognitive': focus on memory, summarization, and recalling prior details from the conversation.
- If Mode is 'knowledge': prioritize factual answers and provide sources or citations where possible.
- If Mode is 'task': provide step-by-step actionable plans, checklists, and commands the user can run to automate tasks.
- Otherwise, be general and concise.

Chat History:
{{#each chatHistory}}
{{#if this.isUser}}
User: {{this.content}}
{{else}}
Assistant: {{this.content}}
{{/if}}
{{/each}}

Current User Message:
{{message}}

Respond clearly and helpfully:
`,
});

/* -------------------- FLOW -------------------- */

export async function intelligentChatMemory(
  input: IntelligentChatMemoryInput
): Promise<IntelligentChatMemoryOutput> {
  return intelligentChatMemoryFlow(input);
}

const intelligentChatMemoryFlow = ai.defineFlow(
  {
    name: 'intelligentChatMemoryFlow',
    inputSchema: IntelligentChatMemoryInputSchema,
    outputSchema: IntelligentChatMemoryOutputSchema,
  },
  async (input) => {
    // ✅ DERIVE isUser HERE (NOT IN UI)
    const normalizedHistory =
      input.chatHistory?.map((m) => ({
        content: m.content,
        isUser: m.role === 'user',
      })) ?? [];

    try {
      const { output } = await withRetry(() => prompt({
        message: input.message,
        chatHistory: normalizedHistory,
        mode: input.mode || 'general',
      }));

      return output!;
    } catch (error: any) {
      console.error('Chat response failed after retries:', error?.message);
      // Return a helpful fallback response
      return {
        response: "I'm having trouble connecting right now. Please try again in a moment. If the issue persists, try refreshing the page."
      };
    }
  }
);
