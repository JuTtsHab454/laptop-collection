'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Wand2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Cpu,
  Layers,
  HardDrive,
  Monitor,
  Zap,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import ImageUpload, { UploadedImage } from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
}

interface VariantRow {
  variantType: string;
  label: string;
  priceAdjustment: number;
  isDefault: boolean;
  stock?: number;
}

export interface ProductFormData {
  id?: string;
  title: string;
  slug: string;
  sku: string;
  categoryId: string;
  brandId: string;
  basePrice: number;
  originalPrice: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isOnSale: boolean;
  shortDescription: string;
  description: string;
  descriptionEdited: boolean;
  specifications: Record<string, any>;
  features: Record<string, any>;
  colors: string[];
  hasChargerOption: boolean;
  chargerDeduction: number;
  hasBagOption: boolean;
  bagPrice: number;
  warrantyInfo: string;
  metaTitle: string;
  metaDescription: string;
  images: UploadedImage[];
  variants: VariantRow[];
}

export default function ProductForm({
  initialData,
  categories,
  brands,
}: {
  initialData?: Partial<ProductFormData>;
  categories: CategoryItem[];
  brands: BrandItem[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [titleLocked, setTitleLocked] = useState(!!initialData?.id);
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ''
  );
  const [brandId, setBrandId] = useState(initialData?.brandId || '');
  const [basePrice, setBasePrice] = useState<number>(initialData?.basePrice || 0);
  const [originalPrice, setOriginalPrice] = useState<number | null>(
    initialData?.originalPrice || null
  );
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>(
    initialData?.status || 'DRAFT'
  );
  const [condition, setCondition] = useState<'NEW' | 'USED' | 'REFURBISHED'>(
    'NEW'
  );
  const [stock, setStock] = useState<number>(initialData?.stock ?? 5);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(
    initialData?.lowStockThreshold ?? 3
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);
  const [isOnSale, setIsOnSale] = useState<boolean>(initialData?.isOnSale ?? false);
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ''
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [descriptionEdited, setDescriptionEdited] = useState(
    initialData?.descriptionEdited ?? false
  );
  const [warrantyInfo, setWarrantyInfo] = useState(
    initialData?.warrantyInfo || '7 Days Shop Check Warranty'
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ''
  );

  // Specifications
  const [specs, setSpecs] = useState<Record<string, any>>(
    initialData?.specifications || {}
  );

  // Charger & Bag Options
  const [hasChargerOption, setHasChargerOption] = useState<boolean>(
    initialData?.hasChargerOption ?? false
  );
  const [chargerDeduction, setChargerDeduction] = useState<number>(
    initialData?.chargerDeduction ?? 3000
  );
  const [hasBagOption, setHasBagOption] = useState<boolean>(
    initialData?.hasBagOption ?? false
  );
  const [bagPrice, setBagPrice] = useState<number>(initialData?.bagPrice ?? 500);

  // Colors & Variants
  const [colors, setColors] = useState<string[]>(initialData?.colors || ['Silver']);
  const [images, setImages] = useState<UploadedImage[]>(initialData?.images || []);
  const [ramVariants, setRamVariants] = useState<VariantRow[]>(
    initialData?.variants?.filter((v) => v.variantType === 'ram') || []
  );
  const [ssdVariants, setSsdVariants] = useState<VariantRow[]>(
    initialData?.variants?.filter((v) => v.variantType === 'ssd') || []
  );

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const categorySlug = selectedCategory?.slug || 'laptops';

  // Auto-generate SKU if empty
  useEffect(() => {
    if (!sku) {
      const prefix = categorySlug.substring(0, 3).toUpperCase();
      const rand = Math.floor(1000 + Math.random() * 9000);
      setSku(`LC-${prefix}-${rand}`);
    }
  }, [categorySlug, sku]);

  // Update a spec field
  const handleSpecChange = (key: string, value: any) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  // Auto-generate Title
  const generateTitle = () => {
    const brandObj = brands.find((b) => b.id === brandId);
    const brandName = brandObj?.name || '';
    const model = specs.model || '';
    const cpu = specs.processorFamily || '';
    const ram = specs.baseRam ? `${specs.baseRam}` : '';
    const ssd = specs.baseSsd ? `${specs.baseSsd} SSD` : '';
    const screen = specs.screenSize ? `${specs.screenSize}"` : '';
    const cond = condition !== 'NEW' ? `(${condition})` : '';

    const parts = [brandName, model, cpu, ram, ssd, screen, cond].filter(Boolean);
    const generated = parts.join(' ');
    setTitle(generated);
    if (!slug || !initialData?.id) {
      setSlug(
        generated
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  // Auto-generate Description
  const generateDescription = () => {
    const brandObj = brands.find((b) => b.id === brandId);
    const brandName = brandObj?.name || 'Laptop';
    let md = `## Product Overview\n\n`;
    md += `Experience reliable performance with the **${title || brandName}**.\n\n`;

    md += `## Detailed Specifications\n\n`;
    md += `| Specification | Detail |\n`;
    md += `| :--- | :--- |\n`;

    if (brandName) md += `| Brand | ${brandName} |\n`;
    if (condition) md += `| Condition | ${condition} |\n`;

    // Add all entered specs
    Object.entries(specs).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null && typeof v !== 'object') {
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        md += `| ${label} | ${v} |\n`;
      }
    });

    if (warrantyInfo) md += `| Warranty | ${warrantyInfo} |\n`;

    md += `\n## Included In The Box\n\n`;
    md += `- 1x ${title || brandName}\n`;
    if (hasChargerOption) {
      md += `- Power Adapter (Optional: Can be purchased without charger for Rs ${chargerDeduction.toLocaleString(
        'en-PK'
      )} discount)\n`;
    } else {
      md += `- Power Adapter & Cable Included\n`;
    }
    if (hasBagOption) {
      md += `- Compatible Laptop Bag Available as Add-on\n`;
    }

    setDescription(md);
    setDescriptionEdited(false);
    toast.success('Generated structured product description!');
  };

  const handleSubmit = async (targetStatus?: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      toast.error('Product title is required.');
      return;
    }
    if (!slug.trim()) {
      toast.error('Product URL slug is required.');
      return;
    }
    if (!categoryId) {
      toast.error('Please select a category.');
      return;
    }
    if (basePrice <= 0) {
      toast.error('Base price must be greater than Rs 0.');
      return;
    }
    if (originalPrice && originalPrice <= basePrice) {
      toast.error('Original comparison price must be strictly higher than base price.');
      return;
    }
    if (targetStatus === 'PUBLISHED' && images.length === 0) {
      toast.error('Please upload at least one image before publishing.');
      return;
    }

    setIsSubmitting(true);

    const finalStatus = targetStatus || status;

    const payload = {
      title,
      slug,
      sku,
      categoryId,
      brandId: brandId || null,
      basePrice: Number(basePrice),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      status: finalStatus,
      condition,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      isFeatured,
      isOnSale,
      shortDescription,
      description,
      descriptionEdited,
      specifications: specs,
      features: {},
      colors,
      hasChargerOption,
      chargerDeduction: Number(chargerDeduction),
      hasBagOption,
      bagPrice: Number(bagPrice),
      warrantyInfo,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || shortDescription,
      images,
      variants: [...ramVariants, ...ssdVariants],
    };

    try {
      const url = initialData?.id
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      toast.success(
        initialData?.id ? 'Product updated successfully!' : 'Product created successfully!'
      );
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 text-slate-100">
      {/* Floating Action Bar */}
      <div className="sticky top-16 z-20 -mx-4 -mt-4 px-4 py-3 bg-brand-charcoal/95 backdrop-blur border-b border-brand-steel flex items-center justify-between shadow-lg">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent-silver">
            {initialData?.id ? 'Editing Product' : 'New Product'}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-sm">
            {title || 'Untitled Product'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => handleSubmit('DRAFT')}
            className="border-brand-steel text-white"
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => handleSubmit('PUBLISHED')}
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save & Publish
          </Button>
        </div>
      </div>

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-brand-steel pb-3">
          <Layers className="w-5 h-5 text-accent-blue" />
          <span>Section 1: Basic Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Select
            label="Category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            label="Brand"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          >
            <option value="">Select Brand (Optional)</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>

          <Input
            label="SKU (Stock Keeping Unit)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-300">
              Product Title / Model Name <span className="text-status-error">*</span>
            </label>
            <button
              type="button"
              onClick={generateTitle}
              className="text-xs font-bold text-accent-blue hover:text-accent-blue-light flex items-center gap-1"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Auto-Generate Title from Specs
            </button>
          </div>
          <input
            type="text"
            required
            placeholder="e.g. HP EliteBook 840 G6 Core i5 8GB 256GB SSD 14 FHD"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!initialData?.id) {
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
                );
              }
            }}
            className="w-full rounded-lg border border-brand-steel bg-brand-navy px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Condition</label>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span>✓ 100% Brand New Stock</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Toggle
              label="Featured Product"
              checked={isFeatured}
              onChange={setIsFeatured}
              helperText="Display on homepage featured grid"
            />
            <Toggle
              label="On Sale"
              checked={isOnSale}
              onChange={setIsOnSale}
              helperText="Show SALE badge & discounted tag"
            />
          </div>
        </div>

        <Textarea
          label="Short Summary"
          placeholder="Brief 1-2 sentence overview of key selling points..."
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="bg-brand-navy border-brand-steel text-white"
        />
      </div>

      {/* SECTION 2 & 3: PRICING & INVENTORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pricing */}
        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-4">
          <h3 className="text-base font-bold text-white border-b border-brand-steel pb-3">
            Section 2: Pricing (PKR)
          </h3>

          <Input
            label="Base Selling Price (Rs)"
            type="number"
            required
            min={1}
            value={basePrice || ''}
            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
            helperText="The actual price customer pays for base configuration"
            className="bg-brand-navy border-brand-steel text-white font-mono text-base font-bold"
          />

          <Input
            label="Original Comparison Price (Optional)"
            type="number"
            min={basePrice + 1}
            value={originalPrice || ''}
            onChange={(e) =>
              setOriginalPrice(e.target.value ? parseFloat(e.target.value) : null)
            }
            helperText="Must be higher than base price to show crossed-out savings"
            className="bg-brand-navy border-brand-steel text-white font-mono"
          />
        </div>

        {/* Inventory */}
        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-4">
          <h3 className="text-base font-bold text-white border-b border-brand-steel pb-3">
            Section 3: Inventory
          </h3>

          <Input
            label="Stock Quantity Available"
            type="number"
            required
            min={0}
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
            helperText="Product is marked Out of Stock when quantity reaches 0"
            className="bg-brand-navy border-brand-steel text-white font-mono font-bold"
          />

          <Input
            label="Low Stock Alert Threshold"
            type="number"
            min={0}
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 3)}
            helperText="Triggers warning in admin dashboard when stock falls to or below this"
            className="bg-brand-navy border-brand-steel text-white font-mono"
          />
        </div>
      </div>

      {/* SECTION 4: IMAGES */}
      <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-4">
        <h3 className="text-base font-bold text-white border-b border-brand-steel pb-3">
          Section 4: Product Images (Up to 6)
        </h3>
        <ImageUpload images={images} onChange={setImages} maxImages={6} />
      </div>

      {/* SECTION 5: CATEGORY-AWARE SPECIFICATIONS */}
      <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-6">
        <div className="flex items-center justify-between border-b border-brand-steel pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent-blue" />
              <span>Section 5: Hardware Specifications</span>
            </h3>
            <p className="text-xs text-accent-silver mt-0.5">
              Specific fields for: <strong className="text-accent-blue">{selectedCategory?.name}</strong>
            </p>
          </div>
        </div>

        {/* LAPTOPS SPECIFICATIONS */}
        {categorySlug === 'laptops' && (
          <div className="space-y-6">
            {/* Processor */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-silver mb-3">
                Processor (CPU)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Select
                  label="Manufacturer"
                  value={specs.processorManufacturer || 'Intel'}
                  onChange={(e) => handleSpecChange('processorManufacturer', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  <option value="Intel">Intel</option>
                  <option value="AMD">AMD</option>
                  <option value="Apple">Apple</option>
                  <option value="Qualcomm">Qualcomm</option>
                  <option value="Other">Other</option>
                </Select>

                <Select
                  label="Family"
                  value={specs.processorFamily || 'Core i5'}
                  onChange={(e) => handleSpecChange('processorFamily', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  <option value="Core i3">Core i3</option>
                  <option value="Core i5">Core i5</option>
                  <option value="Core i7">Core i7</option>
                  <option value="Core i9">Core i9</option>
                  <option value="Ryzen 3">Ryzen 3</option>
                  <option value="Ryzen 5">Ryzen 5</option>
                  <option value="Ryzen 7">Ryzen 7</option>
                  <option value="Ryzen 9">Ryzen 9</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                  <option value="M3">M3</option>
                  <option value="Other">Other</option>
                </Select>

                <Input
                  label="Model"
                  placeholder="e.g. 8365U, 1335U, 5600H"
                  value={specs.processorModel || ''}
                  onChange={(e) => handleSpecChange('processorModel', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                />

                <Input
                  label="Generation"
                  placeholder="e.g. 8th Gen, 13th Gen"
                  value={specs.processorGeneration || ''}
                  onChange={(e) => handleSpecChange('processorGeneration', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                />

                <Input
                  label="Cores"
                  type="number"
                  placeholder="4"
                  value={specs.coreCount || ''}
                  onChange={(e) => handleSpecChange('coreCount', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                />

                <Input
                  label="Threads (NEVER Auto-Calculate)"
                  type="number"
                  placeholder="8"
                  value={specs.threadCount || ''}
                  onChange={(e) => handleSpecChange('threadCount', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                />

                <Input
                  label="Clock Speed"
                  placeholder="up to 4.1 GHz"
                  value={specs.clockSpeed || ''}
                  onChange={(e) => handleSpecChange('clockSpeed', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                />
              </div>
            </div>

            {/* Memory & Storage */}
            <div className="pt-4 border-t border-brand-steel">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-silver mb-3">
                Memory & Storage
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Select
                  label="Base RAM"
                  value={specs.baseRam || '8GB'}
                  onChange={(e) => handleSpecChange('baseRam', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  {['4GB', '8GB', '12GB', '16GB', '24GB', '32GB', '64GB'].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>

                <Select
                  label="RAM Type"
                  value={specs.ramType || 'DDR4'}
                  onChange={(e) => handleSpecChange('ramType', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  {['DDR4', 'DDR5', 'LPDDR4x', 'LPDDR5', 'LPDDR5x', 'Other'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Base SSD Storage"
                  value={specs.baseSsd || '256GB'}
                  onChange={(e) => handleSpecChange('baseSsd', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  {['128GB', '256GB', '512GB', '1TB', '2TB'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Storage Interface"
                  value={specs.storageInterface || 'NVMe M.2'}
                  onChange={(e) => handleSpecChange('storageInterface', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  {['NVMe M.2', 'SATA M.2', 'SATA 2.5"', 'eMMC', 'Other'].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Display & Graphics */}
            <div className="pt-4 border-t border-brand-steel">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-silver mb-3">
                Display & Graphics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Select
                  label="Screen Size"
                  value={specs.screenSize || '14'}
                  onChange={(e) => handleSpecChange('screenSize', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  {['11.6', '13.3', '14', '15.6', '16', '17.3'].map((s) => (
                    <option key={s} value={s}>
                      {s}&quot;
                    </option>
                  ))}
                </Select>

                <Select
                  label="Resolution"
                  value={specs.resolution || '1920x1080 FHD'}
                  onChange={(e) => handleSpecChange('resolution', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  {[
                    '1366x768 HD',
                    '1600x900 HD+',
                    '1920x1080 FHD',
                    '1920x1200 WUXGA',
                    '2560x1440 QHD',
                    '2560x1600',
                    '2880x1800',
                    '3840x2160 4K UHD',
                  ].map((res) => (
                    <option key={res} value={res}>
                      {res}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Panel Type"
                  value={specs.panelType || 'IPS'}
                  onChange={(e) => handleSpecChange('panelType', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  {['IPS', 'TN', 'OLED', 'Mini-LED', 'VA'].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>

                <div className="flex items-center pt-6">
                  <Toggle
                    label="Touchscreen"
                    checked={!!specs.touchscreen}
                    onChange={(val) => handleSpecChange('touchscreen', val)}
                  />
                </div>
              </div>
            </div>

            {/* Dedicated GPU toggle */}
            <div className="pt-4 border-t border-brand-steel">
              <Toggle
                label="Has Dedicated Graphics Card (GPU)"
                checked={!!specs.hasDedicatedGpu}
                onChange={(val) => handleSpecChange('hasDedicatedGpu', val)}
                helperText="Enable if this laptop features NVIDIA or AMD discrete graphics"
              />

              {specs.hasDedicatedGpu && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 p-4 rounded-xl bg-brand-navy border border-brand-steel">
                  <Select
                    label="GPU Brand"
                    value={specs.gpuBrand || 'NVIDIA'}
                    onChange={(e) => handleSpecChange('gpuBrand', e.target.value)}
                    className="bg-brand-charcoal border-brand-steel text-white"
                  >
                    <option value="NVIDIA">NVIDIA</option>
                    <option value="AMD">AMD</option>
                    <option value="Intel">Intel Arc</option>
                  </Select>

                  <Input
                    label="GPU Model"
                    placeholder="e.g. RTX 4060, GTX 1650"
                    value={specs.gpuModel || ''}
                    onChange={(e) => handleSpecChange('gpuModel', e.target.value)}
                    className="bg-brand-charcoal border-brand-steel text-white"
                  />

                  <Select
                    label="VRAM"
                    value={specs.gpuVram || '4GB'}
                    onChange={(e) => handleSpecChange('gpuVram', e.target.value)}
                    className="bg-brand-charcoal border-brand-steel text-white"
                  >
                    {['2GB', '4GB', '6GB', '8GB', '12GB', '16GB'].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>

            {/* Features & Physical */}
            <div className="pt-4 border-t border-brand-steel">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-silver mb-3">
                Features & Hardware
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Toggle
                  label="Backlit Keyboard"
                  checked={!!specs.backlitKeyboard}
                  onChange={(val) => handleSpecChange('backlitKeyboard', val)}
                />
                <Toggle
                  label="Fingerprint Reader"
                  checked={!!specs.fingerprint}
                  onChange={(val) => handleSpecChange('fingerprint', val)}
                />
                <Toggle
                  label="Face Unlock (Windows Hello)"
                  checked={!!specs.faceUnlock}
                  onChange={(val) => handleSpecChange('faceUnlock', val)}
                />
                <Toggle
                  label="Webcam"
                  checked={specs.webcam ?? true}
                  onChange={(val) => handleSpecChange('webcam', val)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Select
                  label="Operating System"
                  value={specs.os || 'Windows 11 Pro'}
                  onChange={(e) => handleSpecChange('os', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  <option value="Windows 11 Pro">Windows 11 Pro</option>
                  <option value="Windows 11 Home">Windows 11 Home</option>
                  <option value="Windows 10 Pro">Windows 10 Pro</option>
                  <option value="macOS">macOS</option>
                  <option value="ChromeOS">ChromeOS</option>
                  <option value="No OS / FreeDOS">No OS / FreeDOS</option>
                </Select>

                <Select
                  label="Charger Type"
                  value={specs.chargerType || 'Round Pin'}
                  onChange={(e) => handleSpecChange('chargerType', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                >
                  <option value="Round Pin">Round Pin</option>
                  <option value="USB Type-C">USB Type-C</option>
                  <option value="MagSafe">MagSafe</option>
                  <option value="Proprietary">Proprietary</option>
                </Select>

                <Input
                  label="Battery Health / Info"
                  placeholder="e.g. Excellent / 3-cell 50Wh"
                  value={specs.batteryInfo || ''}
                  onChange={(e) => handleSpecChange('batteryInfo', e.target.value)}
                  className="bg-brand-navy border-brand-steel text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* RAM SPECIFICATIONS */}
        {categorySlug === 'ram' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              label="Capacity"
              value={specs.capacity || '8GB'}
              onChange={(e) => handleSpecChange('capacity', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              {['4GB', '8GB', '16GB', '32GB', '64GB'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              label="Memory Type"
              value={specs.ramType || 'DDR4'}
              onChange={(e) => handleSpecChange('ramType', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              {['DDR3', 'DDR4', 'DDR5', 'LPDDR4x', 'LPDDR5'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>

            <Input
              label="Speed"
              placeholder="e.g. 3200MHz, 4800MHz"
              value={specs.speed || ''}
              onChange={(e) => handleSpecChange('speed', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />

            <Select
              label="Form Factor"
              value={specs.formFactor || 'SODIMM (Laptop)'}
              onChange={(e) => handleSpecChange('formFactor', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              <option value="SODIMM (Laptop)">SODIMM (Laptop)</option>
              <option value="DIMM (Desktop)">DIMM (Desktop)</option>
            </Select>
          </div>
        )}

        {/* SSD SPECIFICATIONS */}
        {categorySlug === 'ssds' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              label="Capacity"
              value={specs.capacity || '512GB'}
              onChange={(e) => handleSpecChange('capacity', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              {['128GB', '256GB', '512GB', '1TB', '2TB', '4TB'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              label="Interface"
              value={specs.interface || 'NVMe PCIe M.2'}
              onChange={(e) => handleSpecChange('interface', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              <option value="NVMe PCIe M.2">NVMe PCIe M.2</option>
              <option value="SATA M.2">SATA M.2</option>
              <option value="SATA 2.5-inch">SATA 2.5-inch</option>
            </Select>

            <Input
              label="Read Speed"
              placeholder="e.g. 3500 MB/s"
              value={specs.readSpeed || ''}
              onChange={(e) => handleSpecChange('readSpeed', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />

            <Input
              label="Write Speed"
              placeholder="e.g. 3000 MB/s"
              value={specs.writeSpeed || ''}
              onChange={(e) => handleSpecChange('writeSpeed', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />
          </div>
        )}

        {/* CHARGERS SPECIFICATIONS */}
        {categorySlug === 'chargers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              label="Connector Type"
              value={specs.connectorType || 'Round Pin (Blue Tip)'}
              onChange={(e) => handleSpecChange('connectorType', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              <option value="Round Pin (Blue Tip)">Round Pin (Blue Tip)</option>
              <option value="USB Type-C">USB Type-C</option>
              <option value="Round Pin (Yellow Tip)">Round Pin (Yellow Tip)</option>
              <option value="MagSafe 2">MagSafe 2</option>
              <option value="Square / Slim Tip">Square / Slim Tip</option>
            </Select>

            <Input
              label="Wattage"
              placeholder="e.g. 65W, 90W, 130W"
              value={specs.wattage || ''}
              onChange={(e) => handleSpecChange('wattage', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />

            <Input
              label="Cable Length"
              placeholder="e.g. 1.8 meters"
              value={specs.cableLength || ''}
              onChange={(e) => handleSpecChange('cableLength', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />

            <Input
              label="Compatible Brands"
              placeholder="e.g. HP, Dell, Lenovo"
              value={specs.compatibility || ''}
              onChange={(e) => handleSpecChange('compatibility', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />
          </div>
        )}

        {/* MICE SPECIFICATIONS */}
        {categorySlug.includes('mice') && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Connection Type"
              value={specs.connectionType || 'Wireless 2.4GHz'}
              onChange={(e) => handleSpecChange('connectionType', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              <option value="Wireless 2.4GHz">Wireless 2.4GHz</option>
              <option value="Bluetooth">Bluetooth</option>
              <option value="Dual Mode (2.4G + BT)">Dual Mode (2.4G + BT)</option>
              <option value="USB Wired">USB Wired</option>
            </Select>

            <Input
              label="DPI"
              placeholder="e.g. 1600 DPI"
              value={specs.dpi || ''}
              onChange={(e) => handleSpecChange('dpi', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />

            <Input
              label="Buttons Count"
              type="number"
              placeholder="e.g. 3 or 6"
              value={specs.buttons || ''}
              onChange={(e) => handleSpecChange('buttons', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />
          </div>
        )}

        {/* BAGS SPECIFICATIONS */}
        {categorySlug.includes('bag') && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Compatible Screen Sizes"
              value={specs.compatibleSizes || '14" - 15.6"'}
              onChange={(e) => handleSpecChange('compatibleSizes', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              <option value='13" - 14"'>13&quot; - 14&quot;</option>
              <option value='14" - 15.6"'>14&quot; - 15.6&quot;</option>
              <option value='15.6" - 17"'>15.6&quot; - 17&quot;</option>
            </Select>

            <Select
              label="Type"
              value={specs.bagType || 'Backpack'}
              onChange={(e) => handleSpecChange('bagType', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            >
              <option value="Backpack">Backpack</option>
              <option value="Protective Sleeve">Protective Sleeve</option>
              <option value="Shoulder / Messenger">Shoulder / Messenger</option>
            </Select>

            <Input
              label="Material"
              placeholder="e.g. Water-resistant Nylon"
              value={specs.material || ''}
              onChange={(e) => handleSpecChange('material', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white"
            />
          </div>
        )}
      </div>

      {/* SECTION 6: VARIANTS & CONFIGURATION (CRITICAL FOR LAPTOPS) */}
      {categorySlug === 'laptops' && (
        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-6">
          <h3 className="text-base font-bold text-white border-b border-brand-steel pb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent-gold" />
            <span>Section 6: Upgradeable Options & Customer Customization</span>
          </h3>

          {/* RAM Upgrades */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">RAM Upgrade Options</h4>
                <p className="text-xs text-accent-silver">
                  Only configured options appear to customer. At least one must be default (+Rs 0).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setRamVariants([
                    ...ramVariants,
                    {
                      variantType: 'ram',
                      label: '16GB DDR4',
                      priceAdjustment: 5000,
                      isDefault: ramVariants.length === 0,
                    },
                  ])
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add RAM Option
              </Button>
            </div>

            {ramVariants.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-brand-navy border border-brand-steel"
              >
                <Input
                  label="Option Label"
                  placeholder="e.g. 16GB DDR4"
                  value={row.label}
                  onChange={(e) => {
                    const copy = [...ramVariants];
                    copy[idx].label = e.target.value;
                    setRamVariants(copy);
                  }}
                  className="bg-brand-charcoal border-brand-steel text-white"
                />

                <Input
                  label="Price Adjustment (+Rs)"
                  type="number"
                  value={row.priceAdjustment}
                  onChange={(e) => {
                    const copy = [...ramVariants];
                    copy[idx].priceAdjustment = parseFloat(e.target.value) || 0;
                    setRamVariants(copy);
                  }}
                  className="bg-brand-charcoal border-brand-steel text-white font-mono"
                />

                <div className="pt-6">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap">
                    <input
                      type="radio"
                      name="defaultRam"
                      checked={row.isDefault}
                      onChange={() => {
                        const copy = ramVariants.map((r, i) => ({
                          ...r,
                          isDefault: i === idx,
                        }));
                        setRamVariants(copy);
                      }}
                      className="text-accent-blue"
                    />
                    <span>Default</span>
                  </label>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => setRamVariants(ramVariants.filter((_, i) => i !== idx))}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SSD Upgrades */}
          <div className="space-y-3 pt-4 border-t border-brand-steel">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">SSD Storage Upgrade Options</h4>
                <p className="text-xs text-accent-silver">
                  Allows customer to choose storage upgrade during checkout.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSsdVariants([
                    ...ssdVariants,
                    {
                      variantType: 'ssd',
                      label: '512GB NVMe',
                      priceAdjustment: 4000,
                      isDefault: ssdVariants.length === 0,
                    },
                  ])
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add SSD Option
              </Button>
            </div>

            {ssdVariants.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-brand-navy border border-brand-steel"
              >
                <Input
                  label="Option Label"
                  placeholder="e.g. 512GB NVMe SSD"
                  value={row.label}
                  onChange={(e) => {
                    const copy = [...ssdVariants];
                    copy[idx].label = e.target.value;
                    setSsdVariants(copy);
                  }}
                  className="bg-brand-charcoal border-brand-steel text-white"
                />

                <Input
                  label="Price Adjustment (+Rs)"
                  type="number"
                  value={row.priceAdjustment}
                  onChange={(e) => {
                    const copy = [...ssdVariants];
                    copy[idx].priceAdjustment = parseFloat(e.target.value) || 0;
                    setSsdVariants(copy);
                  }}
                  className="bg-brand-charcoal border-brand-steel text-white font-mono"
                />

                <div className="pt-6">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap">
                    <input
                      type="radio"
                      name="defaultSsd"
                      checked={row.isDefault}
                      onChange={() => {
                        const copy = ssdVariants.map((r, i) => ({
                          ...r,
                          isDefault: i === idx,
                        }));
                        setSsdVariants(copy);
                      }}
                      className="text-accent-blue"
                    />
                    <span>Default</span>
                  </label>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => setSsdVariants(ssdVariants.filter((_, i) => i !== idx))}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Charger & Bag Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-steel">
            <div className="p-4 rounded-xl bg-brand-navy border border-brand-steel space-y-3">
              <Toggle
                label="Offer 'Without Charger' Option"
                checked={hasChargerOption}
                onChange={setHasChargerOption}
                helperText="If customer has their own charger, deduct amount from total"
              />
              {hasChargerOption && (
                <Input
                  label="Deduction Amount (Rs)"
                  type="number"
                  value={chargerDeduction}
                  onChange={(e) => setChargerDeduction(parseFloat(e.target.value) || 0)}
                  className="bg-brand-charcoal border-brand-steel text-white font-mono"
                />
              )}
            </div>

            <div className="p-4 rounded-xl bg-brand-navy border border-brand-steel space-y-3">
              <Toggle
                label="Offer Laptop Bag Add-on"
                checked={hasBagOption}
                onChange={setHasBagOption}
                helperText="Offer a matching protective bag at checkout"
              />
              {hasBagOption && (
                <Input
                  label="Bag Price (Rs)"
                  type="number"
                  value={bagPrice}
                  onChange={(e) => setBagPrice(parseFloat(e.target.value) || 0)}
                  className="bg-brand-charcoal border-brand-steel text-white font-mono"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: AUTO-GENERATED DESCRIPTION */}
      <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-4">
        <div className="flex items-center justify-between border-b border-brand-steel pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-accent-blue" />
            <span>Section 7: Product Description</span>
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={generateDescription}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Generate from Specs
          </Button>
        </div>

        <Textarea
          rows={10}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionEdited(true);
          }}
          placeholder="Detailed structured description in Markdown format..."
          className="bg-brand-navy border-brand-steel text-white font-mono text-xs"
        />
      </div>

      {/* SECTION 8: SEO & URL SLUG */}
      <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-4">
        <h3 className="text-base font-bold text-white border-b border-brand-steel pb-3">
          Section 8: Search Engine Optimization (SEO) & URL
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="URL Slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white font-mono text-xs"
          />

          <Input
            label="Meta Title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white text-xs"
          />
        </div>

        <Textarea
          label="Meta Description"
          rows={2}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className="bg-brand-navy border-brand-steel text-white text-xs"
        />
      </div>
    </div>
  );
}
