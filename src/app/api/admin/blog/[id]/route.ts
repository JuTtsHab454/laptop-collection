import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Blog GET ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, featuredImage, category, tags, status, metaTitle, metaDescription } =
      body;

    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        category,
        tags: Array.isArray(tags) ? tags : [],
        status,
        publishedAt:
          status === 'PUBLISHED' && !existing?.publishedAt
            ? new Date()
            : status === 'DRAFT'
            ? null
            : existing?.publishedAt,
        metaTitle,
        metaDescription,
      },
    });

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Blog PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blogPost.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete post' }, { status: 500 });
  }
}
