'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

interface BlogPostFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    featuredImage?: string | null;
    category?: string | null;
    tags?: string[];
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
}

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'Buying Guides');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'SCHEDULED'>(
    initialData?.status || 'DRAFT'
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData?.id) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (targetStatus?: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error('Title, slug, and article content are required.');
      return;
    }

    setIsSubmitting(true);
    const finalStatus = targetStatus || status;

    const payload = {
      title,
      slug,
      excerpt,
      content,
      category,
      status: finalStatus,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
    };

    try {
      const url = initialData?.id ? `/api/admin/blog/${initialData.id}` : '/api/admin/blog';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save blog post');
      }

      toast.success(initialData?.id ? 'Post updated!' : 'Post created!');
      router.push('/admin/blog');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/blog')}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Blog List
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => handleSubmit('DRAFT')}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => handleSubmit('PUBLISHED')}
          >
            <Save className="w-4 h-4 mr-1.5" />
            Publish Article
          </Button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-5">
        <Input
          label="Article Title"
          required
          placeholder="e.g. Best Budget Laptops for University Students in Pakistan (2024)"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="bg-brand-navy border-brand-steel text-white text-base font-bold"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="URL Slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white font-mono text-xs"
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          >
            <option value="Buying Guides">Buying Guides</option>
            <option value="Comparisons">Comparisons</option>
            <option value="Tutorials & Tips">Tutorials & Tips</option>
            <option value="Troubleshooting">Troubleshooting</option>
            <option value="News & Deals">News & Deals</option>
          </Select>
        </div>

        <Textarea
          label="Short Excerpt (Max 300 characters)"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary shown on blog list and Google search results..."
          className="bg-brand-navy border-brand-steel text-white"
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-300">
            Article Content (Markdown format supported) <span className="text-status-error">*</span>
          </label>
          <textarea
            rows={16}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article using Markdown (## Headings, **bold**, lists, tables)..."
            className="w-full rounded-lg border border-brand-steel bg-brand-navy px-4 py-3 text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:border-accent-blue"
          />
        </div>
      </div>
    </div>
  );
}
