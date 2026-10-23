'use client';

import React, { useState, useEffect } from 'react';
import { Percent, Plus, Trash2, Calendar, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import Toggle from '@/components/ui/Toggle';
import toast from 'react-hot-toast';
import { formatPKR } from '@/components/ui/PriceDisplay';

interface DiscountItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  productId: string | null;
  product?: { title: string; slug: string; basePrice: number } | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}

interface ProductOption {
  id: string;
  title: string;
  basePrice: number;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState<number>(10);
  const [productId, setProductId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      setDiscounts(data.discounts || []);
    } catch (err) {
      toast.error('Failed to load discounts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products?limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setName('');
    setDescription('');
    setType('percentage');
    setValue(10);
    setProductId('');
    setStartDate('');
    setEndDate('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value || value <= 0) {
      toast.error('Valid name and discount amount required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          type,
          value: Number(value),
          productId: productId || null,
          startDate: startDate || null,
          endDate: endDate || null,
          isActive,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create discount');
      }

      toast.success('Discount created successfully!');
      setIsModalOpen(false);
      fetchDiscounts();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete discount promotion "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Discount removed');
      fetchDiscounts();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting discount');
    }
  };

  const selectedProduct = products.find((p) => p.id === productId);
  const effectivePrice = selectedProduct
    ? type === 'percentage'
      ? selectedProduct.basePrice * (1 - value / 100)
      : Math.max(0, selectedProduct.basePrice - value)
    : null;

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-steel">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Discounts & Promotions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create percentage or flat PKR price deductions for special sales.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Discount
        </Button>
      </div>

      <div className="rounded-2xl bg-brand-charcoal border border-brand-steel overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-brand-navy text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-brand-steel">
            <tr>
              <th className="p-4">Promotion Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Discount Value</th>
              <th className="p-4">Applied Product</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-steel/50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Loading promotions...
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No discounts currently defined.
                </td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.id} className="hover:bg-brand-slate/30 transition-colors">
                  <td className="p-4 font-bold text-white">{d.name}</td>
                  <td className="p-4 uppercase font-semibold text-accent-silver">{d.type}</td>
                  <td className="p-4 font-mono font-bold text-accent-gold">
                    {d.type === 'percentage' ? `${d.value}% OFF` : `−Rs ${formatPKR(d.value)}`}
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    {d.product?.title || 'All / General'}
                  </td>
                  <td className="p-4 text-slate-400">
                    {d.startDate ? new Date(d.startDate).toLocaleDateString() : 'Immediate'} →{' '}
                    {d.endDate ? new Date(d.endDate).toLocaleDateString() : 'Indefinite'}
                  </td>
                  <td className="p-4">
                    {d.isActive ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 uppercase">
                        Paused
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(d.id, d.name)}
                      className="p-1.5 rounded bg-brand-slate text-red-400 hover:bg-brand-steel"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Discount Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promotion">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Promotion Name"
            required
            placeholder="e.g. Ramadan Special / Student Clearance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Discount Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed PKR Amount (Rs)</option>
            </Select>

            <Input
              label={type === 'percentage' ? 'Percentage (1-90%)' : 'Amount (Rs)'}
              type="number"
              required
              min={1}
              max={type === 'percentage' ? 90 : 100000}
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="bg-brand-navy border-brand-steel text-white font-mono"
            />
          </div>

          <Select
            label="Apply to Specific Product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          >
            <option value="">Store-wide / Not specific</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (Rs {formatPKR(p.basePrice)})
              </option>
            ))}
          </Select>

          {effectivePrice !== null && selectedProduct && (
            <div className="p-3 rounded-xl bg-brand-navy border border-brand-steel text-xs space-y-1">
              <span className="text-slate-400">Effective Discounted Price Preview:</span>
              <p className="font-mono text-accent-gold font-bold text-sm">
                Rs {formatPKR(effectivePrice)}
                <span className="text-slate-400 text-xs font-normal line-through ml-2">
                  Rs {formatPKR(selectedProduct.basePrice)}
                </span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date (Optional)"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />
            <Input
              label="End Date (Optional)"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />
          </div>

          <div className="pt-2">
            <Toggle label="Active Immediately" checked={isActive} onChange={setIsActive} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-brand-steel">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Create Promotion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
