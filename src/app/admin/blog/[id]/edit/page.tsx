import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BlogPostForm from '@/components/admin/BlogPostForm';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-steel pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Edit Blog Article</h1>
        <p className="text-xs text-slate-400 mt-1">
          Update article content, category, or publish status.
        </p>
      </div>

      <BlogPostForm initialData={post as any} />
    </div>
  );
}
