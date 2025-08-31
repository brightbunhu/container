/**
 * @fileOverview Predictive Maintenance Flow using Machine Learning
 * 
 * This flow analyzes historical data to predict:
 * - When maintenance will be needed
 * - Which components are likely to fail
 * - Optimal maintenance schedules
 * - Cost optimization strategies
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for predictive maintenance analysis
const PredictiveMaintenanceInputSchema = z.object({
  itemId: z.string().optional().describe('Specific item ID to analyze'),
  itemType: z.string().optional().describe('Type of items to analyze'),
  timeHorizon: z.number().default(90).describe('Days into the future to predict'),
  includeCosts: z.boolean().default(true).describe('Whether to include cost analysis'),
  maintenanceType: z.enum(['PREVENTIVE', 'PREDICTIVE', 'CORRECTIVE']).optional().describe('Type of maintenance to focus on'),
});

export type PredictiveMaintenanceInput = z.infer<typeof PredictiveMaintenanceInputSchema>;

// Output schema with detailed predictions
const PredictiveMaintenanceOutputSchema = z.object({
  predictions: z.array(z.object({
    itemId: z.string().describe('ID of the item'),
    itemName: z.string().describe('Name of the item'),
    nextMaintenanceDate: z.string().describe('Predicted next maintenance date'),
    maintenanceType: z.string().describe('Type of maintenance needed'),
    confidence: z.number().describe('Confidence level of prediction'),
    estimatedCost: z.number().describe('Estimated maintenance cost'),
    riskLevel: z.string().describe('Risk level (LOW, MEDIUM, HIGH, CRITICAL)'),
    recommendedActions: z.array(z.string()).describe('Recommended maintenance actions'),
    urgency: z.string().describe('Urgency level'),
  })),
  insights: z.object({
    totalPredictedCost: z.number().describe('Total predicted maintenance costs'),
    highRiskItems: z.number().describe('Number of high-risk items'),
    maintenanceSchedule: z.array(z.object({
      week: z.string().describe('Week starting date'),
      items: z.array(z.string()).describe('Items requiring maintenance'),
      estimatedCost: z.number().describe('Estimated cost for the week'),
    })),
    costSavings: z.object({
      preventiveVsCorrective: z.number().describe('Cost savings from preventive vs corrective maintenance'),
      recommendedBudget: z.number().describe('Recommended maintenance budget'),
      roi: z.number().describe('Return on investment for preventive maintenance'),
    }),
  }),
  recommendations: z.object({
    immediateActions: z.array(z.string()).describe('Actions to take immediately'),
    shortTerm: z.array(z.string()).describe('Short-term recommendations (1-30 days)'),
    longTerm: z.array(z.string()).describe('Long-term recommendations (30-90 days)'),
    resourceAllocation: z.object({
      technicians: z.array(z.string()).describe('Recommended technician assignments'),
      components: z.array(z.string()).describe('Components to stock up on'),
      tools: z.array(z.string()).describe('Tools and equipment needed'),
    }),
  }),
});

export type PredictiveMaintenanceOutput = z.infer<typeof PredictiveMaintenanceOutputSchema>;

export async function predictiveMaintenance(input: PredictiveMaintenanceInput): Promise<PredictiveMaintenanceOutput> {
  return predictiveMaintenanceFlow(input);
}

// AI prompt for predictive maintenance analysis
const predictiveMaintenancePrompt = ai.definePrompt({
  name: 'predictiveMaintenancePrompt',
  input: { schema: PredictiveMaintenanceInputSchema },
  output: { schema: PredictiveMaintenanceOutputSchema },
  prompt: `You are an AI-powered predictive maintenance system for ICT infrastructure.

ANALYSIS CONTEXT:
- Time Horizon: {{timeHorizon}} days
- Item Type: {{itemType}}
- Include Cost Analysis: {{includeCosts}}
- Maintenance Type Focus: {{maintenanceType}}

ANALYSIS REQUIREMENTS:
1. Analyze historical maintenance patterns and failure data
2. Predict when maintenance will be needed for each item
3. Assess risk levels based on age, usage patterns, and failure history
4. Calculate cost implications and potential savings
5. Recommend optimal maintenance schedules
6. Suggest resource allocation strategies

OUTPUT REQUIREMENTS:
- Provide detailed predictions for each item
- Include confidence levels and reasoning
- Calculate cost-benefit analysis
- Recommend immediate and long-term actions
- Suggest resource allocation and technician assignments
- Identify cost-saving opportunities

MAINTENANCE STRATEGIES:
- Preventive: Schedule-based maintenance to prevent failures
- Predictive: Data-driven maintenance based on condition monitoring
- Corrective: Reactive maintenance after failures occur

Focus on:
- Minimizing downtime and costs
- Maximizing equipment lifespan
- Optimizing resource utilization
- Improving reliability and performance
`,
});

const predictiveMaintenanceFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceFlow',
    inputSchema: PredictiveMaintenanceInputSchema,
    outputSchema: PredictiveMaintenanceOutputSchema,
  },
  async input => {
    try {
      // Fetch historical data for analysis
      const [items, workLogs, components] = await Promise.all([
        fetch('/api/items').then(res => res.ok ? res.json() : []),
        fetch('/api/work-logs').then(res => res.ok ? res.json() : []),
        fetch('/api/components').then(res => res.ok ? res.json() : [])
      ]);

      // Filter items based on input criteria
      let filteredItems = items;
      if (input.itemId) {
        filteredItems = items.filter((item: any) => item._id === input.itemId);
      } else if (input.itemType) {
        filteredItems = items.filter((item: any) => item.type === input.itemType);
      }

      // Generate predictions using AI
      const { output } = await predictiveMaintenancePrompt(input);
      
      // Enhance predictions with historical data analysis
      const enhancedPredictions = await enhancePredictionsWithData(
        filteredItems, 
        workLogs, 
        components, 
        input.timeHorizon
      );

      return {
        ...output!,
        predictions: enhancedPredictions
      };
    } catch (error) {
      console.error('Error in predictive maintenance flow:', error);
      throw new Error('Failed to generate predictive maintenance analysis');
    }
  }
);

/**
 * Enhance AI predictions with historical data analysis
 */
