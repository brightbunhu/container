
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { aiPoweredDiagnosis, AIPoweredDiagnosisOutput } from "@/ai/flows/ai-powered-diagnosis";
import type { Item } from "@/lib/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const diagnosisFormSchema = z.object({
  issueDescription: z.string().min(10, {
    message: "Please provide a detailed description of at least 10 characters.",
  }),
});

export function AiDiagnosisClient({ item }: { item: Item }) {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<AIPoweredDiagnosisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof diagnosisFormSchema>>({
    resolver: zodResolver(diagnosisFormSchema),
    defaultValues: {
      issueDescription: item.issueHistory[0]?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof diagnosisFormSchema>) {
    setIsLoading(true);
    setDiagnosisResult(null);
    try {
      const result = await aiPoweredDiagnosis({
        itemSpecs: item.specs,
        issueDescription: values.issueDescription,
      });
      setDiagnosisResult(result);
    } catch (error) {
      console.error("AI Diagnosis failed:", error);
      toast({
        variant: "destructive",
        title: "AI Diagnosis Failed",
        description: "An error occurred while running the diagnosis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI-Powered Diagnosis
        </CardTitle>
        <CardDescription>
          Describe the issue to get troubleshooting steps and part suggestions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
                <FormField
                control={form.control}
                name="issueDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="e.g., Device does not power on, makes clicking sounds..."
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Run Diagnosis
                </Button>
            </CardFooter>
        </form>
      </Form>
      {diagnosisResult && (
        <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Suspected Causes</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                            {diagnosisResult.suspectedCauses.map((cause, i) => <li key={i}>{cause}</li>)}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Troubleshooting Steps</AccordionTrigger>
                    <AccordionContent>
                         <ol className="list-decimal pl-5 space-y-2">
                            {diagnosisResult.troubleshootingSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Suggested Reusable Parts</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                            {diagnosisResult.suggestedReusableParts.map((part, i) => <li key={i}>{part}</li>)}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
      )}
    </Card>
  );
}
