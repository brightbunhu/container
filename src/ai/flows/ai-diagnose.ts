// src/ai/flows/ai-diagnose.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered diagnosis to suggest reusable parts based on item specifications and issue descriptions.
 *
 * - aiDiagnose - A function that takes item specifications and issue descriptions as input and returns a list of suggested reusable parts.
 * - AIDiagnoseInput - The input type for the aiDiagnose function.
 * - AIDiagnoseOutput - The return type for the aiDiagnose function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDiagnoseInputSchema = z.object({
  itemSpecs: z.record(z.any()).describe('Specifications of the ICT item, including CPU, RAM, storage, model, and serial number.'),
  issueDescription: z.string().describe('Detailed description of the issue encountered with the ICT item.'),
});
export type AIDiagnoseInput = z.infer<typeof AIDiagnoseInputSchema>;

const AIDiagnoseOutputSchema = z.object({
  suggestedReusableParts: z
    .array(z.string())
    .describe('List of suggested reusable part IDs that could be used for repair.'),
  suspectedCauses: z.array(z.string()).describe('List of suspected causes of the issue.'),
  troubleshootingSteps: z.array(z.string()).describe('List of troubleshooting steps.'),
});
export type AIDiagnoseOutput = z.infer<typeof AIDiagnoseOutputSchema>;

export async function aiDiagnose(input: AIDiagnoseInput): Promise<AIDiagnoseOutput> {
  return aiDiagnoseFlow(input);
}

const aiDiagnosePrompt = ai.definePrompt({
  name: 'aiDiagnosePrompt',
  input: {schema: AIDiagnoseInputSchema},
  output: {schema: AIDiagnoseOutputSchema},
  prompt: `You are an AI assistant that analyzes ICT item specifications and issue descriptions to suggest reusable parts for repair.

Analyze the following item specifications and issue description to determine potential reusable parts, suspected causes, and troubleshooting steps.

Item Specifications:
{{#each itemSpecs}}
  {{@key}}: {{this}}
{{/each}}

Issue Description: {{{issueDescription}}}

Based on your analysis, provide a list of suggested reusable part IDs, suspected causes, and troubleshooting steps.
`,
});

const aiDiagnoseFlow = ai.defineFlow(
  {
    name: 'aiDiagnoseFlow',
    inputSchema: AIDiagnoseInputSchema,
    outputSchema: AIDiagnoseOutputSchema,
  },
  async input => {
    const {output} = await aiDiagnosePrompt(input);
    return output!;
  }
);
