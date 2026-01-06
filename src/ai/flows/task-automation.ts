// TaskAutomation flow implementation.
'use server';

/**
 * @fileOverview Task Automation AI agent.
 *
 * - automateTask - A function that automates tasks based on user description.
 * - AutomateTaskInput - The input type for the automateTask function.
 * - AutomateTaskOutput - The return type for the automateTask function.
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

const AutomateTaskInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the repetitive task to automate.'),
});
export type AutomateTaskInput = z.infer<typeof AutomateTaskInputSchema>;

const AutomateTaskOutputSchema = z.object({
  automationScript: z
    .string()
    .describe('The automation script generated for the task.'),
  explanation: z
    .string()
    .describe('Explanation of how the automation script works.'),
});
export type AutomateTaskOutput = z.infer<typeof AutomateTaskOutputSchema>;

export async function automateTask(input: AutomateTaskInput): Promise<AutomateTaskOutput> {
  return automateTaskFlow(input);
}

const automateTaskPrompt = ai.definePrompt({
  name: 'automateTaskPrompt',
  input: { schema: AutomateTaskInputSchema },
  output: { schema: AutomateTaskOutputSchema },
  prompt: `You are an AI assistant specialized in automating repetitive tasks.

  Based on the user's description of the task, generate an automation script and explain how the automation script works.

  Task Description: {{{taskDescription}}}

  Automation Script:
  \`\`\`script
  {{automationScript}}
  \`\`\`

  Explanation:
  {{explanation}}`,
});

const automateTaskFlow = ai.defineFlow(
  {
    name: 'automateTaskFlow',
    inputSchema: AutomateTaskInputSchema,
    outputSchema: AutomateTaskOutputSchema,
  },
  async input => {
    try {
      const { output } = await withRetry(() => automateTaskPrompt(input));
      return output!;
    } catch (error: any) {
      console.error('Task automation failed after retries:', error?.message);
      // Return a helpful fallback response
      return {
        automationScript: `# Unable to generate automation script at this moment.
# Please try again in a few seconds.
#
# Your task: ${input.taskDescription}
#
# In the meantime, consider breaking down your task into smaller steps.`,
        explanation: "I'm experiencing temporary connectivity issues. Please try again in a moment. If the problem persists, try simplifying your task description or breaking it into smaller parts."
      };
    }
  }
);
