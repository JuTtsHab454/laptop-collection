import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laptopcollection.pk';

  let products: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; updatedAt: Date }[] = [];

  try {
    const [fetchedProducts, fetchedPosts] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    products = fetchedProducts;
    posts = fetchedPosts;
  } catch (err) {
    console.warn('Could not query database during sitemap generation:', err);
  }

  const staticRoutes = [
    '',
    '/laptops',
    '/ram',
    '/ssds',
    '/chargers',
    '/accessories',
    '/accessories/mice',
    '/accessories/bags',
    '/accessories/cooling-pads',
    '/deals',
    '/about',
    '/contact',
    '/branches',
    '/blog',
    '/policies/delivery',
    '/policies/returns',
    '/policies/warranty',
    '/policies/privacy',
    '/policies/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
