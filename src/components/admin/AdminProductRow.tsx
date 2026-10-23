'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit, Eye, Trash2, Copy, Check, Loader2 } from 'lucide-react';
import { formatPKR } from '@/components/ui/PriceDisplay';
import toast from 'react-hot-toast';

interface ProductRowProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string | null;
    basePrice: number;
    stock: number;
    lowStockThreshold: number;
    status: string;
    condition: string;
    category: { name: string; slug: string };
    brand?: { name: string } | null;
    images: { url: string; alt?: string | null }[];
  };
}

export default function AdminProductRow({ product }: ProductRowProps) {
  const router = useRouter();
  const [stock, setStock] = useState<number>(product.stock);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const mainImage = product.images[0]?.url || '/placeholder-laptop.svg';

  const handleStockUpdate = async (newStock: number) => {
    setStock(newStock);
    setIsUpdatingStock(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (!res.ok) throw new Error('Failed to update stock');
      toast.success(`Stock updated to ${newStock}`);
    } catch (err) {
      toast.error('Failed to update stock');
      setStock(product.stock);
    } finally {
      setIsUpdatingStock(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${product.title}"?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Product deleted.');
      router.refresh();
    } catch (err) {
      toast.error('Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const fetchRes = await fetch(`/api/admin/products/${product.id}`);
      const data = await fetchRes.json();
      const p = data.product;

      const duplicatedData = {
        ...p,
        title: `${p.title} (Copy)`,
        slug: `${p.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
        sku: p.sku ? `${p.sku}-COPY` : null,
        status: 'DRAFT',
      };
      delete duplicatedData.id;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;

      const createRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedData),
      });

      if (!createRes.ok) throw new Error('Failed to duplicate');
      toast.success('Product cloned as Draft!');
      router.refresh();
    } catch (err) {
      toast.error('Failed to duplicate product.');
    }
  };

  const isLowStock = stock > 0 && stock <= product.lowStockThreshold;
  const isOutOfStock = stock <= 0;

  return (
    <tr className="hover:bg-brand-slate/30 transition-colors">
      <td className="p-4">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-navy border border-brand-steel flex-shrink-0">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        </div>
      </td>

      <td className="p-4 max-w-xs">
        <div className="font-bold text-white hover:text-accent-blue transition-colors line-clamp-1">
          <Link href={`/admin/products/${product.id}/edit`}>{product.title}</Link>
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          SKU: {product.sku || 'N/A'} • Condition: {product.condition}
        </div>
      </td>

      <td className="p-4 text-slate-300 font-medium">{product.category.name}</td>

      <td className="p-4 text-slate-300 font-medium">{product.brand?.name || '—'}</td>

      <td className="p-4 font-mono font-bold text-accent-blue whitespace-nowrap">
        Rs {formatPKR(product.basePrice)}
      </td>

      {/* Inline editable stock */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => handleStockUpdate(parseInt(e.target.value, 10) || 0)}
            className={`w-16 px-2 py-1 text-xs rounded border bg-brand-navy font-mono font-bold focus:outline-none focus:ring-1 focus:ring-accent-blue ${
              isOutOfStock
                ? 'border-status-error text-status-error'
                : isLowStock
                ? 'border-amber-500 text-amber-400'
                : 'border-brand-steel text-white'
            }`}
          />
          {isUpdatingStock && <Loader2 className="w-3.5 h-3.5 text-accent-blue animate-spin" />}
          {isOutOfStock && <span className="text-[10px] text-red-400 font-bold uppercase">OUT</span>}
          {isLowStock && <span className="text-[10px] text-amber-400 font-bold uppercase">LOW</span>}
        </div>
      </td>

      <td className="p-4">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
            product.status === 'PUBLISHED'
              ? 'bg-emerald-500/20 text-emerald-300'
              : product.status === 'ARCHIVED'
              ? 'bg-gray-500/20 text-gray-400'
              : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {product.status}
        </span>
      </td>

      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="p-1.5 rounded-lg bg-brand-slate text-slate-300 hover:text-white hover:bg-brand-steel"
            title="View public page"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/admin/products/${product.id}/edit`}
            className="p-1.5 rounded-lg bg-brand-slate text-accent-blue hover:bg-brand-steel"
            title="Edit product"
          >
            <Edit className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleDuplicate}
            className="p-1.5 rounded-lg bg-brand-slate text-slate-300 hover:text-white hover:bg-brand-steel"
            title="Duplicate product"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-brand-slate text-red-400 hover:text-white hover:bg-red-500/80 transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
