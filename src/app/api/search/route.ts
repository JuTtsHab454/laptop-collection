export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!query.trim()) {
      return NextResponse.json({ products: [] });
    }

    const cleanQuery = query.trim();

    const products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: cleanQuery, mode: 'insensitive' } },
          { sku: { contains: cleanQuery, mode: 'insensitive' } },
          { shortDescription: { contains: cleanQuery, mode: 'insensitive' } },
          { brand: { name: { contains: cleanQuery, mode: 'insensitive' } } },
          { category: { name: { contains: cleanQuery, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        basePrice: true,
        originalPrice: true,
        stock: true,
        condition: true,
        category: {
          select: { name: true, slug: true },
        },
        brand: {
          select: { name: true },
        },
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' },
          select: { url: true, alt: true },
        },
      },
      take: Math.min(limit, 50),
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
