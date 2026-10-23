import prisma from '@/lib/prisma';
import { ProductCardData } from '@/components/product/ProductCard';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/catalog';

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
          reviews: {
            where: { isApproved: true },
            select: { rating: true },
          },
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

  let products: ProductCardData[] = [];

  // Fallback to in-memory INITIAL_PRODUCTS if database is unseeded or query returns 0
  if (rawProducts.length === 0) {
    let fallbackList = [...INITIAL_PRODUCTS];

    if (params.category) {
      const catSlug = params.category.toLowerCase();
      fallbackList = fallbackList.filter((p) => {
        const pCat = p.category?.slug?.toLowerCase();
        if (!pCat) return false;
        if (pCat === catSlug) return true;
        // Aliases and subcategory mappings
        if (catSlug === 'accessories' && ['mice-accessories', 'laptop-bags', 'cooling-pads', 'chargers', 'ram', 'ssds'].includes(pCat)) return true;
        if ((catSlug === 'mice' || catSlug === 'accessories/mice') && pCat === 'mice-accessories') return true;
        if ((catSlug === 'bags' || catSlug === 'accessories/bags') && pCat === 'laptop-bags') return true;
        if ((catSlug === 'cooling-pads' || catSlug === 'accessories/cooling-pads') && pCat === 'cooling-pads') return true;
        return false;
      });
    }

    if (params.brand) {
      const brandSlugs = params.brand.toLowerCase().split(',').filter(Boolean);
      if (brandSlugs.length > 0) {
        fallbackList = fallbackList.filter((p) => {
          const pBrand = p.brand?.name?.toLowerCase();
          return pBrand && brandSlugs.some((bs) => pBrand.includes(bs));
        });
      }
    }

    if (params.condition) {
      fallbackList = fallbackList.filter((p) => p.condition === params.condition);
    }

    if (params.inStock === 'true') {
      fallbackList = fallbackList.filter((p) => p.stock > 0);
    }

    if (params.dealsOnly) {
      fallbackList = fallbackList.filter((p) => p.isOnSale);
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      fallbackList = fallbackList.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const brandMatch = p.brand?.name?.toLowerCase().includes(q);
        const slugMatch = p.slug.toLowerCase().includes(q);
        const descMatch = (p.shortDescription || '').toLowerCase().includes(q);
        return titleMatch || brandMatch || slugMatch || descMatch;
      });
    }

    if (!isNaN(minP)) {
      fallbackList = fallbackList.filter((p) => p.basePrice >= minP);
    }

    if (!isNaN(maxP)) {
      fallbackList = fallbackList.filter((p) => p.basePrice <= maxP);
    }

    // Sort in-memory
    if (params.sort === 'price_asc') {
      fallbackList.sort((a, b) => a.basePrice - b.basePrice);
    } else if (params.sort === 'price_desc') {
      fallbackList.sort((a, b) => b.basePrice - a.basePrice);
    } else if (params.sort === 'discount') {
      fallbackList.sort((a, b) => {
        const discA = a.originalPrice ? a.originalPrice - a.basePrice : 0;
        const discB = b.originalPrice ? b.originalPrice - b.basePrice : 0;
        return discB - discA;
      });
    }

    total = fallbackList.length;
    const startIndex = (page - 1) * limit;
    products = fallbackList.slice(startIndex, startIndex + limit);
  } else {
    products = rawProducts.map((p: any) => {
      const revs = p.reviews || [];
      const count = revs.length;
      const avg =
        count > 0
          ? parseFloat(
              (revs.reduce((sum: number, r: any) => sum + r.rating, 0) / count).toFixed(1)
            )
          : null;

      return {
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
        rating: avg,
        reviewCount: count,
      };
    });
  }

  if (categories.length === 0) {
    categories = INITIAL_CATEGORIES;
  }
  if (brands.length === 0) {
    brands = INITIAL_BRANDS;
  }

  return {
    products,
    total,
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    categories,
    brands,
  };
}
