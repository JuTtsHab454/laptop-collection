import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Calendar, Clock, MessageCircle, ArrowLeft, Share2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BlogShareButtons from '@/components/blog/BlogShareButtons';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post) return { title: 'Article Not Found' };

    const title = post.metaTitle || `${post.title} — Laptop Collection`;
    const description = post.metaDescription || post.excerpt || post.title;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
      },
    };
  } catch (err) {
    return { title: 'Laptop Collection Blog' };
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Reading time estimate (approx 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Related articles
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Laptop Collection',
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

      {/* Article Header */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue">
          {post.category || 'Guide'}
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b border-surface-muted pb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-PK', { dateStyle: 'long' }) : 'Recent'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {readTimeMin} min read
          </span>
        </div>
      </div>

      {/* Article Body */}
      <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 bg-white p-6 sm:p-10 rounded-3xl border border-surface-muted shadow-sm whitespace-pre-line leading-relaxed">
        {post.content}
      </div>

      {/* Share Buttons */}
      <div className="p-6 rounded-2xl bg-surface-cream border border-surface-muted flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-gray-700">Share this guide with friends:</span>
        <BlogShareButtons title={post.title} slug={post.slug} />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="pt-8 border-t border-surface-muted space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="p-5 rounded-2xl bg-white border border-surface-muted hover:border-accent-blue shadow-sm transition-all"
              >
                <span className="text-[10px] font-bold uppercase text-accent-blue block mb-1">
                  {r.category || 'Article'}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2">{r.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
