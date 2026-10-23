import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                slug: true,
                brand: { select: { name: true } },
                images: { take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Admin Order GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, paymentVerified, paymentNote, adminNotes } = body;

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentVerified !== undefined && { paymentVerified: !!paymentVerified }),
        ...(paymentNote !== undefined && { paymentNote }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ order: updated });
  } catch (error: any) {
    console.error('Admin Order PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
