import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting idempotent database seeding...');

  // 1. Super Admin Account
  const hashedPassword = await bcrypt.hash('Admin@LC2024!', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@laptopcollection.pk' },
    update: {},
    create: {
      email: 'admin@laptopcollection.pk',
      name: 'Super Admin',
      hashedPassword,
    },
  });
  console.log('✔ Seeded Admin:', admin.email);

  // 2. Categories with Specification Fields
  const categoriesData = [
    {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Tested business laptops, ultrabooks, and student notebooks',
      isFeatured: true,
      sortOrder: 1,
      specFields: [
        'processor',
        'processorFamily',
        'generation',
        'ram',
        'ssd',
        'graphics',
        'display',
        'screenSize',
        'battery',
        'os',
        'touchscreen',
        'fingerprint',
        'backlitKeyboard',
      ],
    },
    {
      name: 'RAM',
      slug: 'ram',
      description: 'High-speed DDR4 & DDR5 laptop and desktop memory upgrades',
      isFeatured: true,
      sortOrder: 2,
      specFields: ['capacity', 'type', 'speed', 'formFactor', 'compatibility'],
    },
    {
      name: 'SSDs',
      slug: 'ssds',
      description: 'Ultra-fast NVMe PCIe & SATA solid state drives',
      isFeatured: true,
      sortOrder: 3,
      specFields: ['capacity', 'interface', 'formFactor', 'readSpeed', 'writeSpeed'],
    },
    {
      name: 'Chargers',
      slug: 'chargers',
      description: 'Original HP, Dell, Lenovo, and Apple power adapters',
      isFeatured: true,
      sortOrder: 4,
      specFields: ['connectorType', 'wattage', 'compatibility'],
    },
    {
      name: 'Mice & Accessories',
      slug: 'mice-accessories',
      description: 'Precision wireless, Bluetooth, and ergonomic computer mice',
      isFeatured: false,
      sortOrder: 5,
      specFields: ['connectionType', 'dpi', 'buttons', 'color'],
    },
    {
      name: 'Laptop Bags',
      slug: 'laptop-bags',
      description: 'Protective sleeves, backpacks, and messenger shoulder bags',
      isFeatured: false,
      sortOrder: 6,
      specFields: ['size', 'material', 'type', 'waterResistant'],
    },
    {
      name: 'Cooling Pads',
      slug: 'cooling-pads',
      description: 'Multi-fan ergonomic cooling pads to prevent thermal throttling',
      isFeatured: false,
      sortOrder: 7,
      specFields: ['fans', 'fanSpeed', 'compatibility', 'usbPorts'],
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        isFeatured: cat.isFeatured,
        sortOrder: cat.sortOrder,
        specFields: cat.specFields,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isFeatured: cat.isFeatured,
        sortOrder: cat.sortOrder,
        specFields: cat.specFields,
      },
    });
    categoryMap.set(c.slug, c.id);
  }
  console.log('✔ Seeded Categories');

  // 3. Brands
  const brandsData = [
    { name: 'HP', slug: 'hp', sortOrder: 1 },
    { name: 'Dell', slug: 'dell', sortOrder: 2 },
    { name: 'Lenovo', slug: 'lenovo', sortOrder: 3 },
    { name: 'Apple', slug: 'apple', sortOrder: 4 },
    { name: 'Samsung', slug: 'samsung', sortOrder: 5 },
    { name: 'Kingston', slug: 'kingston', sortOrder: 6 },
    { name: 'Crucial', slug: 'crucial', sortOrder: 7 },
    { name: 'Logitech', slug: 'logitech', sortOrder: 8 },
    { name: 'Targus', slug: 'targus', sortOrder: 9 },
    { name: 'Deepcool', slug: 'deepcool', sortOrder: 10 },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandsData) {
    const br = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, sortOrder: b.sortOrder },
      create: { name: b.name, slug: b.slug, sortOrder: b.sortOrder },
    });
    brandMap.set(br.slug, br.id);
  }
  console.log('✔ Seeded Brands');

  // 4. Physical Branches
  const branchesData = [
    {
      name: 'Lahore Branch',
      city: 'Lahore',
      address: 'Hafeez Centre, Main Boulevard, Gulberg III, Lahore',
      contactNumber: '0313-4951239',
      operatingHours: 'Mon - Sat: 11:00 AM - 9:00 PM',
      sortOrder: 1,
    },
    {
      name: 'Islamabad Branch',
      city: 'Islamabad',
      address: 'Blue Area, Jinnah Avenue, Islamabad',
      contactNumber: '0313-4951239',
      operatingHours: 'Mon - Sat: 11:00 AM - 8:30 PM',
      sortOrder: 2,
    },
  ];

  for (const br of branchesData) {
    const existing = await prisma.branch.findFirst({ where: { city: br.city } });
    if (existing) {
      await prisma.branch.update({
        where: { id: existing.id },
        data: br,
      });
    } else {
      await prisma.branch.create({ data: br });
    }
  }
  console.log('✔ Seeded Branches');

  // 5. Store Settings
  const settingsData = [
    { key: 'site_name', value: 'Laptop Collection Pakistan', type: 'text' },
    { key: 'whatsapp_number', value: '923134951239', type: 'text' },
    { key: 'call_number', value: '923134951239', type: 'text' },
    { key: 'currency', value: 'PKR', type: 'text' },
    { key: 'bank_name', value: 'Meezan Bank Limited', type: 'text' },
    { key: 'bank_account_title', value: 'Laptop Collection Official', type: 'text' },
    { key: 'bank_account_number', value: '02010108923412', type: 'text' },
    { key: 'bank_iban', value: 'PK45MEZN0002010108923412', type: 'text' },
    { key: 'bank_account_type', value: 'Current Account', type: 'text' },
    {
      key: 'payment_instructions',
      value:
        'Please transfer the exact order amount to our official Meezan Bank account. After transferring, click the WhatsApp button on the confirmation page to submit your payment screenshot along with your Order Number.',
      type: 'textarea',
    },
    { key: 'delivery_charge', value: '0', type: 'number' },
    { key: 'charger_deduction', value: '3000', type: 'number' },
    { key: 'contact_email', value: 'support@laptopcollection.pk', type: 'text' },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, type: s.type },
      create: { key: s.key, value: s.value, type: s.type },
    });
  }
  console.log('✔ Seeded Store Settings');

  // 6. Sample Products across all categories
  const sampleProducts = [
    // ─── 5 LAPTOPS FOR NEW ARRIVALS CAROUSEL ───
    {
      slug: 'hp-elitebook-840-g8',
      title: 'HP EliteBook 840 G8 (Core i7 11th Gen, 16GB, 512GB SSD)',
      sku: 'HP-EB840-G8-i7',
      categorySlug: 'laptops',
      brandSlug: 'hp',
      basePrice: 115000,
      originalPrice: 125000,
      condition: 'REFURBISHED' as const,
      stock: 5,
      isFeatured: true,
      isOnSale: true,
      shortDescription:
        'Elite business ultrabook featuring an 11th Gen Core i7 processor, magnesium chassis, Bang & Olufsen audio, and 14" FHD IPS display.',
      description: `The HP EliteBook 840 G8 is engineered for corporate professionals and developers demanding exceptional speed and durability.
• Processor: Intel Core i7-1165G7 (4 Cores, 8 Threads, up to 4.70 GHz)
• Memory: 16 GB DDR4-3200 MHz (Upgradeable to 64GB)
• Storage: 512 GB PCIe NVMe M.2 SSD
• Display: 14.0" Full HD (1920 x 1080) Anti-Glare IPS 400 nits
• Battery Health: Tested 85%+ Original Battery
• Backlit Keyboard, Fingerprint Reader, Windows Hello IR Camera
• 7-Day Checking Warranty included`,
      hasChargerOption: true,
      chargerDeduction: 3000,
      hasBagOption: true,
      bagPrice: 2500,
      warrantyInfo: '7-Day Checking Warranty covering all hardware components.',
      specifications: {
        processor: 'Intel Core i7-1165G7',
        processorFamily: 'Intel Core i7',
        generation: '11th Gen',
        ram: '16GB DDR4',
        ssd: '512GB NVMe SSD',
        graphics: 'Intel Iris Xe Graphics',
        display: '14" FHD IPS (1920x1080)',
        screenSize: '14.0',
        battery: '3-Cell 53Wh Long Life',
        os: 'Windows 11 Pro 64-bit',
        touchscreen: false,
        backlitKeyboard: true,
        fingerprint: true,
      },
      image: '/placeholder-laptop.svg',
      variants: [
        { variantType: 'ram', label: '16 GB DDR4 (Default)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ram', label: '32 GB DDR4 Upgrade (+Rs 7,000)', priceAdjustment: 7000, isDefault: false },
        { variantType: 'ssd', label: '512 GB NVMe SSD (Default)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ssd', label: '1 TB NVMe SSD Upgrade (+Rs 9,500)', priceAdjustment: 9500, isDefault: false },
      ],
      reviews: [
        {
          authorName: 'Bilal Farooq',
          rating: 5,
          title: 'Top-tier build quality and silent thermals',
          comment: 'Received the EliteBook in pristine condition with 88% battery health. Excellent keyboard travel for coding.',
          isVerified: true,
          isDemo: true,
        },
      ],
    },
    {
      slug: 'dell-latitude-7420',
      title: 'Dell Latitude 7420 (Core i5 11th Gen, 16GB, 256GB SSD)',
      sku: 'DELL-LAT7420-i5',
      categorySlug: 'laptops',
      brandSlug: 'dell',
      basePrice: 92000,
      originalPrice: 98000,
      condition: 'REFURBISHED' as const,
      stock: 4,
      isFeatured: true,
      isOnSale: true,
      shortDescription:
        'Sleek carbon-fiber business laptop with 11th Gen Core i5, Thunderbolt 4, ExpressCharge, and responsive performance.',
      description: `Dell Latitude 7420 combines intelligent productivity and premium carbon fiber aesthetics.
• Processor: Intel Core i5-1145G7 vPro
• Memory: 16 GB DDR4 High Speed
• Storage: 256 GB Fast PCIe NVMe SSD
• Display: 14.0" FHD (1920 x 1080) WVA Anti-Glare
• Connectivity: Dual Thunderbolt 4 / USB-C, HDMI 2.0
• Backlit Keyboard & Precision Touchpad
• Checking Warranty: 7 Days Nationwide`,
      hasChargerOption: true,
      chargerDeduction: 3000,
      hasBagOption: true,
      bagPrice: 2500,
      warrantyInfo: '7-Day Checking Warranty covering all hardware components.',
      specifications: {
        processor: 'Intel Core i5-1145G7',
        processorFamily: 'Intel Core i5',
        generation: '11th Gen',
        ram: '16GB DDR4',
        ssd: '256GB NVMe SSD',
        graphics: 'Intel Iris Xe Graphics',
        display: '14" FHD (1920x1080)',
        screenSize: '14.0',
        battery: '4-Cell 63Wh ExpressCharge',
        os: 'Windows 11 Pro',
        touchscreen: false,
        backlitKeyboard: true,
        fingerprint: true,
      },
      image: '/placeholder-laptop.svg',
      variants: [
        { variantType: 'ram', label: '16 GB DDR4 (Standard)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ssd', label: '256 GB NVMe SSD (Default)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ssd', label: '512 GB NVMe SSD Upgrade (+Rs 5,500)', priceAdjustment: 5500, isDefault: false },
      ],
      reviews: [
        {
          authorName: 'Dr. Tariq Mahmood',
          rating: 5,
          title: 'Clean device and fast courier delivery to Rawalpindi',
          comment: 'Very pleased with the packaging and battery backup. Ideal for office documentation and Zoom lectures.',
          isVerified: true,
          isDemo: true,
        },
      ],
    },
    {
      slug: 'lenovo-thinkpad-t14-gen-2',
      title: 'Lenovo ThinkPad T14 Gen 2 (Ryzen 5 Pro 5650U, 16GB, 512GB SSD)',
      sku: 'LEN-T14-G2-R5',
      categorySlug: 'laptops',
      brandSlug: 'lenovo',
      basePrice: 105000,
      originalPrice: 115000,
      condition: 'REFURBISHED' as const,
      stock: 3,
      isFeatured: true,
      isOnSale: true,
      shortDescription:
        'Legendary ThinkPad reliability with 6-Core AMD Ryzen 5 Pro, dual heat pipes, robust keyboard, and MIL-SPEC durability.',
      description: `Lenovo ThinkPad T14 Gen 2 powered by AMD Ryzen 5 Pro 5650U delivers unmatched multitasking efficiency.
• Processor: AMD Ryzen 5 Pro 5650U (6 Cores, 12 Threads, up to 4.2 GHz)
• Memory: 16 GB DDR4 (Up to 48GB)
• Storage: 512 GB PCIe NVMe Opal2 SSD
• Display: 14" FHD IPS 300 nits Anti-Glare
• Iconic TrackPoint & Spill-Resistant Keyboard
• Tested Battery Health 85%+`,
      hasChargerOption: true,
      chargerDeduction: 3000,
      hasBagOption: true,
      bagPrice: 2500,
      warrantyInfo: '7-Day Checking Warranty covering all hardware components.',
      specifications: {
        processor: 'AMD Ryzen 5 Pro 5650U',
        processorFamily: 'AMD Ryzen 5',
        generation: 'Zen 3',
        ram: '16GB DDR4',
        ssd: '512GB NVMe SSD',
        graphics: 'AMD Radeon Graphics',
        display: '14" FHD IPS (1920x1080)',
        screenSize: '14.0',
        battery: '50Wh Rapid Charge',
        os: 'Windows 11 Pro',
        touchscreen: false,
        backlitKeyboard: true,
        fingerprint: true,
      },
      image: '/placeholder-laptop.svg',
      variants: [
        { variantType: 'ram', label: '16 GB DDR4 (Standard)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ram', label: '32 GB DDR4 Upgrade (+Rs 7,500)', priceAdjustment: 7500, isDefault: false },
        { variantType: 'ssd', label: '512 GB NVMe SSD (Default)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ssd', label: '1 TB NVMe SSD Upgrade (+Rs 9,500)', priceAdjustment: 9500, isDefault: false },
      ],
      reviews: [
        {
          authorName: 'Hamza Sheikh',
          rating: 5,
          title: 'Best keyboard in the market',
          comment: 'The Ryzen 6-core processor compiles code instantly. Very sturdy chassis and cool temperatures.',
          isVerified: true,
          isDemo: true,
        },
      ],
    },
    {
      slug: 'apple-macbook-air-m1',
      title: 'Apple MacBook Air M1 (8GB Unified Memory, 256GB SSD, Space Gray)',
      sku: 'APP-MBA-M1-SG',
      categorySlug: 'laptops',
      brandSlug: 'apple',
      basePrice: 165000,
      originalPrice: 175000,
      condition: 'REFURBISHED' as const,
      stock: 3,
      isFeatured: true,
      isOnSale: true,
      shortDescription:
        'Fanless silent architecture, 18-hour battery longevity, Apple M1 chip with 8-core CPU, and 13.3-inch Retina True Tone display.',
      description: `Apple MacBook Air with the game-changing Apple M1 silicon.
• Processor: Apple M1 chip with 8-core CPU and 7-core GPU
• Memory: 8 GB Unified Memory
• Storage: 256 GB Ultra-Fast SSD
• Display: 13.3" Retina Display (2560 x 1600) with P3 Wide Color
• Battery Health: Tested 88%+ Original Capacity
• Magic Keyboard with Touch ID sensor
• Includes genuine Apple USB-C Power Adapter and MagSafe/C cable`,
      hasChargerOption: true,
      chargerDeduction: 4000,
      hasBagOption: true,
      bagPrice: 3000,
      warrantyInfo: '7-Day Checking Warranty covering all hardware components.',
      specifications: {
        processor: 'Apple M1 Chip (8-Core)',
        processorFamily: 'Apple Silicon',
        generation: 'M1',
        ram: '8GB Unified',
        ssd: '256GB SSD',
        graphics: 'Apple 7-Core GPU',
        display: '13.3" Retina (2560x1600)',
        screenSize: '13.3',
        battery: '49.9Wh up to 18 hours',
        os: 'macOS Sequoia / Sonoma',
        touchscreen: false,
        backlitKeyboard: true,
        fingerprint: true,
      },
      image: '/placeholder-laptop.svg',
      variants: [],
      reviews: [
        {
          authorName: 'Ayesha Khan',
          rating: 5,
          title: 'Incredible battery life and screen clarity',
          comment: 'Works flawlessly for Photoshop and video edits without even getting warm. Battery lasts 2 full days.',
          isVerified: true,
          isDemo: true,
        },
      ],
    },
    {
      slug: 'hp-probook-450-g8',
      title: 'HP ProBook 450 G8 (Core i5 11th Gen, 8GB, 256GB SSD, 15.6" FHD)',
      sku: 'HP-PB450-G8-i5',
      categorySlug: 'laptops',
      brandSlug: 'hp',
      basePrice: 78000,
      originalPrice: 85000,
      condition: 'REFURBISHED' as const,
      stock: 6,
      isFeatured: true,
      isOnSale: true,
      shortDescription:
        'Large 15.6-inch Full HD display with numeric keypad, 11th Gen Core i5, aluminum top cover, and dual SODIMM upgrade slots.',
      description: `HP ProBook 450 G8 is the quintessential workstation for accounting, student programming, and daily business tasks.
• Processor: Intel Core i5-1135G7 (up to 4.20 GHz)
• Memory: 8 GB DDR4 (Dual Slot, upgradeable to 32GB)
• Storage: 256 GB PCIe NVMe SSD
• Display: 15.6" Full HD (1920 x 1080) Anti-Glare
• Full size keyboard with dedicated numeric keypad
• Checking Warranty: 7 Days Full Hardware Guarantee`,
      hasChargerOption: true,
      chargerDeduction: 3000,
      hasBagOption: true,
      bagPrice: 2000,
      warrantyInfo: '7-Day Checking Warranty covering all hardware components.',
      specifications: {
        processor: 'Intel Core i5-1135G7',
        processorFamily: 'Intel Core i5',
        generation: '11th Gen',
        ram: '8GB DDR4',
        ssd: '256GB NVMe SSD',
        graphics: 'Intel Iris Xe Graphics',
        display: '15.6" FHD (1920x1080)',
        screenSize: '15.6',
        battery: '3-Cell 45Wh Long Life',
        os: 'Windows 11 Home',
        touchscreen: false,
        backlitKeyboard: false,
        fingerprint: true,
      },
      image: '/placeholder-laptop.svg',
      variants: [
        { variantType: 'ram', label: '8 GB DDR4 (Standard)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ram', label: '16 GB DDR4 Upgrade (+Rs 4,000)', priceAdjustment: 4000, isDefault: false },
        { variantType: 'ssd', label: '256 GB NVMe SSD (Default)', priceAdjustment: 0, isDefault: true },
        { variantType: 'ssd', label: '512 GB NVMe SSD Upgrade (+Rs 5,000)', priceAdjustment: 5000, isDefault: false },
      ],
      reviews: [
        {
          authorName: 'M. Zubair',
          rating: 4,
          title: 'Great budget 15-inch laptop',
          comment: 'Numeric keypad is very useful for Excel work. Very solid laptop for under 80k.',
          isVerified: true,
          isDemo: true,
        },
      ],
    },

    // ─── RAM PRODUCTS ───
    {
      slug: 'samsung-8gb-ddr4-3200mhz',
      title: 'Samsung 8GB DDR4 3200MHz SODIMM Laptop RAM',
      sku: 'RAM-SAM-8GB-3200',
      categorySlug: 'ram',
      brandSlug: 'samsung',
      basePrice: 4500,
      originalPrice: 5200,
      condition: 'NEW' as const,
      stock: 15,
      isFeatured: false,
      isOnSale: true,
      shortDescription: 'Original Samsung PC4-25600 3200MHz DDR4 SODIMM notebook memory module.',
      description: 'Tested OEM Samsung 8GB DDR4 3200MHz SODIMM memory stick. Compatible with 8th, 9th, 10th, 11th, and 12th Gen Intel and AMD Ryzen laptops.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { capacity: '8GB', type: 'DDR4', speed: '3200MHz', formFactor: 'SODIMM (260-Pin)' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'kingston-16gb-ddr4-3200mhz',
      title: 'Kingston ValueRAM 16GB DDR4 3200MHz Laptop RAM',
      sku: 'RAM-KIN-16GB-3200',
      categorySlug: 'ram',
      brandSlug: 'kingston',
      basePrice: 8500,
      originalPrice: 9500,
      condition: 'NEW' as const,
      stock: 12,
      isFeatured: true,
      isOnSale: true,
      shortDescription: 'High-density 16GB DDR4 3200MHz SODIMM module for gaming & video editing laptops.',
      description: 'Kingston 16GB DDR4 3200MHz laptop RAM module. Low 1.2V power consumption, gold-plated contacts, and lifetime limited warranty.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { capacity: '16GB', type: 'DDR4', speed: '3200MHz', formFactor: 'SODIMM (260-Pin)' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'crucial-16gb-ddr5-4800mhz',
      title: 'Crucial 16GB DDR5 4800MHz SODIMM Next-Gen Laptop Memory',
      sku: 'RAM-CRU-16GB-DDR5',
      categorySlug: 'ram',
      brandSlug: 'crucial',
      basePrice: 13500,
      originalPrice: 15000,
      condition: 'NEW' as const,
      stock: 8,
      isFeatured: false,
      isOnSale: false,
      shortDescription: 'Next-generation DDR5 memory offering 50% faster data rates than DDR4 for 12th/13th Gen laptops.',
      description: 'Crucial 16GB DDR5-4800 SODIMM with on-die ECC for enhanced stability at high speeds.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { capacity: '16GB', type: 'DDR5', speed: '4800MHz', formFactor: 'SODIMM (262-Pin)' },
      image: '/placeholder-accessory.svg',
    },

    // ─── SSD PRODUCTS ───
    {
      slug: 'samsung-980-500gb-nvme',
      title: 'Samsung 980 500GB PCIe 3.0 M.2 NVMe Solid State Drive',
      sku: 'SSD-SAM-980-500G',
      categorySlug: 'ssds',
      brandSlug: 'samsung',
      basePrice: 9500,
      originalPrice: 10500,
      condition: 'NEW' as const,
      stock: 10,
      isFeatured: true,
      isOnSale: false,
      shortDescription: 'Up to 3,100 MB/s read speeds powered by Samsung V-NAND technology and nickel-coated controller.',
      description: 'Upgrade your laptop with the Samsung 980 NVMe SSD. Drastically cuts boot times, game loading, and large file transfers.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { capacity: '500GB', interface: 'PCIe Gen 3.0 x4, NVMe 1.4', formFactor: 'M.2 2280', readSpeed: '3,100 MB/s', writeSpeed: '2,600 MB/s' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'kingston-nv2-1tb-pcie-nvme',
      title: 'Kingston NV2 1TB PCIe 4.0 NVMe M.2 SSD',
      sku: 'SSD-KIN-NV2-1TB',
      categorySlug: 'ssds',
      brandSlug: 'kingston',
      basePrice: 17500,
      originalPrice: 19000,
      condition: 'NEW' as const,
      stock: 10,
      isFeatured: true,
      isOnSale: true,
      shortDescription: 'Massive 1TB capacity running on PCIe 4.0 x4 delivering up to 3,500 MB/s read speeds.',
      description: 'Kingston NV2 1TB is a high-capacity storage solution designed for thinner notebooks and systems with limited space.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { capacity: '1TB', interface: 'PCIe 4.0 x4 NVMe', formFactor: 'M.2 2280', readSpeed: '3,500 MB/s', writeSpeed: '2,100 MB/s' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'crucial-bx500-480gb-sata',
      title: 'Crucial BX500 480GB 2.5-inch Internal SATA III SSD',
      sku: 'SSD-CRU-BX500-480',
      categorySlug: 'ssds',
      brandSlug: 'crucial',
      basePrice: 7200,
      originalPrice: 8000,
      condition: 'NEW' as const,
      stock: 14,
      isFeatured: false,
      isOnSale: false,
      shortDescription: 'Revitalize older laptops with 2.5-inch SATA bays. 300% faster than traditional mechanical hard drives.',
      description: 'Crucial BX500 SATA SSD with 540 MB/s sequential reads. Ideal for upgrading older Core i3/i5/i7 laptops.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { capacity: '480GB', interface: 'SATA 6.0Gb/s', formFactor: '2.5-inch 7mm', readSpeed: '540 MB/s', writeSpeed: '500 MB/s' },
      image: '/placeholder-accessory.svg',
    },

    // ─── CHARGER PRODUCTS ───
    {
      slug: 'hp-65w-blue-pin-smart-ac-adapter',
      title: 'HP 65W Blue Pin 4.5mm Smart Original Laptop Charger',
      sku: 'CHG-HP-65W-BP',
      categorySlug: 'chargers',
      brandSlug: 'hp',
      basePrice: 3500,
      originalPrice: 4200,
      condition: 'NEW' as const,
      stock: 20,
      isFeatured: false,
      isOnSale: true,
      shortDescription: 'Genuine OEM HP 19.5V 3.33A 65W power adapter with 4.5mm blue tip connector.',
      description: 'Compatible with HP EliteBook 840, ProBook 450, Pavilion, and Envy series. Built-in surge and short-circuit protection.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { connectorType: '4.5mm Blue Pin', wattage: '65W', voltage: '19.5V 3.33A' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'dell-65w-usb-c-power-adapter',
      title: 'Dell 65W USB-C Type-C Fast AC Power Adapter',
      sku: 'CHG-DELL-65W-USBC',
      categorySlug: 'chargers',
      brandSlug: 'dell',
      basePrice: 4800,
      originalPrice: 5500,
      condition: 'NEW' as const,
      stock: 15,
      isFeatured: true,
      isOnSale: false,
      shortDescription: 'Universal USB Power Delivery adapter for Dell Latitude, XPS, and USB-C notebooks.',
      description: 'Dell 65W Type-C AC Adapter with smart auto-switching voltage (5V/9V/15V/20V). Rubberized cable wrap included.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { connectorType: 'USB-C Type-C', wattage: '65W', compatibility: 'Dell Latitude, XPS, Inspiron, MacBook' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'lenovo-65w-usb-c-charger',
      title: 'Lenovo 65W Standard USB-C AC Wall Adapter',
      sku: 'CHG-LEN-65W-USBC',
      categorySlug: 'chargers',
      brandSlug: 'lenovo',
      basePrice: 4500,
      originalPrice: 5000,
      condition: 'NEW' as const,
      stock: 18,
      isFeatured: false,
      isOnSale: false,
      shortDescription: 'Lenovo OEM 65W Type-C adapter compatible with ThinkPad T14, X1 Carbon, Yoga, and IdeaPad.',
      description: 'Fast charging supported. Lightweight and durable for travel.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { connectorType: 'USB-C Type-C', wattage: '65W' },
      image: '/placeholder-accessory.svg',
    },

    // ─── MICE & PERIPHERALS ───
    {
      slug: 'logitech-m170-wireless-mouse',
      title: 'Logitech M170 Compact 2.4GHz Wireless Mouse (Black)',
      sku: 'MOU-LOG-M170-BK',
      categorySlug: 'mice-accessories',
      brandSlug: 'logitech',
      basePrice: 2200,
      originalPrice: 2600,
      condition: 'NEW' as const,
      stock: 25,
      isFeatured: false,
      isOnSale: true,
      shortDescription: 'Reliable 10-meter wireless range, plug-and-play USB nano receiver, 12-month battery life.',
      description: 'Logitech M170 wireless mouse offers dependable wireless connectivity with optical tracking and ambidextrous shape.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { connectionType: '2.4GHz Wireless USB Nano', dpi: '1000 DPI', buttons: '3 Buttons' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'dell-ms116-optical-usb-mouse',
      title: 'Dell MS116 Wired Optical USB Mouse',
      sku: 'MOU-DELL-MS116',
      categorySlug: 'mice-accessories',
      brandSlug: 'dell',
      basePrice: 1100,
      originalPrice: 1350,
      condition: 'NEW' as const,
      stock: 30,
      isFeatured: false,
      isOnSale: false,
      shortDescription: 'Simple, reliable USB wired optical mouse for everyday office and laptop workstation tasks.',
      description: 'Dell Optical Mouse MS116 features optical LED tracking and wired connectivity for comfortable daily performance.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { connectionType: 'USB Wired', dpi: '1000 DPI', buttons: '3 Buttons' },
      image: '/placeholder-accessory.svg',
    },

    // ─── LAPTOP BAGS ───
    {
      slug: 'hp-156-classic-backpack',
      title: 'HP 15.6" Classic Water-Resistant Laptop Backpack',
      sku: 'BAG-HP-CLASSIC-15',
      categorySlug: 'laptop-bags',
      brandSlug: 'hp',
      basePrice: 3200,
      originalPrice: 3800,
      condition: 'NEW' as const,
      stock: 15,
      isFeatured: false,
      isOnSale: true,
      shortDescription: 'Padded laptop compartment holding up to 15.6-inch laptops with organizer pockets and reinforced straps.',
      description: 'Water-resistant exterior fabric keeps hardware safe during daily commutes across Pakistani weather conditions.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { size: '15.6 Inch', material: 'Water-Resistant Polyester', type: 'Backpack' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'targus-156-intellect-backpack',
      title: 'Targus 15.6" Intellect Slim Lightweight Laptop Backpack',
      sku: 'BAG-TAR-INTELLECT',
      categorySlug: 'laptop-bags',
      brandSlug: 'targus',
      basePrice: 4500,
      originalPrice: 5200,
      condition: 'NEW' as const,
      stock: 12,
      isFeatured: true,
      isOnSale: false,
      shortDescription: 'Dedicated padded laptop cradle with quick-access front accessory pocket and breathable air-mesh back panel.',
      description: 'Targus Intellect Backpack delivers essential laptop protection in a sleek, compact side-loading compartment.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { size: '15.6 Inch', material: 'Durable Polyester', type: 'Slim Backpack' },
      image: '/placeholder-accessory.svg',
    },

    // ─── COOLING PADS ───
    {
      slug: 'deepcool-wind-pal-mini-cooler',
      title: 'Deepcool Wind Pal Mini 140mm Silent Blue LED Laptop Cooler',
      sku: 'COL-DEEP-WPMINI',
      categorySlug: 'cooling-pads',
      brandSlug: 'deepcool',
      basePrice: 2800,
      originalPrice: 3300,
      condition: 'NEW' as const,
      stock: 16,
      isFeatured: false,
      isOnSale: false,
      shortDescription: '140mm silent intake fan with metal mesh surface, USB pass-through connector, and 7-degree ergonomic incline.',
      description: 'Deepcool Wind Pal Mini delivers steady airflow to keep laptop CPU/GPU temperatures 10-15C cooler under load.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { fans: '1x 140mm LED Fan', fanSpeed: '1000 RPM', compatibility: 'Up to 15.6" Laptops', usbPorts: 'USB Pass-through' },
      image: '/placeholder-accessory.svg',
    },
    {
      slug: 'havit-hv-f2056-slim-cooling-pad',
      title: 'HAVIT HV-F2056 Ultra-Slim 3-Fan Laptop Cooling Pad (15.6"-17")',
      sku: 'COL-HAV-F2056',
      categorySlug: 'cooling-pads',
      brandSlug: 'deepcool',
      basePrice: 3800,
      originalPrice: 4500,
      condition: 'NEW' as const,
      stock: 10,
      isFeatured: true,
      isOnSale: true,
      shortDescription: 'Triple 110mm ultra-quiet cooling fans with dual adjustable height settings and dual USB hub.',
      description: 'Ultra-portable and slim cooling pad supporting laptops up to 17 inches. Wear-resistant metal mesh surface.',
      hasChargerOption: false,
      hasBagOption: false,
      specifications: { fans: '3x 110mm High-Speed Fans', fanSpeed: '1100 RPM', compatibility: '15.6" to 17" Laptops', usbPorts: '2x USB 2.0' },
      image: '/placeholder-accessory.svg',
    },
  ];

  for (const item of sampleProducts) {
    const categoryId = categoryMap.get(item.categorySlug);
    const brandId = item.brandSlug ? brandMap.get(item.brandSlug) : undefined;

    if (!categoryId) {
      console.warn(`Category ${item.categorySlug} not found for product ${item.slug}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        sku: item.sku,
        categoryId,
        brandId,
        basePrice: item.basePrice,
        originalPrice: item.originalPrice,
        condition: item.condition,
        stock: item.stock,
        isFeatured: item.isFeatured,
        isOnSale: item.isOnSale,
        shortDescription: item.shortDescription,
        description: item.description,
        hasChargerOption: item.hasChargerOption,
        chargerDeduction: item.chargerDeduction || 3000,
        hasBagOption: item.hasBagOption,
        bagPrice: item.bagPrice || 0,
        warrantyInfo: item.warrantyInfo,
        specifications: item.specifications,
        status: 'PUBLISHED',
      },
      create: {
        slug: item.slug,
        title: item.title,
        sku: item.sku,
        categoryId,
        brandId,
        basePrice: item.basePrice,
        originalPrice: item.originalPrice,
        condition: item.condition,
        stock: item.stock,
        isFeatured: item.isFeatured,
        isOnSale: item.isOnSale,
        shortDescription: item.shortDescription,
        description: item.description,
        hasChargerOption: item.hasChargerOption,
        chargerDeduction: item.chargerDeduction || 3000,
        hasBagOption: item.hasBagOption,
        bagPrice: item.bagPrice || 0,
        warrantyInfo: item.warrantyInfo,
        specifications: item.specifications,
        status: 'PUBLISHED',
      },
    });

    // Ensure main image exists
    const existingImg = await prisma.productImage.findFirst({
      where: { productId: product.id },
    });
    if (!existingImg) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.image,
          alt: item.title,
          isMain: true,
          sortOrder: 0,
        },
      });
    }

    // Add variants if specified
    if (item.variants && item.variants.length > 0) {
      for (const v of item.variants) {
        const existingVar = await prisma.productVariant.findFirst({
          where: { productId: product.id, variantType: v.variantType, label: v.label },
        });
        if (!existingVar) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              variantType: v.variantType,
              label: v.label,
              priceAdjustment: v.priceAdjustment,
              isDefault: v.isDefault,
            },
          });
        }
      }
    }

    // Add demo reviews if specified
    if (item.reviews && item.reviews.length > 0) {
      for (const r of item.reviews) {
        const existingRev = await prisma.review.findFirst({
          where: { productId: product.id, authorName: r.authorName },
        });
        if (!existingRev) {
          await prisma.review.create({
            data: {
              productId: product.id,
              authorName: r.authorName,
              rating: r.rating,
              title: r.title,
              comment: r.comment,
              isVerified: r.isVerified,
              isApproved: true,
              isDemo: true, // Clearly marked as sample/demo content!
            },
          });
        }
      }
    }
  }

  console.log(`✔ Seeded ${sampleProducts.length} sample products with variants, images & demo reviews`);
  console.log('🎉 Idempotent database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
