// src/ai/flows/troubleshoot-with-chatbot.ts
'use server';
/**
 * @fileOverview Implements the TroubleshootWithChatbot flow for querying a chatbot for ICT issue troubleshooting.
 *
 * - troubleshootWithChatbot - The function to initiate the troubleshooting process.
 * - TroubleshootWithChatbotInput - The input type for the troubleshootWithChatbot function.
 * - TroubleshootWithChatbotOutput - The return type for the troubleshootWithChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TroubleshootWithChatbotInputSchema = z.object({
  issueDescription: z.string().describe('The description of the ICT issue.'),
  itemType: z.string().describe('The type of ICT item experiencing the issue (e.g., computer, printer).'),
});
export type TroubleshootWithChatbotInput = z.infer<typeof TroubleshootWithChatbotInputSchema>;

const TroubleshootWithChatbotOutputSchema = z.object({
  solution: z.string().describe('The suggested solution to the ICT issue, based on the knowledge base.'),
});
export type TroubleshootWithChatbotOutput = z.infer<typeof TroubleshootWithChatbotOutputSchema>;

export async function troubleshootWithChatbot(input: TroubleshootWithChatbotInput): Promise<TroubleshootWithChatbotOutput> {
  return troubleshootWithChatbotFlow(input);
}

const troubleshootWithChatbotPrompt = ai.definePrompt({
  name: 'troubleshootWithChatbotPrompt',
  input: {schema: TroubleshootWithChatbotInputSchema},
  output: {schema: TroubleshootWithChatbotOutputSchema},
  prompt: `You are an ICT support chatbot, providing solutions to common issues based on a knowledge base.

  The user is experiencing the following issue with their {{itemType}}:
  {{issueDescription}}

  Provide a step-by-step solution to resolve the issue, referencing the knowledge base where possible.
  If a knowledge base solution isn't available, provide general troubleshooting steps.
  Format the output as a numbered list of instructions.
  `,
});

const troubleshootWithChatbotFlow = ai.defineFlow(
  {
    name: 'troubleshootWithChatbotFlow',
    inputSchema: TroubleshootWithChatbotInputSchema,
    outputSchema: TroubleshootWithChatbotOutputSchema,
  },
  async input => {
    const {output} = await troubleshootWithChatbotPrompt(input);
    return output!;
  }
);
