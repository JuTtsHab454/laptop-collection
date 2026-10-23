import prisma from '@/lib/prisma';
import { ProductCardData } from '@/components/product/ProductCard';

export interface ProductSearchParams {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  inStock?: string;
  sort?: string;
  page?: string;
  search?: string;
  dealsOnly?: boolean;
}

export async function getFilteredProducts(params: ProductSearchParams) {
  const page = parseInt(params.page || '1', 10);
  const limit = 18;

  const where: any = {
    status: 'PUBLISHED',
  };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.brand) {
    const brandSlugs = params.brand.split(',').filter(Boolean);
    if (brandSlugs.length > 0) {
      where.brand = { slug: { in: brandSlugs, mode: 'insensitive' } };
    }
  }

  if (params.condition) {
    where.condition = params.condition;
  }

  if (params.inStock === 'true') {
    where.stock = { gt: 0 };
  }

  if (params.dealsOnly) {
    where.isOnSale = true;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { sku: { contains: params.search, mode: 'insensitive' } },
      { shortDescription: { contains: params.search, mode: 'insensitive' } },
      { brand: { name: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  const minP = parseFloat(params.minPrice || '');
  const maxP = parseFloat(params.maxPrice || '');

  if (!isNaN(minP) || !isNaN(maxP)) {
    where.basePrice = {};
    if (!isNaN(minP)) where.basePrice.gte = minP;
    if (!isNaN(maxP)) where.basePrice.lte = maxP;
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (params.sort === 'price_asc') {
    orderBy = { basePrice: 'asc' };
  } else if (params.sort === 'price_desc') {
    orderBy = { basePrice: 'desc' };
  } else if (params.sort === 'discount') {
    orderBy = { originalPrice: 'desc' };
  }

  let total = 0;
  let rawProducts: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];

  try {
    const results = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    total = results[0];
    rawProducts = results[1];
    categories = results[2];
    brands = results[3];
  } catch (err) {
    console.warn('Database error in getFilteredProducts:', err);
  }

  const products: ProductCardData[] = rawProducts.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    basePrice: p.basePrice,
    originalPrice: p.originalPrice,
    stock: p.stock,
    condition: p.condition as any,
    isFeatured: p.isFeatured,
    isOnSale: p.isOnSale,
    category: p.category,
    brand: p.brand,
    specifications: (p.specifications || {}) as Record<string, any>,
    images: (p.images || []).map((img: any) => ({ url: img.url, alt: img.alt })),
    hasChargerOption: p.hasChargerOption,
    hasBagOption: p.hasBagOption,
  }));

  return {
    products,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    categories,
    brands,
  };
}
