/**
 * @fileOverview Enhanced AI-Powered Troubleshooting Flow
 * 
 * This flow integrates machine learning algorithms with the AI chatbot to provide:
 * - Intelligent issue classification
 * - Predictive maintenance insights
 * - Component recommendations
 * - Historical pattern analysis
 * - Personalized solutions
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { IssueClassifier } from '@/ai/ml/algorithms';

// Enhanced input schema with more context
const EnhancedTroubleshootInputSchema = z.object({
  issueDescription: z.string().describe('Detailed description of the ICT issue'),
  itemType: z.string().describe('Type of ICT item experiencing the issue'),
  itemId: z.string().optional().describe('Specific item ID if available'),
  userRole: z.string().describe('Role of the user reporting the issue'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Urgency level of the issue'),
  previousAttempts: z.array(z.string()).optional().describe('Previous troubleshooting steps attempted'),
  environment: z.string().optional().describe('Environment where the issue occurs'),
});

export type EnhancedTroubleshootInput = z.infer<typeof EnhancedTroubleshootInputSchema>;

// Enhanced output with ML insights
const EnhancedTroubleshootOutputSchema = z.object({
  solution: z.string().describe('Step-by-step solution to resolve the issue'),
  classification: z.object({
    category: z.string().describe('AI-classified issue category'),
    confidence: z.number().describe('Confidence level of the classification'),
    severity: z.string().describe('Assessed severity level'),
    estimatedResolutionTime: z.number().describe('Estimated time to resolve in hours'),
  }),
  recommendations: z.object({
    immediateActions: z.array(z.string()).describe('Actions to take immediately'),
    preventiveMeasures: z.array(z.string()).describe('Preventive measures for the future'),
    componentSuggestions: z.array(z.string()).describe('Suggested components if replacement needed'),
  }),
  insights: z.object({
    similarIssues: z.array(z.string()).describe('Similar issues from knowledge base'),
    riskFactors: z.array(z.string()).describe('Identified risk factors'),
    costImplications: z.string().describe('Estimated cost implications'),
  }),
  escalation: z.object({
    shouldEscalate: z.boolean().describe('Whether issue should be escalated'),
    recommendedTechnician: z.string().describe('Recommended technician for escalation'),
    escalationReason: z.string().describe('Reason for escalation if applicable'),
  }),
});

export type EnhancedTroubleshootOutput = z.infer<typeof EnhancedTroubleshootOutputSchema>;

export async function enhancedTroubleshoot(input: EnhancedTroubleshootInput): Promise<EnhancedTroubleshootOutput> {
  return enhancedTroubleshootFlow(input);
}

// Enhanced prompt with ML integration
const enhancedTroubleshootPrompt = ai.definePrompt({
  name: 'enhancedTroubleshootPrompt',
  input: { schema: EnhancedTroubleshootInputSchema },
  output: { schema: EnhancedTroubleshootOutputSchema },
  prompt: `You are an advanced AI-powered ICT support system with machine learning capabilities.

CONTEXT:
- User Role: {{userRole}}
- Item Type: {{itemType}}
- Issue Description: {{issueDescription}}
- Urgency: {{urgency}}
- Previous Attempts: {{previousAttempts}}
- Environment: {{environment}}

ANALYSIS REQUIREMENTS:
1. Analyze the issue description using natural language processing
2. Classify the issue based on patterns and symptoms
3. Assess severity and urgency based on user role and environment
4. Provide personalized solutions considering user expertise level
5. Include preventive measures and risk mitigation strategies
6. Suggest escalation paths if necessary

OUTPUT FORMAT:
- Provide a comprehensive, step-by-step solution
- Include confidence levels and reasoning
- Suggest immediate actions and long-term preventive measures
- Recommend components if hardware replacement is needed
- Identify similar issues and patterns
- Assess cost implications and resource requirements
- Determine if escalation is needed and to whom

Remember to:
- Use clear, actionable language appropriate for the user's role
- Include safety considerations and best practices
- Reference relevant knowledge base articles when available
- Consider the urgency level in your recommendations
- Provide alternative solutions when possible
`,
});

const enhancedTroubleshootFlow = ai.defineFlow(
  {
    name: 'enhancedTroubleshootFlow',
    inputSchema: EnhancedTroubleshootInputSchema,
    outputSchema: EnhancedTroubleshootOutputSchema,
  },
  async input => {
    // Get AI-generated solution
    const { output } = await enhancedTroubleshootPrompt(input);
    
    // Enhance with ML insights if we have historical data
    const enhancedOutput = await enhanceWithMLInsights(input, output!);
    
    return enhancedOutput;
  }
);

/**
 * Enhance AI output with machine learning insights
 */
async function enhanceWithMLInsights(
  input: EnhancedTroubleshootInput, 
  aiOutput: EnhancedTroubleshootOutput
): Promise<EnhancedTroubleshootOutput> {
  try {
    // Fetch historical data for ML analysis
    const [workLogs, items, components] = await Promise.all([
      fetch('/api/work-logs').then(res => res.ok ? res.json() : []),
      fetch('/api/items').then(res => res.ok ? res.json() : []),
      fetch('/api/components').then(res => res.ok ? res.json() : [])
    ]);

    if (workLogs.length > 0) {
      // Initialize ML classifier
      const classifier = new IssueClassifier(workLogs);
      
      // Classify the current issue
      const classification = classifier.classify(input.issueDescription, input.itemType);
      
      // Update output with ML insights
      return {
        ...aiOutput,
        classification: {
          category: classification.category,
          confidence: classification.confidence,
          severity: classification.severity,
          estimatedResolutionTime: classification.estimatedResolutionTime,
        },
        escalation: {
          shouldEscalate: classification.severity === 'CRITICAL' || classification.severity === 'HIGH',
          recommendedTechnician: classification.suggestedTechnician,
          escalationReason: classification.severity === 'CRITICAL' ? 
            'Critical issue requiring immediate expert attention' : 
            classification.severity === 'HIGH' ? 
            'High severity issue requiring specialized expertise' : 
            'Issue can be resolved by current user'
        }
      };
    }
  } catch (error) {
    console.error('Error enhancing with ML insights:', error);
  }
  
  return aiOutput;
}
