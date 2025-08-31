import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import KnowledgeBase from '@/lib/models/KnowledgeBase';

export async function GET() {
  try {
    await connectDB();
    const knowledgeBases = await KnowledgeBase.find({ softDeleted: false }).sort({ createdAt: -1 });
    return NextResponse.json(knowledgeBases);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const knowledgeBase = await KnowledgeBase.create(body);
    return NextResponse.json(knowledgeBase, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create knowledge base' }, { status: 500 });
  }
}

