import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Component from '@/lib/models/Component';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const component = await Component.findById(params.id);
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    return NextResponse.json(component);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch component' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const component = await Component.findByIdAndUpdate(params.id, body, { new: true });
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    return NextResponse.json(component);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update component' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const component = await Component.findByIdAndUpdate(params.id, { softDeleted: true }, { new: true });
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Component deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete component' }, { status: 500 });
  }
}


