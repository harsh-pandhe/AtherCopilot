'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating code snippets from voice commands.
 *
 * The flow takes a natural language description of the desired code as input and returns the generated code snippet.
 *
 * @interface VoiceActivatedCodeGenerationInput - Defines the input schema for the flow.
 * @interface VoiceActivatedCodeGenerationOutput - Defines the output schema for the flow.
 * @function generateCodeSnippet - The main function that triggers the code generation flow.
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

      // Retry on transient errors
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

const VoiceActivatedCodeGenerationInputSchema = z.object({
  voiceCommand: z.string().describe('A natural language description of the desired code snippet.'),
});

export type VoiceActivatedCodeGenerationInput = z.infer<typeof VoiceActivatedCodeGenerationInputSchema>;

const VoiceActivatedCodeGenerationOutputSchema = z.object({
  codeSnippet: z.string().describe('The generated code snippet.'),
});

export type VoiceActivatedCodeGenerationOutput = z.infer<typeof VoiceActivatedCodeGenerationOutputSchema>;

export async function generateCodeSnippet(input: VoiceActivatedCodeGenerationInput): Promise<VoiceActivatedCodeGenerationOutput> {
  return voiceActivatedCodeGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceActivatedCodeGenerationPrompt',
  input: { schema: VoiceActivatedCodeGenerationInputSchema },
  output: { schema: VoiceActivatedCodeGenerationOutputSchema },
  prompt: `You are an expert code generator.  The user will provide a voice command which describes the code they want you to generate.

Voice Command: {{{voiceCommand}}}

Generate the code snippet that satisfies the voice command. Enclose code snippet with markdown code fences.
`,
});

const voiceActivatedCodeGenerationFlow = ai.defineFlow(
  {
    name: 'voiceActivatedCodeGenerationFlow',
    inputSchema: VoiceActivatedCodeGenerationInputSchema,
    outputSchema: VoiceActivatedCodeGenerationOutputSchema,
  },
  async input => {
    try {
      const { output } = await withRetry(() => prompt(input));
      return output!;
    } catch (error: any) {
      console.error('Code generation failed after retries:', error?.message);
      // Return a helpful fallback response instead of throwing
      return {
        codeSnippet: `// Unable to generate code at this moment.
// Please try again in a few seconds.
//
// Your request: ${input.voiceCommand}
//
// Tip: Try breaking down your request into smaller, more specific parts.`
      };
    }
  }
);
