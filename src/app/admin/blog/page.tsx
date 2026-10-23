import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { FileText, PlusCircle, Edit, Eye, Trash2 } from 'lucide-react';
import AdminBlogDeleteButton from '@/components/admin/AdminBlogDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-steel">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Blog Articles & Guides</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish laptop buying guides, maintenance tutorials, and comparison articles.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-blue text-white text-xs font-bold hover:bg-accent-blue-dark shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      <div className="rounded-2xl bg-brand-charcoal border border-brand-steel overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-brand-navy text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-brand-steel">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Published Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-steel/50">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400">
                  No articles written yet. Write your first guide!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-brand-slate/30 transition-colors">
                  <td className="p-4 max-w-sm">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="font-bold text-white hover:text-accent-blue line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <span className="text-[11px] font-mono text-slate-400">/{post.slug}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{post.category || 'General'}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        post.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'PUBLISHED' && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded bg-brand-slate text-slate-300 hover:text-white"
                          title="View Public Post"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-1.5 rounded bg-brand-slate text-accent-blue hover:bg-brand-steel"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <AdminBlogDeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