async function enhancePredictionsWithData(
  items: any[], 
  workLogs: any[], 
  components: any[], 
  timeHorizon: number
): Promise<any[]> {
  const predictions: any[] = [];
  const now = new Date();

  items.forEach(item => {
    // Analyze work log history for this item
    const itemWorkLogs = workLogs.filter((log: any) => log.itemId === item._id);
    const maintenanceLogs = itemWorkLogs.filter((log: any) => 
      log.status === 'RESOLVED' && log.resolution
    );

    // Calculate maintenance patterns
    let nextMaintenanceDate = new Date(now);
    let confidence = 0.5;
    let riskLevel = 'MEDIUM';
    let estimatedCost = 100;

    if (maintenanceLogs.length > 0) {
      // Calculate average time between maintenance events
      const maintenanceDates = maintenanceLogs
        .map((log: any) => new Date(log.createdAt))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());

      if (maintenanceDates.length > 1) {
        let totalDays = 0;
        for (let i = 1; i < maintenanceDates.length; i++) {
          const daysDiff = (maintenanceDates[i].getTime() - maintenanceDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
          totalDays += daysDiff;
        }
        const avgDays = totalDays / (maintenanceDates.length - 1);
        
        // Predict next maintenance date
        const lastMaintenance = maintenanceDates[maintenanceDates.length - 1];
        nextMaintenanceDate = new Date(lastMaintenance.getTime() + (avgDays * 24 * 60 * 60 * 1000));
        
        // Adjust confidence based on data quality
        confidence = Math.min(0.9, 0.5 + (maintenanceLogs.length * 0.1));
      }
    } else {
      // No maintenance history - use default predictions
      nextMaintenanceDate.setDate(now.getDate() + 90); // Default 90 days
      confidence = 0.3;
    }

    // Assess risk level based on item status and age
    if (item.status === 'DEAD' || item.status === 'PHASED_OUT') {
      riskLevel = 'CRITICAL';
      estimatedCost = 200;
    } else if (item.status === 'OLD') {
      riskLevel = 'HIGH';
      estimatedCost = 150;
    } else if (item.status === 'ALIVE') {
      riskLevel = 'MEDIUM';
      estimatedCost = 100;
    } else {
      riskLevel = 'LOW';
      estimatedCost = 50;
    }

    // Calculate urgency based on time until maintenance
    const daysUntilMaintenance = (nextMaintenanceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    let urgency = 'LOW';
    if (daysUntilMaintenance <= 7) urgency = 'CRITICAL';
    else if (daysUntilMaintenance <= 30) urgency = 'HIGH';
    else if (daysUntilMaintenance <= 60) urgency = 'MEDIUM';

    // Generate recommended actions
    const recommendedActions = generateRecommendedActions(riskLevel, urgency, item.type);

    predictions.push({
      itemId: item._id,
      itemName: item.name,
      nextMaintenanceDate: nextMaintenanceDate.toISOString(),
      maintenanceType: 'PREDICTIVE',
      confidence,
      estimatedCost,
      riskLevel,
      recommendedActions,
      urgency,
    });
  });

  // Sort by urgency and risk level
  return predictions.sort((a, b) => {
    const urgencyOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    const riskOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    
    const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
  });
}

/**
 * Generate recommended maintenance actions based on risk and urgency
 */
function generateRecommendedActions(riskLevel: string, urgency: string, itemType: string): string[] {
  const actions: string[] = [];

  if (urgency === 'CRITICAL') {
    actions.push('Immediate inspection required');
    actions.push('Check for hardware failures');
    actions.push('Review error logs and system status');
  } else if (urgency === 'HIGH') {
    actions.push('Schedule maintenance within 7 days');
    actions.push('Run diagnostic tests');
    actions.push('Check component wear and tear');
  } else if (urgency === 'MEDIUM') {
    actions.push('Schedule maintenance within 30 days');
    actions.push('Perform routine checks');
    actions.push('Update firmware if available');
  } else {
    actions.push('Routine maintenance check');
    actions.push('Clean hardware components');
    actions.push('Verify system performance');
  }

  // Add type-specific recommendations
  if (itemType === 'COMPUTER') {
    actions.push('Check CPU temperature and fan operation');
    actions.push('Verify RAM and storage health');
  } else if (itemType === 'PRINTER') {
    actions.push('Clean print heads and rollers');
    actions.push('Check ink/toner levels');
  } else if (itemType === 'NETWORK') {
    actions.push('Test network connectivity');
    actions.push('Check cable integrity');
  }

  return actions;
}
