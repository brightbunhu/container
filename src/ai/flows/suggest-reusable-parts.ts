'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting reusable parts based on compatibility and inventory.
 *
 * - suggestReusableParts - A function that takes an issue description and item specifications, and suggests reusable parts.
 * - SuggestReusablePartsInput - The input type for the suggestReusableParts function.
 * - SuggestReusablePartsOutput - The return type for the suggestReusableParts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReusablePartsInputSchema = z.object({
  issueDescription: z.string().describe('A description of the issue encountered with the ICT item.'),
  itemSpecs: z.record(z.string(), z.any()).describe('The specifications of the ICT item experiencing the issue.'),
  compatibleTypes: z.array(z.string()).describe('The ICT product types compatible with the reusable parts.'),
});
export type SuggestReusablePartsInput = z.infer<typeof SuggestReusablePartsInputSchema>;

const SuggestReusablePartsOutputSchema = z.array(
  z.object({
    componentId: z.string().describe('The ID of the reusable component.'),
    name: z.string().describe('The name of the reusable component.'),
    condition: z.string().describe('The condition of the reusable component.'),
  })
);
export type SuggestReusablePartsOutput = z.infer<typeof SuggestReusablePartsOutputSchema>;

export async function suggestReusableParts(input: SuggestReusablePartsInput): Promise<SuggestReusablePartsOutput> {
  return suggestReusablePartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReusablePartsPrompt',
  input: {schema: SuggestReusablePartsInputSchema},
  output: {schema: SuggestReusablePartsOutputSchema},
  prompt: `You are an AI assistant helping a technician find reusable parts for an ICT item.\n  Based on the issue description: {{{issueDescription}}} and the item specifications: {{{itemSpecs}}},\n  suggest reusable parts that are compatible with the following ICT product types: {{{compatibleTypes}}}.\n  Return an array of reusable parts, including their ID, name, and condition.\n  Ensure the suggested parts are relevant to the described issue and compatible with the item's specifications.\n  Do not suggest parts that are not compatible.\n`,
});

const suggestReusablePartsFlow = ai.defineFlow(
  {
    name: 'suggestReusablePartsFlow',
    inputSchema: SuggestReusablePartsInputSchema,
    outputSchema: SuggestReusablePartsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
