"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { enhancedTroubleshoot, type EnhancedTroubleshootInput, type EnhancedTroubleshootOutput } from "@/ai/flows/enhanced-troubleshoot";
import { predictiveMaintenance, type PredictiveMaintenanceInput } from "@/ai/flows/predictive-maintenance";
import { useAuth } from "@/context/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Wrench,
  DollarSign,
  Users,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const enhancedChatSchema = z.object({
  issueDescription: z.string().min(10, "Please provide a detailed description of the issue"),
  itemType: z.string().min(1, "Please select an item type"),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  environment: z.string().optional(),
  previousAttempts: z.string().optional(),
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    type: 'troubleshoot' | 'maintenance' | 'general';
    data?: any;
  };
};

export function EnhancedChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<'chat' | 'maintenance'>('chat');
  const { user, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading enhanced chat...</div>
      </div>
    );
  }

  const form = useForm<z.infer<typeof enhancedChatSchema>>({
    resolver: zodResolver(enhancedChatSchema),
    defaultValues: {
      issueDescription: "",
      itemType: "",
      urgency: "MEDIUM",
      environment: "",
      previousAttempts: "",
    },
  });

  async function onSubmit(values: z.infer<typeof enhancedChatSchema>) {
    setIsLoading(true);
    const messageId = Date.now().toString();
    
    // Add user message
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: `Issue: ${values.issueDescription}\nItem Type: ${values.itemType}\nUrgency: ${values.urgency}`,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      // Prepare input for enhanced troubleshooting
      const troubleshootInput: EnhancedTroubleshootInput = {
        issueDescription: values.issueDescription,
        itemType: values.itemType,
        userRole: user.role,
        urgency: values.urgency,
        environment: values.environment,
        previousAttempts: values.previousAttempts ? [values.previousAttempts] : undefined,
      };

      const result = await enhancedTroubleshoot(troubleshootInput);
      
      // Create enhanced assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatTroubleshootResponse(result),
        timestamp: new Date(),
        metadata: {
          type: 'troubleshoot',
          data: result
        }
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while analyzing your issue. Please try again or contact support.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMaintenanceAnalysis() {
    setIsLoading(true);
    const messageId = Date.now().toString();
    
    // Add user message
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: "Please analyze maintenance requirements for all ICT items and provide predictions.",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      const maintenanceInput: PredictiveMaintenanceInput = {
        timeHorizon: 90,
        includeCosts: true,
      };

      const result = await predictiveMaintenance(maintenanceInput);
      
      // Create maintenance analysis message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatMaintenanceResponse(result),
        timestamp: new Date(),
        metadata: {
          type: 'maintenance',
          data: result
        }
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while analyzing maintenance requirements. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function formatTroubleshootResponse(result: EnhancedTroubleshootOutput): string {
    let response = `🔧 **Issue Analysis Complete**\n\n`;
    
    // Classification
    response += `📊 **Classification:**\n`;
    response += `• Category: ${result.classification.category}\n`;
    response += `• Confidence: ${(result.classification.confidence * 100).toFixed(1)}%\n`;
    response += `• Severity: ${result.classification.severity}\n`;
    response += `• Estimated Time: ${result.classification.estimatedResolutionTime} hours\n\n`;
    
    // Solution
    response += `💡 **Solution:**\n${result.solution}\n\n`;
    
    // Recommendations
    if (result.recommendations.immediateActions.length > 0) {
      response += `⚡ **Immediate Actions:**\n`;
      result.recommendations.immediateActions.forEach((action, index) => {
        response += `${index + 1}. ${action}\n`;
      });
      response += `\n`;
    }
    
    // Escalation
    if (result.escalation.shouldEscalate) {
      response += `🚨 **Escalation Required:**\n`;
      response += `• Reason: ${result.escalation.escalationReason}\n`;
      response += `• Recommended Technician: ${result.escalation.recommendedTechnician}\n\n`;
    }
    
    return response;
  }

  function formatMaintenanceResponse(result: any): string {
    let response = `🔧 **Predictive Maintenance Analysis**\n\n`;
    
    // Summary
    response += `📊 **Summary:**\n`;
    response += `• Total Items Analyzed: ${result.predictions.length}\n`;
    response += `• High Risk Items: ${result.predictions.filter((p: any) => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL').length}\n`;
    response += `• Total Predicted Cost: $${result.insights?.totalPredictedCost || 0}\n\n`;
    
    // Critical items
    const criticalItems = result.predictions.filter((p: any) => p.urgency === 'CRITICAL');
    if (criticalItems.length > 0) {
      response += `🚨 **Critical Items (Immediate Attention Required):**\n`;
      criticalItems.forEach((item: any, index: number) => {
        response += `${index + 1}. ${item.itemName} - ${item.riskLevel} risk\n`;
      });
      response += `\n`;
    }
    
    // High priority items
    const highPriorityItems = result.predictions.filter((p: any) => p.urgency === 'HIGH');
    if (highPriorityItems.length > 0) {
      response += `⚠️ **High Priority Items (Within 30 days):**\n`;
      highPriorityItems.slice(0, 5).forEach((item: any, index: number) => {
        response += `${index + 1}. ${item.itemName} - Due: ${new Date(item.nextMaintenanceDate).toLocaleDateString()}\n`;
      });
      response += `\n`;
    }
    
    return response;
  }

  function getMessageIcon(message: Message) {
    if (message.role === "assistant") {
      if (message.metadata?.type === 'maintenance') return <TrendingUp className="h-5 w-5" />;
      if (message.metadata?.type === 'troubleshoot') return <Wrench className="h-5 w-5" />;
      return <Bot className="h-5 w-5" />;
    }
    return <User className="h-5 w-5" />;
  }

  function getUrgencyColor(urgency: string) {
    switch (urgency) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">AI-Powered ICT Support</CardTitle>
            <CardDescription>
              Enhanced troubleshooting with machine learning insights
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentMode === 'chat' ? 'default' : 'outline'}
              onClick={() => setCurrentMode('chat')}
              size="sm"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Troubleshoot
            </Button>
            <Button
              variant={currentMode === 'maintenance' ? 'default' : 'outline'}
              onClick={() => setCurrentMode('maintenance')}
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Maintenance
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getMessageIcon(message)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing with AI and ML algorithms...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-4">
        {currentMode === 'chat' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="itemType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select item type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="COMPUTER">Computer</SelectItem>
                          <SelectItem value="PRINTER">Printer</SelectItem>
                          <SelectItem value="MONITOR">Monitor</SelectItem>
                          <SelectItem value="NETWORK">Network Device</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="issueDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the issue in detail..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Office, Server Room" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="previousAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Attempts (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Restarted, Updated drivers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get AI-Powered Solution
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="w-full">
            <Button 
              onClick={handleMaintenanceAnalysis} 
              disabled={isLoading} 
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Maintenance...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Predictive Maintenance
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              This will analyze all ICT items and provide maintenance predictions
            </p>
          </div>
        )}
      </CardFooter>
    </div>
  );
}
