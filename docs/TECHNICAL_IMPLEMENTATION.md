# Technical Implementation Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [API Usage](#api-usage)
3. [ML Algorithm Integration](#ml-algorithm-integration)
4. [Custom Flow Development](#custom-flow-development)
5. [Performance Optimization](#performance-optimization)
6. [Testing and Validation](#testing-and-validation)
7. [Deployment](#deployment)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance running
- Google AI API key for Gemini 2.5 Flash
- Genkit CLI installed globally

### Installation
```bash
# Install dependencies
npm install

# Install Genkit CLI
npm install -g genkit-cli

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Environment Configuration
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/kesacontainer
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### Database Setup
```bash
# Seed the database with initial data
npm run seed

# Start the development server
npm run dev
```

## API Usage

### 1. Enhanced Troubleshooting API

#### Endpoint
```typescript
POST /api/ai/enhanced-troubleshoot
```

#### Request Body
```typescript
{
  "issueDescription": "Computer won't turn on, no power light",
  "itemType": "COMPUTER",
  "urgency": "HIGH",
  "environment": "Office",
  "previousAttempts": ["Checked power cable", "Tried different outlet"]
}
```

#### Response
```typescript
{
  "solution": "Step-by-step troubleshooting guide...",
  "classification": {
    "category": "HARDWARE",
    "confidence": 0.87,
    "severity": "HIGH",
    "estimatedResolutionTime": 2.5
  },
  "recommendations": {
    "immediateActions": ["Check power supply", "Verify cable connections"],
    "preventiveMeasures": ["Regular power supply inspection"],
    "componentSuggestions": ["PSU-001", "CABLE-002"]
  },
  "escalation": {
    "shouldEscalate": false,
    "recommendedTechnician": null,
    "escalationReason": null
  }
}
```

### 2. Predictive Maintenance API

#### Endpoint
```typescript
POST /api/ai/predictive-maintenance
```

#### Request Body
```typescript
{
  "timeHorizon": 90,
  "includeCosts": true,
  "itemType": "COMPUTER"
}
```

#### Response
```typescript
{
  "predictions": [
    {
      "itemId": "item_001",
      "itemName": "Office Computer 1",
      "nextMaintenanceDate": "2024-03-15T00:00:00.000Z",
      "maintenanceType": "PREDICTIVE",
      "confidence": 0.78,
      "estimatedCost": 150,
      "riskLevel": "MEDIUM",
      "recommendedActions": ["Check CPU temperature", "Clean dust"],
      "urgency": "MEDIUM"
    }
  ],
  "insights": {
    "totalPredictedCost": 2500,
    "highRiskItems": 3,
    "maintenanceSchedule": [...],
    "costSavings": {...}
  }
}
```

## ML Algorithm Integration

### 1. Using the Issue Classifier

#### Basic Usage
```typescript
import { IssueClassifier } from '@/ai/ml/algorithms';

// Initialize with training data
const classifier = new IssueClassifier(workLogs);

// Classify a new issue
const result = classifier.classify(
  "Printer showing paper jam error", 
  "PRINTER"
);

console.log(result);
// Output:
// {
//   category: "HARDWARE",
//   confidence: 0.92,
//   severity: "MEDIUM",
//   estimatedResolutionTime: 1.5,
//   suggestedTechnician: "tech2",
//   priority: 3
// }
```

#### Custom Training
```typescript
// Create custom training data
const customWorkLogs = [
  {
    _id: "wl_001",
    issueSummary: "Network connectivity issues",
    status: "RESOLVED",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  // ... more training data
];

const customClassifier = new IssueClassifier(customWorkLogs);
```

### 2. Extending ML Algorithms

#### Adding New Classification Features
```typescript
class EnhancedIssueClassifier extends IssueClassifier {
  private environmentalFactors: Map<string, number>;
  
  constructor(trainingData: WorkLog[], environmentData: any[]) {
    super(trainingData);
    this.analyzeEnvironmentalFactors(environmentData);
  }
  
  private analyzeEnvironmentalFactors(data: any[]) {
    // Implement environmental factor analysis
    this.environmentalFactors = new Map();
    // ... analysis logic
  }
  
  public classifyWithEnvironment(
    issueDescription: string, 
    itemType: string, 
    environment: string
  ): IssueClassificationResult {
    const baseResult = this.classify(issueDescription, itemType);
    
    // Adjust confidence based on environmental factors
    const envFactor = this.environmentalFactors.get(environment) || 1.0;
    baseResult.confidence *= envFactor;
    
    return baseResult;
  }
}
```

#### Custom Scoring Algorithms
```typescript
class CustomComponentRecommender {
  private customScoring: Map<string, (component: Component, item: Item) => number>;
  
  constructor() {
    this.customScoring = new Map();
    this.initializeCustomScoring();
  }
  
  private initializeCustomScoring() {
    // Custom scoring for specific component types
    this.customScoring.set('GPU', (component, item) => {
      // GPU-specific scoring logic
      let score = 0;
      
      // Check power requirements
      if (component.specs?.powerRequirement <= item.specs?.psuWattage) {
        score += 0.3;
      }
      
      // Check physical dimensions
      if (this.checkPhysicalCompatibility(component, item)) {
        score += 0.2;
      }
      
      return score;
    });
  }
  
  public getCustomScore(component: Component, item: Item): number {
    const customScorer = this.customScoring.get(component.category);
    if (customScorer) {
      return customScorer(component, item);
    }
    return 0;
  }
}
```

## Custom Flow Development

### 1. Creating a New AI Flow

#### Basic Flow Structure
```typescript
// src/ai/flows/custom-flow.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define input schema
const CustomFlowInputSchema = z.object({
  query: z.string().describe('User query'),
  context: z.record(z.any()).optional().describe('Additional context'),
});

export type CustomFlowInput = z.infer<typeof CustomFlowInputSchema>;

// Define output schema
const CustomFlowOutputSchema = z.object({
  response: z.string().describe('AI response'),
  confidence: z.number().describe('Confidence level'),
  metadata: z.record(z.any()).optional().describe('Additional metadata'),
});

export type CustomFlowOutput = z.infer<typeof CustomFlowOutputSchema>;

// Define the prompt
const customFlowPrompt = ai.definePrompt({
  name: 'customFlowPrompt',
  input: { schema: CustomFlowInputSchema },
  output: { schema: CustomFlowOutputSchema },
  prompt: `You are a specialized AI assistant for ICT asset management.

User Query: {{query}}
Context: {{context}}

Provide a helpful response based on the query and context.
`,
});

// Define the flow
const customFlow = ai.defineFlow(
  {
    name: 'customFlow',
    inputSchema: CustomFlowInputSchema,
    outputSchema: CustomFlowOutputSchema,
  },
  async input => {
    const { output } = await customFlowPrompt(input);
    return output!;
  }
);

// Export the function
export async function customFlowFunction(input: CustomFlowInput): Promise<CustomFlowOutput> {
  return customFlow(input);
}
```

#### Advanced Flow with ML Integration
```typescript
// src/ai/flows/advanced-flow.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { IssueClassifier } from '@/ai/ml/algorithms';

const AdvancedFlowInputSchema = z.object({
  issueDescription: z.string(),
  itemType: string,
  includeMLAnalysis: z.boolean().default(true),
});

export type AdvancedFlowInput = z.infer<typeof AdvancedFlowInputSchema>;

const AdvancedFlowOutputSchema = z.object({
  aiResponse: z.string(),
  mlAnalysis: z.object({
    classification: z.any(),
    confidence: z.number(),
    recommendations: z.array(z.string()),
  }).optional(),
});

export type AdvancedFlowOutput = z.infer<typeof AdvancedFlowOutputSchema>;

const advancedFlowPrompt = ai.definePrompt({
  name: 'advancedFlowPrompt',
  input: { schema: AdvancedFlowInputSchema },
  output: { schema: AdvancedFlowOutputSchema },
  prompt: `Analyze the following ICT issue and provide a comprehensive solution.

Issue: {{issueDescription}}
Item Type: {{itemType}}

Provide a detailed solution with step-by-step instructions.
`,
});

const advancedFlow = ai.defineFlow(
  {
    name: 'advancedFlow',
    inputSchema: AdvancedFlowInputSchema,
    outputSchema: AdvancedFlowOutputSchema,
  },
  async input => {
    // Get AI response
    const { output } = await advancedFlowPrompt(input);
    
    // Enhance with ML if requested
    if (input.includeMLAnalysis) {
      try {
        const workLogs = await fetch('/api/work-logs').then(res => res.json());
        const classifier = new IssueClassifier(workLogs);
        const mlResult = classifier.classify(input.issueDescription, input.itemType);
        
        return {
          ...output!,
          mlAnalysis: {
            classification: mlResult,
            confidence: mlResult.confidence,
            recommendations: [
              `Estimated resolution time: ${mlResult.estimatedResolutionTime} hours`,
              `Recommended technician: ${mlResult.suggestedTechnician}`,
              `Priority level: ${mlResult.priority}`,
            ],
          },
        };
      } catch (error) {
        console.error('ML analysis failed:', error);
      }
    }
    
    return output!;
  }
);

export async function advancedFlowFunction(input: AdvancedFlowInput): Promise<AdvancedFlowOutput> {
  return advancedFlow(input);
}
```

### 2. Frontend Integration

#### React Component Integration
```typescript
// src/components/custom-ai-component.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { customFlowFunction } from '@/ai/flows/custom-flow';

export function CustomAIComponent() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await customFlowFunction({
        query,
        context: { timestamp: new Date().toISOString() }
      });
      setResponse(result.response);
    } catch (error) {
      setResponse('Error: Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query..."
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </Button>
      {response && (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">AI Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
```

## Performance Optimization

### 1. ML Model Caching

#### In-Memory Caching
```typescript
class CachedIssueClassifier {
  private static instance: CachedIssueClassifier;
  private classifier: IssueClassifier | null = null;
  private lastTrainingDataHash: string = '';
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): CachedIssueClassifier {
    if (!CachedIssueClassifier.instance) {
      CachedIssueClassifier.instance = new CachedIssueClassifier();
    }
    return CachedIssueClassifier.instance;
  }

  public async getClassifier(workLogs: WorkLog[]): Promise<IssueClassifier> {
    const dataHash = this.generateDataHash(workLogs);
    const now = Date.now();

    // Check if cache is valid
    if (
      this.classifier &&
      this.lastTrainingDataHash === dataHash &&
      now < this.cacheExpiry
    ) {
      return this.classifier;
    }

    // Create new classifier
    this.classifier = new IssueClassifier(workLogs);
    this.lastTrainingDataHash = dataHash;
    this.cacheExpiry = now + this.CACHE_DURATION;

    return this.classifier;
  }

  private generateDataHash(workLogs: WorkLog[]): string {
    // Simple hash based on data length and last update
    const lastUpdate = workLogs.length > 0 
      ? workLogs[workLogs.length - 1].createdAt 
      : '';
    return `${workLogs.length}_${lastUpdate}`;
  }
}
```

#### Database Query Optimization
```typescript
// Optimize database queries for ML algorithms
class OptimizedDataFetcher {
  public static async getWorkLogsForML(): Promise<WorkLog[]> {
    // Only fetch necessary fields for ML processing
    const response = await fetch('/api/work-logs?fields=issueSummary,status,createdAt,category');
    return response.json();
  }

  public static async getItemsForML(): Promise<Item[]> {
    // Fetch items with minimal fields needed for ML
    const response = await fetch('/api/items?fields=name,type,status,specs');
    return response.json();
  }

  public static async getComponentsForML(): Promise<Component[]> {
    // Fetch components with compatibility data
    const response = await fetch('/api/components?fields=name,category,compatibilityTags,quantity,condition');
    return response.json();
  }
}
```

### 2. Batch Processing

#### Batch ML Processing
```typescript
class BatchMLProcessor {
  public static async processBatch(
    items: Item[],
    batchSize: number = 10
  ): Promise<any[]> {
    const results: any[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await this.processBatchItems(batch);
      results.push(...batchResults);
      
      // Add small delay to prevent overwhelming the system
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  private static async processBatchItems(items: Item[]): Promise<any[]> {
    // Process a batch of items
    return Promise.all(
      items.map(async (item) => {
        // Individual item processing logic
        return this.processItem(item);
      })
    );
  }

  private static async processItem(item: Item): Promise<any> {
    // Item-specific processing
    return {
      itemId: item._id,
      analysis: 'Processed',
      timestamp: new Date().toISOString()
    };
  }
}
```

## Testing and Validation

### 1. Unit Testing ML Algorithms

#### Test Setup
```typescript
// src/ai/ml/__tests__/algorithms.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { IssueClassifier } from '../algorithms';

describe('IssueClassifier', () => {
  let classifier: IssueClassifier;
  let mockWorkLogs: any[];

  beforeEach(() => {
    mockWorkLogs = [
      {
        _id: 'wl_001',
        issueSummary: 'Computer won\'t turn on',
        status: 'RESOLVED',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: 'wl_002',
        issueSummary: 'Printer paper jam',
        status: 'RESOLVED',
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ];
    
    classifier = new IssueClassifier(mockWorkLogs);
  });

  it('should classify hardware issues correctly', () => {
    const result = classifier.classify('Computer not starting', 'COMPUTER');
    
    expect(result.category).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should handle empty training data gracefully', () => {
    const emptyClassifier = new IssueClassifier([]);
    const result = emptyClassifier.classify('Test issue', 'COMPUTER');
    
    expect(result.category).toBe('UNKNOWN');
    expect(result.confidence).toBe(0.5);
  });
});
```

#### Integration Testing
```typescript
// src/ai/flows/__tests__/enhanced-troubleshoot.test.ts
import { describe, it, expect, vi } from 'vitest';
import { enhancedTroubleshoot } from '../enhanced-troubleshoot';

// Mock fetch
global.fetch = vi.fn();

describe('Enhanced Troubleshoot Flow', () => {
  it('should process troubleshooting requests correctly', async () => {
    // Mock successful API responses
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          _id: 'wl_001',
          issueSummary: 'Test issue',
          status: 'RESOLVED',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    });

    const result = await enhancedTroubleshoot({
      issueDescription: 'Test issue description',
      itemType: 'COMPUTER',
      userRole: 'TECHNICIAN',
      urgency: 'MEDIUM'
    });

    expect(result).toBeDefined();
    expect(result.solution).toBeDefined();
    expect(result.classification).toBeDefined();
  });
});
```

### 2. Performance Testing

#### Load Testing
```typescript
// src/ai/ml/__tests__/performance.test.ts
import { describe, it, expect } from 'vitest';
import { IssueClassifier } from '../algorithms';

describe('Performance Tests', () => {
  it('should handle large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      _id: `wl_${i}`,
      issueSummary: `Issue ${i}`,
      status: 'RESOLVED',
      createdAt: new Date().toISOString()
    }));

    const startTime = performance.now();
    const classifier = new IssueClassifier(largeDataset);
    const endTime = performance.now();

    // Should complete within 1 second
    expect(endTime - startTime).toBeLessThan(1000);
  });

  it('should maintain performance with repeated classifications', () => {
    const classifier = new IssueClassifier([]);
    const startTime = performance.now();
    
    // Perform 1000 classifications
    for (let i = 0; i < 1000; i++) {
      classifier.classify(`Issue ${i}`, 'COMPUTER');
    }
    
    const endTime = performance.now();
    
    // Should complete within 2 seconds
    expect(endTime - startTime).toBeLessThan(2000);
  });
});
```

## Deployment

### 1. Production Configuration

#### Environment Variables
```bash
# Production .env
MONGODB_URI=mongodb://production-db:27017/kesacontainer
GOOGLE_AI_API_KEY=your_production_api_key
NODE_ENV=production
ML_CACHE_DURATION=300000
ML_BATCH_SIZE=20
```

#### Performance Tuning
```typescript
// src/ai/config/production.ts
export const productionConfig = {
  ml: {
    cacheDuration: 300000, // 5 minutes
    batchSize: 20,
    maxConcurrentRequests: 100,
    timeout: 30000, // 30 seconds
  },
  ai: {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 15000, // 15 seconds
  }
};
```

### 2. Monitoring and Logging

#### ML Performance Monitoring
```typescript
// src/ai/monitoring/ml-monitor.ts
class MLPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  public recordClassificationTime(duration: number) {
    this.recordMetric('classification_time', duration);
  }

  public recordPredictionAccuracy(accuracy: number) {
    this.recordMetric('prediction_accuracy', accuracy);
  }

  public recordCacheHitRate(hitRate: number) {
    this.recordMetric('cache_hit_rate', hitRate);
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  public getMetrics() {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((values, name) => {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      result[name] = { average: avg, min, max, count: values.length };
    });
    
    return result;
  }
}

export const mlMonitor = new MLPerformanceMonitor();
```

#### Health Checks
```typescript
// src/ai/health/health-check.ts
export async function checkMLSystemHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: Record<string, any>;
}> {
  try {
    // Check ML model availability
    const classifier = new IssueClassifier([]);
    const testResult = classifier.classify('test', 'COMPUTER');
    
    // Check AI service connectivity
    const aiResponse = await fetch('/api/ai/health');
    const aiHealthy = aiResponse.ok;
    
    // Check database connectivity
    const dbResponse = await fetch('/api/health');
    const dbHealthy = dbResponse.ok;
    
    if (testResult && aiHealthy && dbHealthy) {
      return {
        status: 'healthy',
        details: {
          mlModels: 'operational',
          aiService: 'connected',
          database: 'connected',
          timestamp: new Date().toISOString()
        }
      };
    } else {
      return {
        status: 'degraded',
        details: {
          mlModels: testResult ? 'operational' : 'error',
          aiService: aiHealthy ? 'connected' : 'disconnected',
          database: dbHealthy ? 'connected' : 'disconnected',
          timestamp: new Date().toISOString()
        }
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
}
```

---

*This guide covers the essential aspects of implementing and extending the ML and AI system. For more advanced topics, refer to the individual algorithm implementations and the comprehensive documentation.*
