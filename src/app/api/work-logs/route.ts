import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkLog from '@/lib/models/WorkLog';

export async function GET() {
  try {
    await connectDB();
    const workLogs = await WorkLog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(workLogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch work logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const workLog = await WorkLog.create(body);
    return NextResponse.json(workLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create work log' }, { status: 500 });
  }
}

