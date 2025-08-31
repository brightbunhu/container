
import { ChatClient } from "@/components/pages/chatbot/chat-client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function ChatbotPage() {
  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-2">
            <Bot className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Troubleshooting Assistant</CardTitle>
          <CardDescription>
            Describe your ICT issue below to get step-by-step guidance.
          </CardDescription>
        </CardHeader>
        <ChatClient />
      </Card>
    </div>
  );
}
