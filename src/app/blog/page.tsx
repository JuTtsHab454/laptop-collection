import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Laptop Buying Guides, Tutorials & News — Laptop Collection Blog',
  description:
    'Comprehensive guides on choosing the right laptop specs, SSD upgrades, RAM benchmarks, and troubleshooting in Pakistan.',
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCat = searchParams.category;

  const where: any = {
    status: 'PUBLISHED',
  };
  if (selectedCat) where.category = selectedCat;

  let posts: any[] = [];
  let categories: any[] = [];

  try {
    const res = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { category: true },
        distinct: ['category'],
      }),
    ]);
    posts = res[0];
    categories = res[1];
  } catch (err) {
    console.warn('Database error in BlogIndexPage:', err);
  }

  const categoryList = categories
    .map((c) => c.category)
    .filter((c): c is string => Boolean(c));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Blog' }]} />

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Knowledge Base</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Laptop Buying Guides &amp; Insights
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
          Learn how to pick processors, understand RAM types, choose fast NVMe SSDs, and maintain battery health.
        </p>
      </div>

      {/* Category Pills */}
      {categoryList.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              !selectedCat ? 'bg-accent-blue text-white' : 'bg-white border text-gray-700 hover:border-gray-400'
            }`}
          >
            All Articles
          </Link>
          {categoryList.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-accent-blue text-white'
                  : 'bg-white border text-gray-700 hover:border-gray-400'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed rounded-3xl bg-white space-y-2">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="font-bold text-gray-900 text-sm">No articles found in this category</p>
          <p className="text-xs text-gray-500">Check back soon for upcoming guides!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-3xl bg-white border border-surface-muted overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6 sm:p-7 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-accent-blue/10 text-accent-blue">
                  {post.category || 'Guide'}
                </span>
                <h2 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-accent-blue transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {post.excerpt || post.content.substring(0, 160)}
                </p>
              </div>

              <div className="px-6 sm:px-7 py-4 border-t border-surface-muted flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                </span>
                <span className="font-bold text-accent-blue group-hover:underline flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
