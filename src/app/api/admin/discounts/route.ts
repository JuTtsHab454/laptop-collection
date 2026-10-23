import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      include: {
        product: { select: { title: true, slug: true, basePrice: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ discounts });
  } catch (error) {
    console.error('Discounts GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, type, value, productId, categoryId, isActive, startDate, endDate } =
      body;

    if (!name || !value || value <= 0) {
      return NextResponse.json({ error: 'Valid name and discount value are required' }, { status: 400 });
    }

    if (type === 'percentage' && value > 90) {
      return NextResponse.json({ error: 'Percentage discount cannot exceed 90%' }, { status: 400 });
    }

    const discount = await prisma.discount.create({
      data: {
        name,
        description,
        type: type || 'percentage',
        value: Number(value),
        productId: productId || null,
        categoryId: categoryId || null,
        isActive: isActive ?? true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    // Mark product as isOnSale if linked to product
    if (productId && isActive) {
      await prisma.product.update({
        where: { id: productId },
        data: { isOnSale: true },
      });
    }

    return NextResponse.json({ discount }, { status: 201 });
  } catch (error: any) {
    console.error('Discounts POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create discount' }, { status: 500 });
  }
}
