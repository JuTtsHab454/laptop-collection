'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  MessageCircle,
  Truck,
  ShieldCheck,
  Check,
  Zap,
  Briefcase,
  HelpCircle,
  RotateCcw,
  Minus,
  Plus,
  Star,
  User,
  CheckCircle2,
} from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import PriceDisplay, { formatPKR } from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { generateWhatsAppLink, OrderData } from '@/lib/whatsapp';
import toast from 'react-hot-toast';

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerified?: boolean;
  isDemo?: boolean;
  createdAt: string | Date;
}

interface VariantItem {
  id: string;
  variantType: string;
  label: string;
  priceAdjustment: number;
  isDefault: boolean;
  stock?: number | null;
}

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string | null;
    basePrice: number;
    originalPrice: number | null;
    condition: string;
    stock: number;
    shortDescription: string | null;
    description: string | null;
    warrantyInfo: string | null;
    hasChargerOption: boolean;
    chargerDeduction: number;
    hasBagOption: boolean;
    bagPrice: number;
    colors: string[];
    specifications: Record<string, any> | null;
    category: { name: string; slug: string };
    brand?: { name: string } | null;
    images: { id: string; url: string; alt?: string | null; isMain?: boolean }[];
    variants: VariantItem[];
    reviews?: ReviewItem[];
  };
  whatsappNumber?: string;
}

