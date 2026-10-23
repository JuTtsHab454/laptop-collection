import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Us — Laptop Collection Pakistan',
  description: 'Reach our team on WhatsApp, direct phone call, or visit our Lahore & Islamabad branches.',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let settingsList: any[] = [];
  let branches: any[] = [];

  try {
    const res = await Promise.all([
      prisma.siteSetting.findMany({
        where: {
          key: { in: ['whatsapp_number', 'call_number', 'contact_email'] },
        },
      }),
      prisma.branch.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);
    settingsList = res[0];
    branches = res[1];
  } catch (err) {
    console.warn('Database error in ContactPage:', err);
  }

  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  const wa = settings.whatsapp_number || '923134951239';
  const tel = settings.call_number || '923134951239';
  const email = settings.contact_email || 'support@laptopcollection.pk';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Contact Us</h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Have a question about a laptop specification, availability, or need custom upgrade advice? We are here to assist.
        </p>
      </div>

      {/* Main Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${wa.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-3xl bg-white border border-surface-muted hover:border-[#25D366] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
        >
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">WhatsApp Chat</h3>
            <p className="text-xs text-gray-500 mt-0.5">Quick replies &amp; quote requests</p>
            <p className="font-mono text-accent-blue font-bold text-sm mt-2">+{wa}</p>
          </div>
        </a>

        {/* Direct Call */}
        <a
          href={`tel:+${tel.replace(/[^0-9+]/g, '')}`}
          className="p-6 rounded-3xl bg-white border border-surface-muted hover:border-accent-blue shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
        >
          <div className="p-3 w-fit rounded-2xl bg-accent-blue/10 text-accent-blue group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Direct Phone Call</h3>
            <p className="text-xs text-gray-500 mt-0.5">Speak with a hardware consultant</p>
            <p className="font-mono text-accent-blue font-bold text-sm mt-2">+{tel}</p>
          </div>
        </a>

        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="p-6 rounded-3xl bg-white border border-surface-muted hover:border-gray-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
        >
          <div className="p-3 w-fit rounded-2xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Email Support</h3>
            <p className="text-xs text-gray-500 mt-0.5">Corporate &amp; bulk orders</p>
            <p className="font-mono text-gray-700 font-bold text-xs mt-2 truncate">{email}</p>
          </div>
        </a>
      </div>

      {/* Branches */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-gray-900">Branch Locations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="p-6 rounded-3xl bg-white border border-surface-muted shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-accent-blue font-bold text-base">
                <MapPin className="w-5 h-5" />
                <span>{b.name}</span>
              </div>
              <p className="text-xs text-gray-600">
                <strong>City:</strong> {b.city}
              </p>
              <p className="text-xs text-gray-600">
                <strong>Address:</strong> {b.address || 'Address details coming soon. Call support for branch visit.'}
              </p>
              {b.contactNumber && (
                <p className="text-xs text-gray-600">
                  <strong>Phone:</strong> {b.contactNumber}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
