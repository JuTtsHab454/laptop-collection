import React from 'react';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-steel pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Write Blog Article</h1>
        <p className="text-xs text-slate-400 mt-1">
          Create guides and tutorials to educate customers and boost search rankings.
        </p>
      </div>

      <BlogPostForm />
    </div>
  );
}
