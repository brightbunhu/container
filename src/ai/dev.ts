import { config } from 'dotenv';
config();

import '@/ai/flows/ai-diagnose.ts';
import '@/ai/flows/ai-powered-diagnosis.ts';
import '@/ai/flows/answer-questions-from-kb.ts';
import '@/ai/flows/suggest-reusable-parts.ts';
import '@/ai/flows/troubleshoot-with-chatbot.ts';