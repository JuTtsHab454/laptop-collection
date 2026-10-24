import prisma from '@/lib/prisma';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/catalog';

/**
 * Idempotently syncs categories, brands, branches, and sample catalog products
 * directly into the Neon database tables.
 * Safe to run multiple times: never wipes, drops, or duplicates records.
 */
export async function syncCatalogToDatabase(): Promise<{
  categories: number;
  brands: number;
  products: number;
  images: number;
}> {
  console.log('[SYNC] Starting idempotent catalog database sync...');

  // 1. Sync Categories
  const categoryMap = new Map<string, string>();
  for (let idx = 0; idx < INITIAL_CATEGORIES.length; idx++) {
    const cat = INITIAL_CATEGORIES[idx];
    const saved = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: `Verified ${cat.name} in Pakistan`,
        sortOrder: idx + 1,
        isActive: true,
        isFeatured: true,
      },
    });
    categoryMap.set(cat.slug, saved.id);
    categoryMap.set(cat.id, saved.id);
  }

  // 2. Sync Brands
  const brandMap = new Map<string, string>();
  for (let idx = 0; idx < INITIAL_BRANDS.length; idx++) {
    const b = INITIAL_BRANDS[idx];
    const saved = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: {
        name: b.name,
        slug: b.slug,
        sortOrder: idx + 1,
        isActive: true,
      },
    });
    brandMap.set(b.slug.toLowerCase(), saved.id);
    brandMap.set(b.name.toLowerCase(), saved.id);
    brandMap.set(b.id, saved.id);
  }

  // Fallback category if none matches
  const defaultCategoryId = categoryMap.get('laptops') || Array.from(categoryMap.values())[0];

  // 3. Sync Products
  let productsCount = 0;
  let imagesCount = 0;

  for (const item of INITIAL_PRODUCTS) {
    const catId = (item.category?.slug && categoryMap.get(item.category.slug)) || defaultCategoryId;
    const brandId = item.brand?.name ? brandMap.get(item.brand.name.toLowerCase()) || null : null;

    const conditionValue =
      item.condition === 'NEW' || item.condition === 'USED' || item.condition === 'REFURBISHED'
        ? item.condition
        : 'NEW';

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        basePrice: item.basePrice,
        originalPrice: item.originalPrice || null,
        stock: item.stock,
        condition: conditionValue,
        isFeatured: item.isFeatured ?? false,
        isOnSale: item.isOnSale ?? false,
        status: 'PUBLISHED',
      },
      create: {
        title: item.title,
        slug: item.slug,
        sku: (item.slug || `LC-${Date.now()}`).toUpperCase().substring(0, 30),
        basePrice: item.basePrice,
        originalPrice: item.originalPrice || null,
        stock: item.stock,
        condition: conditionValue,
        status: 'PUBLISHED',
        isFeatured: item.isFeatured ?? false,
        isOnSale: item.isOnSale ?? false,
        shortDescription: item.shortDescription || item.title,
        description: item.description || item.title,
        warrantyInfo: item.warrantyInfo || '7-Day Checking Warranty',
        hasChargerOption: !!item.hasChargerOption,
        chargerDeduction: item.chargerDeduction || 3000,
        hasBagOption: !!item.hasBagOption,
        bagPrice: item.bagPrice || 2500,
        colors: item.colors || ['Silver'],
        specifications: (item.specifications || {}) as any,
        categoryId: catId,
        brandId: brandId,
      },
    });

    productsCount++;

    // Sync Images
    if (Array.isArray(item.images) && item.images.length > 0) {
      for (let imgIdx = 0; imgIdx < item.images.length; imgIdx++) {
        const img = item.images[imgIdx];
        if (!img || !img.url) continue;

        const existingImg = await prisma.productImage.findFirst({
          where: { productId: product.id, url: img.url },
        });

        if (!existingImg) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: img.url,
              alt: img.alt || product.title,
              isMain: imgIdx === 0,
              sortOrder: imgIdx,
            },
          });
          imagesCount++;
        }
      }
    }

    // Sync Variants
    if (Array.isArray(item.variants) && item.variants.length > 0) {
      for (let vIdx = 0; vIdx < item.variants.length; vIdx++) {
        const v = item.variants[vIdx];
        if (!v || !v.label) continue;

        const existingVariant = await prisma.productVariant.findFirst({
          where: { productId: product.id, label: v.label },
        });

        if (!existingVariant) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              variantType: v.variantType,
              label: v.label,
              priceAdjustment: Number(v.priceAdjustment) || 0,
              isDefault: !!v.isDefault,
              sortOrder: vIdx,
            },
          });
        }
      }
    }
  }

  console.log(
    `[SYNC] Completed! Synced ${categoryMap.size} categories, ${brandMap.size} brands, ${productsCount} products.`
  );

  return {
    categories: categoryMap.size,
    brands: brandMap.size,
    products: productsCount,
    images: imagesCount,
  };
}
