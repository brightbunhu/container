/**
 * @fileOverview Machine Learning Algorithms for ICT Asset Management System
 * 
 * This module implements various ML algorithms for:
 * - Issue Classification and Prediction
 * - Component Recommendation
 * - Predictive Maintenance
 * - Anomaly Detection
 */

import type { Item, Component, KnowledgeBase, WorkLog, User } from '@/lib/types';

// ============================================================================
// ISSUE CLASSIFICATION ALGORITHMS
// ============================================================================

export interface IssueClassificationResult {
  category: string;
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedResolutionTime: number; // in hours
  suggestedTechnician: string;
  priority: number;
}

/**
 * Naive Bayes Classifier for Issue Classification
 * Uses historical issue data to classify new issues
 */
export class IssueClassifier {
  private issueCategories: Map<string, number> = new Map();
  private categoryProbabilities: Map<string, number> = new Map();
  private featureProbabilities: Map<string, Map<string, number>> = new Map();

  constructor(private trainingData: WorkLog[]) {
    this.train();
  }

  private train(): void {
    // Calculate prior probabilities for each status
    const totalIssues = this.trainingData.length;
    
    this.trainingData.forEach(workLog => {
      const status = workLog.status || 'UNKNOWN';
      this.issueCategories.set(status, (this.issueCategories.get(status) || 0) + 1);
    });

    // Calculate P(status)
    this.issueCategories.forEach((count, status) => {
      this.categoryProbabilities.set(status, count / totalIssues);
    });

    // Calculate feature probabilities (simplified for text features)
    this.calculateFeatureProbabilities();
  }

  private calculateFeatureProbabilities(): void {
    // Extract features from issue summaries and calculate probabilities
    const featureWords = new Set<string>();
    
    this.trainingData.forEach(workLog => {
      const words = (workLog.issueSummary || '').toLowerCase().split(/\s+/);
      words.forEach((word: string) => featureWords.add(word));
    });

    featureWords.forEach(feature => {
      this.featureProbabilities.set(feature, new Map());
      
      this.issueCategories.forEach((_, status) => {
        const statusIssues = this.trainingData.filter(w => (w.status || 'UNKNOWN') === status);
        const featureInStatus = statusIssues.filter(w => 
          (w.issueSummary || '').toLowerCase().includes(feature)
        ).length;
        
        const probability = (featureInStatus + 1) / (statusIssues.length + this.issueCategories.size);
        this.featureProbabilities.get(feature)!.set(status, probability);
      });
    });
  }

  public classify(issueDescription: string, itemType: string): IssueClassificationResult {
    const words = issueDescription.toLowerCase().split(/\s+/);
    const scores = new Map<string, number>();

    // Calculate likelihood for each category
    this.issueCategories.forEach((_, category) => {
      let score = Math.log(this.categoryProbabilities.get(category) || 0.001);
      
      words.forEach(word => {
        const featureProb = this.featureProbabilities.get(word)?.get(category);
        if (featureProb) {
          score += Math.log(featureProb);
        }
      });
      
      scores.set(category, score);
    });

    // Find best category
    let bestCategory = 'UNKNOWN';
    let bestScore = -Infinity;
    
    scores.forEach((score, category) => {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    });

    // Calculate confidence and other metrics
    const confidence = this.calculateConfidence(bestScore, scores);
    const severity = this.determineSeverity(issueDescription, itemType);
    const estimatedTime = this.estimateResolutionTime(bestCategory, severity);
    const suggestedTech = this.suggestTechnician(bestCategory);
    const priority = this.calculatePriority(severity, estimatedTime);

    return {
      category: bestCategory,
      confidence,
      severity,
      estimatedResolutionTime: estimatedTime,
      suggestedTechnician: suggestedTech,
      priority
    };
  }

  private calculateConfidence(bestScore: number, allScores: Map<string, number>): number {
    const scores = Array.from(allScores.values());
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    if (maxScore === minScore) return 0.5;
    return (bestScore - minScore) / (maxScore - minScore);
  }

  private determineSeverity(description: string, itemType: string): IssueClassificationResult['severity'] {
    const criticalKeywords = ['crash', 'error', 'fail', 'broken', 'not working', 'dead'];
    const highKeywords = ['slow', 'lag', 'freeze', 'problem', 'issue'];
    const mediumKeywords = ['performance', 'optimization', 'maintenance'];
    
    const desc = description.toLowerCase();
    
    if (criticalKeywords.some(keyword => desc.includes(keyword))) return 'CRITICAL';
    if (highKeywords.some(keyword => desc.includes(keyword))) return 'HIGH';
    if (mediumKeywords.some(keyword => desc.includes(keyword))) return 'MEDIUM';
    
    return 'LOW';
  }

  private estimateResolutionTime(category: string, severity: IssueClassificationResult['severity']): number {
    const baseTimes: Record<string, number> = {
      'HARDWARE': 4,
      'SOFTWARE': 2,
      'NETWORK': 3,
      'PERFORMANCE': 1.5,
      'MAINTENANCE': 1
    };
    
    const severityMultipliers: Record<string, number> = {
      'LOW': 0.5,
      'MEDIUM': 1,
      'HIGH': 2,
      'CRITICAL': 4
    };
    
    return (baseTimes[category] || 2) * (severityMultipliers[severity] || 1);
  }

  private suggestTechnician(category: string): string {
    const technicianExpertise: Record<string, string[]> = {
      'HARDWARE': ['tech1', 'tech2'],
      'SOFTWARE': ['tech3', 'tech4'],
      'NETWORK': ['tech5', 'tech6'],
      'PERFORMANCE': ['tech1', 'tech3'],
      'MAINTENANCE': ['tech2', 'tech5']
    };
    
    const experts = technicianExpertise[category] || ['tech1'];
    return experts[Math.floor(Math.random() * experts.length)];
  }

  private calculatePriority(severity: IssueClassificationResult['severity'], time: number): number {
    const severityWeights: Record<string, number> = {
      'LOW': 1,
      'MEDIUM': 2,
      'HIGH': 3,
      'CRITICAL': 4
    };
    
    return severityWeights[severity] * (time / 2);
  }
}

export default {
  IssueClassifier
};
