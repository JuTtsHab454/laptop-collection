import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const revalidate = 60;

interface PolicyContent {
  title: string;
  description: string;
  content: string;
}

const policyData: Record<string, PolicyContent> = {
  delivery: {
    title: 'Nationwide Delivery Policy',
    description: 'Guidelines regarding shipping, courier handling, transit times, and parcel inspection.',
    content: `### 1. Delivery Coverage
Laptop Collection delivers laptops, RAM, SSDs, and computer accessories across all major cities and regional towns throughout Pakistan (including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and Sialkot).

### 2. Processing & Transit Times
- Orders placed before 4:00 PM (Monday through Saturday) are typically verified and dispatched on the same business day after receipt of bank payment confirmation.
- Standard courier delivery transit time is 24 to 48 hours for major urban centers, and 48 to 72 hours for remote or peripheral districts.

### 3. Secure Packaging
All laptops and hardware components are packed with multi-layer high-density bubble cushioning, corner shock-absorbers, and tamper-resistant courier bags.

### 4. Parcel Receiving Protocol
Customers are requested to inspect the external physical condition of the packaging upon handover by the courier rider before signing the delivery receipt.`,
  },
  returns: {
    title: 'Returns & Replacement Policy',
    description: 'Terms governing hardware check time, exchanges, and eligibility.',
    content: `### 1. Checking Period & Eligibility
Because we conduct extensive quality control on all items prior to shipment, we provide a 7-day checking warranty on all laptops from the date of recorded delivery.

### 2. Valid Grounds for Replacement
- Hardware defects not disclosed in the listing (e.g. faulty RAM slot, undetected SSD, defective keyboard key).
- Discrepancy between the delivered device and the advertised model/specifications.

### 3. Exclusions
- Physical damage caused by drops, impacts, or excessive pressure.
- Liquid spillage or moisture exposure.
- Any unauthorized repair, opening of internal chassis, or BIOS flashing.`,
  },
  warranty: {
    title: 'Warranty & Check Time Policy',
    description: 'Detailed scope of checking warranty provided by Laptop Collection.',
    content: `### 1. Scope of Coverage
Every laptop includes our shop checking warranty covering:
- Motherboard and processor functionality
- Screen panel display and backlight integrity
- Integrated keyboard, trackpad, and webcam
- Battery charge retention and original charger operation

### 2. Claim Procedure
To file a warranty inquiry:
1. Contact our WhatsApp support team at +92 313 4951239 within the 7-day checking window.
2. Provide your order number and brief description/video of the observed issue.
3. Our technical team will assist with troubleshooting or authorize a return/replacement.`,
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How Laptop Collection handles customer information.',
    content: `### 1. Information Collected
We collect customer contact details (name, WhatsApp/phone number, delivery address, city) solely to process orders, facilitate courier dispatch, and provide after-sales warranty support.

### 2. Data Security
We do not sell, rent, or distribute customer details to third-party marketing firms. Customer data is stored securely and accessible only to authorized administration personnel for order fulfillment.`,
  },
  terms: {
    title: 'Terms of Service',
    description: 'Conditions governing orders and transactions on Laptop Collection.',
    content: `### 1. Orders & Pricing
All orders placed on Laptop Collection are subject to product stock verification and manual bank payment verification. Prices are stated in Pakistani Rupees (PKR).

### 2. Payment Terms
Full advance payment via official bank transfer is required to confirm hardware allocation. Orders remain in pending status until the deposit slip is reviewed.

### 3. Product Accuracy
We strive to display exact specifications, photos, and condition ratings for all items. Slight cosmetic wear consistent with stated condition ratings (e.g. 'USED') may be present.`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const policy = policyData[params.slug];
  if (!policy) return { title: 'Policy Not Found' };
  return {
    title: `${policy.title} — Laptop Collection`,
    description: policy.description,
  };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = policyData[params.slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Policies' }, { label: policy.title }]} />

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Policy</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          {policy.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">{policy.description}</p>
      </div>

      <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 bg-white p-6 sm:p-10 rounded-3xl border border-surface-muted shadow-sm whitespace-pre-line leading-relaxed">
        {policy.content}
      </div>
    </div>
  );
}
