// src/ai/flows/answer-questions-from-kb.ts
'use server';
/**
 * @fileOverview Implements the AnswerQuestionsFromKb flow for querying the knowledge base (KB) to answer user questions.
 *
 * - answerQuestionsFromKb - The function to initiate the question answering process.
 * - AnswerQuestionsFromKbInput - The input type for the answerQuestionsFromKb function.
 * - AnswerQuestionsFromKbOutput - The return type for the answerQuestionsFromKb function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromKbInputSchema = z.object({
  question: z.string().describe('The question to be answered using the knowledge base.'),
});
export type AnswerQuestionsFromKbInput = z.infer<typeof AnswerQuestionsFromKbInputSchema>;

const AnswerQuestionsFromKbOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, based on the knowledge base.'),
});
export type AnswerQuestionsFromKbOutput = z.infer<typeof AnswerQuestionsFromKbOutputSchema>;

export async function answerQuestionsFromKb(input: AnswerQuestionsFromKbInput): Promise<AnswerQuestionsFromKbOutput> {
  return answerQuestionsFromKbFlow(input);
}

const answerQuestionsFromKbPrompt = ai.definePrompt({
  name: 'answerQuestionsFromKbPrompt',
  input: {schema: AnswerQuestionsFromKbInputSchema},
  output: {schema: AnswerQuestionsFromKbOutputSchema},
  prompt: `You are an ICT support chatbot, providing answers to questions based on a knowledge base.

  The user is asking the following question:
  {{question}}

  Provide a step-by-step answer to resolve the question, referencing the knowledge base where possible.
  If a knowledge base solution isn't available, state that no solution is available within the existing knowledge base.
  `,
});

const answerQuestionsFromKbFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromKbFlow',
    inputSchema: AnswerQuestionsFromKbInputSchema,
    outputSchema: AnswerQuestionsFromKbOutputSchema,
  },
  async input => {
    const {output} = await answerQuestionsFromKbPrompt(input);
    return output!;
  }
);
