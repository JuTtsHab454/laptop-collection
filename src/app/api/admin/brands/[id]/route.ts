import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, slug, logo, isActive, sortOrder } = body;

    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        logo,
        isActive: !!isActive,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ brand });
  } catch (error: any) {
    console.error('Brand PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productCount = await prisma.product.count({
      where: { brandId: params.id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete brand: ${productCount} products are linked to it.` },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Brand DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete brand' }, { status: 500 });
  }
}
