import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Component from '@/lib/models/Component';

export async function GET() {
  try {
    await connectDB();
    const components = await Component.find({ softDeleted: false }).sort({ createdAt: -1 });
    return NextResponse.json(components);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const component = await Component.create(body);
    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
  }
}

