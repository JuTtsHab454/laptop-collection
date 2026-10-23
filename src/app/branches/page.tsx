import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Our Branches in Lahore & Islamabad — Laptop Collection',
  description: 'Visit our physical branches in Lahore and Islamabad for in-person laptop inspection and pickup.',
};

export const dynamic = 'force-dynamic';

export default async function BranchesPage() {
  let branches: any[] = [];
  try {
    branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (err) {
    console.warn('Database error in BranchesPage:', err);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Our Branches' }]} />

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Locations</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Our Physical Branches</h1>
        <p className="text-xs sm:text-sm text-gray-600">
          We welcome customers to visit our branches in Lahore and Islamabad to check laptop aesthetics, display quality, and test battery life in person.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="p-6 sm:p-8 rounded-3xl bg-white border border-surface-muted shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-accent-blue font-bold text-lg">
              <MapPin className="w-5 h-5" />
              <span>{b.name}</span>
            </div>

            <div className="text-xs text-gray-600 space-y-2 border-t border-b border-surface-muted py-4">
              <p>
                <strong className="text-gray-900">City:</strong> {b.city}
              </p>
              <p>
                <strong className="text-gray-900">Address:</strong>{' '}
                {b.address || 'Address details coming soon. Please contact us on WhatsApp before visiting.'}
              </p>
              {b.contactNumber && (
                <p>
                  <strong className="text-gray-900">Contact Number:</strong> {b.contactNumber}
                </p>
              )}
              {b.operatingHours && (
                <p>
                  <strong className="text-gray-900">Working Hours:</strong> {b.operatingHours}
                </p>
              )}
            </div>

            {b.mapLink ? (
              <a
                href={b.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-accent-blue hover:underline block"
              >
                Open Google Maps Location →
              </a>
            ) : (
              <p className="text-[11px] text-gray-400">Map location available upon appointment.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
