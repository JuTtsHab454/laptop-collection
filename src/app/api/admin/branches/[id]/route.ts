import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, city, address, mapLink, contactNumber, operatingHours, isActive, sortOrder } =
      body;

    const branch = await prisma.branch.update({
      where: { id: params.id },
      data: {
        name,
        city,
        address: address || null,
        mapLink: mapLink || null,
        contactNumber: contactNumber || null,
        operatingHours: operatingHours || null,
        isActive: !!isActive,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ branch });
  } catch (error: any) {
    console.error('Branch PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update branch' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.branch.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Branch DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete branch' }, { status: 500 });
  }
}
