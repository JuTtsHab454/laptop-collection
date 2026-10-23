import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Admin account
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
  console.log('Seeded admin:', admin.email);

  // 2. Categories with specFields
  const categoriesData = [
    {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Premium new and refurbished laptops from top brands',
      isFeatured: true,
      sortOrder: 1,
      specFields: [
        'processor',
        'ram',
        'ssd',
        'graphics',
        'display',
        'screenSize',
        'battery',
        'os',
        'color',
        'touchscreen',
        'fingerprint',
        'backlitKeyboard',
        'webcam',
        'chargerType',
        'weight',
        'features',
      ],
    },
    {
      name: 'RAM',
      slug: 'ram',
      description: 'High-speed desktop and laptop RAM upgrades',
      isFeatured: true,
      sortOrder: 2,
      specFields: ['capacity', 'type', 'speed', 'compatibility', 'formFactor'],
    },
    {
      name: 'SSDs',
      slug: 'ssds',
      description: 'Fast NVMe and SATA solid state drives',
      isFeatured: true,
      sortOrder: 3,
      specFields: ['capacity', 'interface', 'formFactor', 'readSpeed', 'writeSpeed', 'compatibility'],
    },
    {
      name: 'Chargers',
      slug: 'chargers',
      description: 'Original and replacement laptop power adapters',
      isFeatured: true,
      sortOrder: 4,
      specFields: ['connectorType', 'wattage', 'compatibility', 'cableLength'],
    },
    {
      name: 'Mice & Accessories',
      slug: 'mice-accessories',
      description: 'Precision wired and wireless mice and peripherals',
      isFeatured: false,
      sortOrder: 5,
      specFields: ['connectionType', 'dpi', 'buttons', 'color', 'compatibility'],
    },
    {
      name: 'Laptop Bags',
      slug: 'laptop-bags',
      description: 'Protective sleeves, backpacks and messenger bags',
      isFeatured: false,
      sortOrder: 6,
      specFields: ['size', 'compatibleScreenSizes', 'color', 'material', 'type'],
    },
    {
      name: 'Cooling Pads',
      slug: 'cooling-pads',
      description: 'Ergonomic multi-fan laptop cooling pads',
      isFeatured: false,
      sortOrder: 7,
      specFields: ['size', 'fans', 'compatibility', 'powerSource', 'adjustable'],
    },
    {
      name: 'Other Accessories',
      slug: 'other-accessories',
      description: 'Cables, converters, cleaning kits, and more',
      isFeatured: false,
      sortOrder: 8,
      specFields: [],
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
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
  }
  console.log('Seeded categories');

  // 3. Brands
  const brands = [
    { name: 'HP', slug: 'hp', sortOrder: 1 },
    { name: 'Dell', slug: 'dell', sortOrder: 2 },
    { name: 'Lenovo', slug: 'lenovo', sortOrder: 3 },
    { name: 'Acer', slug: 'acer', sortOrder: 4 },
    { name: 'ASUS', slug: 'asus', sortOrder: 5 },
    { name: 'Apple', slug: 'apple', sortOrder: 6 },
    { name: 'Microsoft', slug: 'microsoft', sortOrder: 7 },
    { name: 'MSI', slug: 'msi', sortOrder: 8 },
    { name: 'Other', slug: 'other', sortOrder: 9 },
  ];

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, sortOrder: b.sortOrder },
      create: { name: b.name, slug: b.slug, sortOrder: b.sortOrder },
    });
  }
  console.log('Seeded brands');

  // 4. Branches
  const branches = [
    { name: 'Lahore Branch', city: 'Lahore', sortOrder: 1 },
    { name: 'Islamabad Branch', city: 'Islamabad', sortOrder: 2 },
  ];

  for (const br of branches) {
    const existing = await prisma.branch.findFirst({
      where: { city: br.city },
    });
    if (!existing) {
      await prisma.branch.create({
        data: {
          name: br.name,
          city: br.city,
          sortOrder: br.sortOrder,
        },
      });
    }
  }
  console.log('Seeded branches');

  // 5. Default site settings
  const defaultSettings = [
    { key: 'site_name', value: 'Laptop Collection', type: 'text' },
    { key: 'whatsapp_number', value: '923134951239', type: 'text' },
    { key: 'call_number', value: '923134951239', type: 'text' },
    { key: 'currency', value: 'PKR', type: 'text' },
    { key: 'bank_name', value: '[YOUR BANK NAME]', type: 'text' },
    { key: 'bank_account_title', value: '[YOUR ACCOUNT TITLE]', type: 'text' },
    { key: 'bank_account_number', value: '[YOUR ACCOUNT NUMBER]', type: 'text' },
    { key: 'bank_iban', value: '[YOUR IBAN]', type: 'text' },
    { key: 'bank_account_type', value: '[Current/Savings]', type: 'text' },
    {
      key: 'payment_instructions',
      value:
        'Full advance payment is required. Please transfer the total order amount to the bank account shown above. After making the payment, send your payment screenshot and order details to our WhatsApp number to confirm your order.',
      type: 'textarea',
    },
    { key: 'delivery_charge', value: '0', type: 'number' },
    { key: 'delivery_info', value: 'We deliver throughout Pakistan', type: 'text' },
    { key: 'charger_deduction', value: '3000', type: 'number' },
    { key: 'contact_email', value: '[YOUR EMAIL]', type: 'text' },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, type: s.type },
      create: { key: s.key, value: s.value, type: s.type },
    });
  }
  console.log('Seeded site settings');

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
