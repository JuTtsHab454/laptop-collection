'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toggle from '@/components/ui/Toggle';
import toast from 'react-hot-toast';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/brands');
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (err) {
      toast.error('Failed to load brands');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setSortOrder(brands.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BrandItem) => {
    setEditingId(b.id);
    setName(b.name);
    setSlug(b.slug);
    setSortOrder(b.sortOrder);
    setIsActive(b.isActive);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error('Name and slug are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        slug,
        sortOrder: Number(sortOrder),
        isActive,
      };

      const url = editingId ? `/api/admin/brands/${editingId}` : '/api/admin/brands';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save brand');
      }

      toast.success(editingId ? 'Brand updated!' : 'Brand created!');
      setIsModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      toast.success('Brand deleted');
      fetchBrands();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete brand');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-steel">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Brands</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage hardware manufacturers (HP, Dell, Lenovo, Apple, etc.).
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Brand
        </Button>
      </div>

      <div className="rounded-2xl bg-brand-charcoal border border-brand-steel overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-brand-navy text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-brand-steel">
            <tr>
              <th className="p-4">Brand Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Assigned Products</th>
              <th className="p-4">Sort Order</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-steel/50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Loading brands...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No brands defined.
                </td>
              </tr>
            ) : (
              brands.map((b) => (
                <tr key={b.id} className="hover:bg-brand-slate/30 transition-colors">
                  <td className="p-4 font-bold text-white">{b.name}</td>
                  <td className="p-4 font-mono text-accent-blue">{b.slug}</td>
                  <td className="p-4 text-slate-300 font-semibold">{b._count?.products ?? 0}</td>
                  <td className="p-4 font-mono">{b.sortOrder}</td>
                  <td className="p-4">
                    {b.isActive ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 uppercase">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded bg-brand-slate text-accent-blue hover:bg-brand-steel"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="p-1.5 rounded bg-brand-slate text-red-400 hover:bg-brand-steel"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Brand Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Brand' : 'Add New Brand'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Brand Name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          />

          <Input
            label="URL Slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white font-mono"
          />

          <Input
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className="bg-brand-navy border-brand-steel text-white font-mono"
          />

          <div className="pt-2">
            <Toggle label="Active" checked={isActive} onChange={setIsActive} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-brand-steel">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {editingId ? 'Save Changes' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
