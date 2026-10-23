import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ branches });
  } catch (error) {
    console.error('Branches GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, city, address, mapLink, contactNumber, operatingHours, isActive, sortOrder } =
      body;

    if (!name || !city) {
      return NextResponse.json({ error: 'Name and City are required' }, { status: 400 });
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        city,
        address: address || null,
        mapLink: mapLink || null,
        contactNumber: contactNumber || null,
        operatingHours: operatingHours || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ branch }, { status: 201 });
  } catch (error: any) {
    console.error('Branches POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create branch' }, { status: 500 });
  }
}