export default function ProductDetailClient({
  product,
  whatsappNumber = '923134951239',
}: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);

  const ramVariants = product.variants.filter((v) => v.variantType === 'ram');
  const ssdVariants = product.variants.filter((v) => v.variantType === 'ssd');

  const defaultRam = ramVariants.find((v) => v.isDefault) || ramVariants[0];
  const defaultSsd = ssdVariants.find((v) => v.isDefault) || ssdVariants[0];

  // Selection states
  const [selectedRam, setSelectedRam] = useState<VariantItem | undefined>(defaultRam);
  const [selectedSsd, setSelectedSsd] = useState<VariantItem | undefined>(defaultSsd);
  const [withCharger, setWithCharger] = useState<boolean>(true);
  const [withBag, setWithBag] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'warranty' | 'reviews'>('specs');

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(product.reviews || []);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
        )
      : null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      toast.error('Please enter your name and a review comment.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: reviewAuthor.trim(),
          rating: reviewRating,
          title: reviewTitle.trim() || undefined,
          comment: reviewComment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }
      setReviews([data.review, ...reviews]);
      setReviewAuthor('');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      toast.success('Thank you! Your review has been submitted.');
    } catch (err: any) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  // Real-time calculation logic matching backend
  let unitPrice = product.basePrice;

  // Add RAM upgrade adjustment
  if (selectedRam && !selectedRam.isDefault) {
    unitPrice += selectedRam.priceAdjustment;
  }

  // Add SSD upgrade adjustment
  if (selectedSsd && !selectedSsd.isDefault) {
    unitPrice += selectedSsd.priceAdjustment;
  }

  // Charger deduction
  if (product.hasChargerOption && !withCharger) {
    unitPrice = Math.max(0, unitPrice - product.chargerDeduction);
  }

  // Bag addition
  if (product.hasBagOption && withBag) {
    unitPrice += product.bagPrice;
  }

  const lineTotal = unitPrice * quantity;

  // Configuration summary string
  const configParts: string[] = [];
  if (selectedRam) configParts.push(`RAM: ${selectedRam.label}`);
  if (selectedSsd) configParts.push(`SSD: ${selectedSsd.label}`);
  if (product.hasChargerOption) {
    configParts.push(withCharger ? 'With Charger' : 'Without Charger (−Rs 3,000)');
  }
  if (product.hasBagOption && withBag) configParts.push('Laptop Bag Included');
  if (selectedColor && selectedColor !== 'Standard') configParts.push(`Color: ${selectedColor}`);

  const configSummary = configParts.join(' • ');

  // Add to cart handler
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('This product is out of stock.');
      return;
    }

    const cartItemId = `${product.id}-${selectedRam?.label || ''}-${selectedSsd?.label || ''}-${withCharger}-${withBag}-${selectedColor}`;

    addItem({
      id: cartItemId,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0]?.url,
      brand: product.brand?.name,
      config: {
        ram: selectedRam?.label,
        ssd: selectedSsd?.label,
        charger: withCharger,
        bag: withBag,
        color: selectedColor,
      },
      configSummary: configSummary || 'Standard Configuration',
      unitPrice,
      quantity,
      maxStock: product.stock,
    });

    toast.success(`${product.title} added to cart!`);
  };

  // Direct WhatsApp order generation
  const handleBuyViaWhatsApp = () => {
    const orderData: OrderData = {
      items: [
        {
          productTitle: product.title,
          brand: product.brand?.name,
          config: {
            ram: selectedRam?.label,
            ssd: selectedSsd?.label,
            charger: withCharger,
            bag: withBag,
            color: selectedColor,
          },
          quantity,
          unitPrice,
          lineTotal,
        },
      ],
      subtotal: lineTotal,
      deliveryCharge: 0,
      discount: 0,
      totalAmount: lineTotal,
      customerName: '[Customer]',
      customerPhone: '[Phone]',
      customerCity: '[City]',
      customerAddress: '[Delivery Address]',
    };

    const link = generateWhatsAppLink(orderData, whatsappNumber);
    window.open(link, '_blank');
  };

  const specs = (product.specifications || {}) as Record<string, any>;

  return (
    <div className="space-y-12">
      {/* Top 2 Columns: Gallery + Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left Column: Gallery (60% on desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right Column: Pricing & Options (40% on desktop) */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-surface-muted shadow-sm">
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-silver">
              {product.brand?.name || product.category.name}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOutOfStock ? 'bg-status-error' : 'bg-status-success animate-pulse'
                }`}
              />
              <span className={isOutOfStock ? 'text-status-error' : 'text-emerald-700'}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
              </span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
            {product.title}
          </h1>

          {/* Rating Summary (click jumps to reviews tab) */}
          <div className="flex items-center gap-2 text-xs">
            {avgRating ? (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(avgRating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400">
                  ({reviewCount} customer {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1 text-gray-400 hover:text-accent-blue transition-colors text-xs"
              >
                <Star className="w-3.5 h-3.5 text-gray-300" />
                <span>No reviews yet • Be the first to review</span>
              </button>
            )}
          </div>

          {/* Condition and SKU badges */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-navy text-white uppercase">
              {product.condition}
            </span>
            {product.sku && (
              <span className="text-xs font-mono text-gray-500 bg-surface-cream px-2.5 py-1 rounded border">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* PRICE DISPLAY */}
          <div className="p-4 rounded-2xl bg-surface-cream border border-surface-muted space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
              Configured Price:
            </span>
            <PriceDisplay price={unitPrice} originalPrice={product.originalPrice} size="xl" />
          </div>

          {/* CONFIGURATION OPTIONS */}
          <div className="space-y-5 pt-2">
            {/* RAM Options */}
            {ramVariants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                  RAM Memory Upgrade:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ramVariants.map((v) => {
                    const isSelected = selectedRam?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedRam(v)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-accent-blue bg-accent-blue/10 text-accent-blue ring-1 ring-accent-blue'
                            : 'border-surface-muted bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div>{v.label}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                          {v.isDefault ? 'Default' : `+Rs ${formatPKR(v.priceAdjustment)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SSD Options */}
            {ssdVariants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Solid State Drive (SSD) Upgrade:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ssdVariants.map((v) => {
                    const isSelected = selectedSsd?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedSsd(v)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-accent-blue bg-accent-blue/10 text-accent-blue ring-1 ring-accent-blue'
                            : 'border-surface-muted bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div>{v.label}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                          {v.isDefault ? 'Default' : `+Rs ${formatPKR(v.priceAdjustment)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Charger Option */}
            {product.hasChargerOption && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Charger Option:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithCharger(true)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      withCharger
                        ? 'border-accent-blue bg-accent-blue/10 text-accent-blue ring-1 ring-accent-blue'
                        : 'border-surface-muted bg-white text-gray-700'
                    }`}
                  >
                    <div>With Charger</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Original Included</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithCharger(false)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      !withCharger
                        ? 'border-accent-blue bg-accent-blue/10 text-accent-blue ring-1 ring-accent-blue'
                        : 'border-surface-muted bg-white text-gray-700'
                    }`}
                  >
                    <div>Without Charger</div>
                    <div className="text-[11px] text-emerald-600 font-mono mt-0.5">
                      Save Rs {formatPKR(product.chargerDeduction)}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Laptop Bag Option */}
            {product.hasBagOption && (
              <div className="p-3.5 rounded-xl bg-surface-cream border border-surface-muted flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Add Laptop Bag</span>
                  <span className="text-[11px] text-gray-500">
                    Protective carry sleeve (+Rs {formatPKR(product.bagPrice)})
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={withBag}
                  onChange={(e) => setWithBag(e.target.checked)}
                  className="w-4 h-4 rounded text-accent-blue focus:ring-accent-blue cursor-pointer"
                />
              </div>
            )}

            {/* Color selection if multiple */}
            {product.colors.length > 1 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Color:
                </label>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        selectedColor === c
                          ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                          : 'border-surface-muted bg-white text-gray-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-surface-muted rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-surface-cream disabled:opacity-40 text-gray-600"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-bold font-mono">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2.5 hover:bg-surface-cream disabled:opacity-40 text-gray-600"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Total Price Summary */}
            <div className="pt-4 border-t border-surface-muted flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Total for {quantity} item(s):</span>
                <span className="text-xl sm:text-2xl font-black text-accent-blue font-mono">
                  Rs {formatPKR(lineTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                  isOutOfStock
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-accent-blue hover:bg-accent-blue-dark shadow-accent-blue/20'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyViaWhatsApp}
                className={`w-full py-3 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-98 ${
                  isOutOfStock
                    ? 'bg-gray-300 cursor-not-allowed opacity-50'
                    : 'bg-[#25D366] hover:brightness-105 shadow-md shadow-emerald-500/20'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buy via WhatsApp</span>
              </button>
            </div>

            {/* Delivery & Payment note */}
            <div className="pt-4 border-t border-surface-muted space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent-blue" />
                <span>Nationwide delivery across Pakistan via secure courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Advance bank transfer required with verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specifications / Warranty / Reviews */}
      <div id="product-tabs" className="bg-white rounded-3xl border border-surface-muted p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-surface-muted pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'specs'
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Technical Specifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'desc'
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Product Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'warranty'
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Warranty &amp; Check Time
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Ratings &amp; Reviews ({reviewCount})
          </button>
        </div>

        {/* Specifications Tab Content */}
        {activeTab === 'specs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-surface-muted">
                {product.brand && (
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 w-1/3 sm:w-1/4">Brand</td>
                    <td className="py-3 px-4 text-gray-900">{product.brand.name}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-600">Condition</td>
                  <td className="py-3 px-4 text-gray-900">{product.condition}</td>
                </tr>
                {Object.entries(specs).map(([key, value]) => {
                  if (value === undefined || value === null || value === '' || typeof value === 'object') {
                    return null;
                  }
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase());

                  return (
                    <tr key={key}>
                      <td className="py-3 px-4 font-bold text-gray-600">{label}</td>
                      <td className="py-3 px-4 text-gray-900">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Description Tab Content */}
        {activeTab === 'desc' && (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
            {product.description ? (
              <div className="whitespace-pre-line text-sm">{product.description}</div>
            ) : (
              <p>{product.shortDescription || 'No additional description provided.'}</p>
            )}
          </div>
        )}

        {/* Warranty Tab Content */}
        {activeTab === 'warranty' && (
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <h3 className="font-bold text-base text-gray-900">Checking Warranty &amp; Hardware Assurance</h3>
            <p>
              {product.warrantyInfo ||
                'Every laptop comes with our standard 7-day checking warranty covering hardware functionality, battery, screen, keyboard, and ports.'}
            </p>
            <div className="p-4 rounded-xl bg-surface-cream border border-surface-muted text-xs space-y-1">
              <p className="font-bold text-gray-900">Checking Warranty Terms:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                <li>Warranty begins from date of parcel delivery by courier.</li>
                <li>Physical damage, liquid spills, or tampering void checking warranty.</li>
                <li>In case of any hardware issue, contact our WhatsApp support within 7 days.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Rating Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-surface-cream border border-surface-muted items-center">
              <div className="text-center md:border-r border-surface-muted pr-0 md:pr-6 space-y-2">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 block font-mono">
                  {avgRating ? avgRating.toFixed(1) : '0.0'}
                </span>
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        avgRating && s <= Math.round(avgRating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Star Breakdown */}
              <div className="space-y-1.5 md:col-span-2 text-xs">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const countForStar = reviews.filter((r) => r.rating === stars).length;
                  const pct = reviewCount > 0 ? (countForStar / reviewCount) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-12 text-gray-600 font-semibold flex items-center gap-1">
                        <span>{stars}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-accent-blue rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-gray-400 font-mono">{countForStar}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List & Write Review Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Existing Reviews Column */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-bold text-base text-gray-900 border-b pb-2">
                  Customer Feedback ({reviewCount})
                </h3>

                {reviews.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-surface-cream text-gray-500 space-y-1">
                    <p className="font-bold text-gray-800 text-sm">No reviews yet for this product</p>
                    <p className="text-xs">Have you tested this device? Share your thoughts below!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl border border-surface-muted bg-surface-cream/50 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{r.authorName}</span>
                            {r.isVerified && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified Buyer</span>
                              </span>
                            )}
                            {r.isDemo && (
                              <span className="inline-flex items-center text-[9px] uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                                Sample Review
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(r.createdAt).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= r.rating ? 'fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>

                        {r.title && <h4 className="font-bold text-xs text-gray-900">{r.title}</h4>}
                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Review Column */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-surface-muted shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900">Leave a Review</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your feedback helps others make informed choices.
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  {/* Star Selector */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Rating *</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-current' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-bold text-gray-800 text-xs font-mono">
                        {reviewRating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Usman Ali"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-accent-blue"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Headline (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Excellent battery life & speed"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-accent-blue"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Review *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the build quality, display clarity, keyboard, performance..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-accent-blue"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmittingReview}
                    className="w-full"
                  >
                    Submit Review
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
