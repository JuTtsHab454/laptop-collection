'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toggle from '@/components/ui/Toggle';
import toast from 'react-hot-toast';

interface BranchItem {
  id: string;
  name: string;
  city: string;
  address: string | null;
  mapLink: string | null;
  contactNumber: string | null;
  operatingHours: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/branches');
      const data = await res.json();
      setBranches(data.branches || []);
    } catch (err) {
      toast.error('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCity('');
    setAddress('');
    setContactNumber('');
    setOperatingHours('');
    setMapLink('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BranchItem) => {
    setEditingId(b.id);
    setName(b.name);
    setCity(b.city);
    setAddress(b.address || '');
    setContactNumber(b.contactNumber || '');
    setOperatingHours(b.operatingHours || '');
    setMapLink(b.mapLink || '');
    setIsActive(b.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) {
      toast.error('Branch name and City are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        city,
        address: address || null,
        contactNumber: contactNumber || null,
        operatingHours: operatingHours || null,
        mapLink: mapLink || null,
        isActive,
      };

      const url = editingId ? `/api/admin/branches/${editingId}` : '/api/admin/branches';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save branch');

      toast.success(editingId ? 'Branch updated!' : 'Branch created!');
      setIsModalOpen(false);
      fetchBranches();
    } catch (err: any) {
      toast.error(err.message || 'Error saving branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete branch "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/branches/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Branch removed');
      fetchBranches();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting branch');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-steel">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Branches</h1>
          <p className="text-xs text-slate-400 mt-1">
            Display your physical shop locations in Lahore and Islamabad.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-blue" />
                <h3 className="font-bold text-white text-base">{b.name}</h3>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-1.5 rounded bg-brand-slate text-accent-blue hover:bg-brand-steel"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  className="p-1.5 rounded bg-brand-slate text-red-400 hover:bg-brand-steel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>
                <strong className="text-slate-400">City:</strong> {b.city}
              </p>
              <p>
                <strong className="text-slate-400">Address:</strong>{' '}
                {b.address || <span className="text-slate-500 italic">Address coming soon</span>}
              </p>
              {b.contactNumber && (
                <p>
                  <strong className="text-slate-400">Phone:</strong> {b.contactNumber}
                </p>
              )}
              {b.operatingHours && (
                <p>
                  <strong className="text-slate-400">Hours:</strong> {b.operatingHours}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Branch' : 'Add New Branch'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Branch Name"
            required
            placeholder="e.g. Lahore Hafeez Centre Branch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          />

          <Input
            label="City"
            required
            placeholder="Lahore / Islamabad / Karachi"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          />

          <Input
            label="Street Address (Optional)"
            placeholder="Leave blank if address is not finalized"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Number (Optional)"
              placeholder="e.g. 0313-4951239"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />

            <Input
              label="Operating Hours (Optional)"
              placeholder="e.g. Mon-Sat: 11am - 9pm"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />
          </div>

          <Input
            label="Google Maps Embed Link (Optional)"
            placeholder="https://maps.google.com/..."
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white font-mono text-xs"
          />

          <div className="pt-2">
            <Toggle label="Active & Display on Site" checked={isActive} onChange={setIsActive} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-brand-steel">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {editingId ? 'Save Changes' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
