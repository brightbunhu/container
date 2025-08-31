'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered diagnosis to suggest reusable parts based on item specifications and issue descriptions.
 *
 * - aiPoweredDiagnosis - A function that takes item specifications and issue descriptions as input and returns a list of suggested reusable parts.
 * - AIPoweredDiagnosisInput - The input type for the aiPoweredDiagnosis function.
 * - AIPoweredDiagnosisOutput - The return type for the aiPoweredDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredDiagnosisInputSchema = z.object({
  itemSpecs: z.record(z.any()).describe('Specifications of the ICT item, including CPU, RAM, storage, model, and serial number.'),
  issueDescription: z.string().describe('Detailed description of the issue encountered with the ICT item.'),
});
export type AIPoweredDiagnosisInput = z.infer<typeof AIPoweredDiagnosisInputSchema>;

const AIPoweredDiagnosisOutputSchema = z.object({
  suggestedReusableParts: z
    .array(z.string())
    .describe('List of suggested reusable part IDs that could be used for repair.'),
  suspectedCauses: z.array(z.string()).describe('List of suspected causes of the issue.'),
  troubleshootingSteps: z.array(z.string()).describe('List of troubleshooting steps.'),
});
export type AIPoweredDiagnosisOutput = z.infer<typeof AIPoweredDiagnosisOutputSchema>;

export async function aiPoweredDiagnosis(input: AIPoweredDiagnosisInput): Promise<AIPoweredDiagnosisOutput> {
  return aiPoweredDiagnosisFlow(input);
}

const aiPoweredDiagnosisPrompt = ai.definePrompt({
  name: 'aiPoweredDiagnosisPrompt',
  input: {schema: AIPoweredDiagnosisInputSchema},
  output: {schema: AIPoweredDiagnosisOutputSchema},
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

const aiPoweredDiagnosisFlow = ai.defineFlow(
  {
    name: 'aiPoweredDiagnosisFlow',
    inputSchema: AIPoweredDiagnosisInputSchema,
    outputSchema: AIPoweredDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await aiPoweredDiagnosisPrompt(input);
    return output!;
  }
);
