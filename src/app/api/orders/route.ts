import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  config: z.record(z.any()).default({}),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Full name is required (min 2 characters)'),
  customerPhone: z
    .string()
    .min(10, 'Valid Pakistani phone number required')
    .regex(/^(03|\+923|923)\d{9}$/, 'Please enter a valid Pakistani mobile number (e.g. 03134951239)'),
  customerCity: z.string().min(2, 'City is required'),
  customerAddress: z.string().min(10, 'Full street delivery address is required (min 10 characters)'),
  deliveryNotes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { customerName, customerPhone, customerCity, customerAddress, deliveryNotes, items } =
      parsed.data;

    // Fetch site settings for delivery charge and charger deduction
    const [deliverySetting, chargerSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'delivery_charge' } }),
      prisma.siteSetting.findUnique({ where: { key: 'charger_deduction' } }),
    ]);

    const defaultDeliveryCharge = deliverySetting ? parseFloat(deliverySetting.value) || 0 : 0;
    const defaultChargerDeduction = chargerSetting ? parseFloat(chargerSetting.value) || 3000 : 3000;

    // Run transaction: Validate products, stock, and calculate exact server prices
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        let product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            variants: true,
            discounts: {
              where: { isActive: true },
            },
          },
        });

        if (!product) {
          product = await tx.product.findUnique({
            where: { slug: item.productId },
            include: {
              variants: true,
              discounts: {
                where: { isActive: true },
              },
            },
          });
        }

        if (!product || product.status !== 'PUBLISHED') {
          throw new Error(`Product "${item.productId}" is currently unavailable or removed.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.stock}`
          );
        }

        // Server-side price calculation
        let calculatedUnitPrice = product.basePrice;

        // Apply product discount to base price if active
        if (product.discounts && product.discounts.length > 0) {
          const activeDisc = product.discounts[0];
          if (activeDisc.type === 'percentage') {
            calculatedUnitPrice = calculatedUnitPrice * (1 - activeDisc.value / 100);
          } else {
            calculatedUnitPrice = Math.max(0, calculatedUnitPrice - activeDisc.value);
          }
        }

        // Check RAM variant adjustment
        if (item.config.ram) {
          const ramVariant = product.variants.find(
            (v) => v.variantType === 'ram' && (v.label === item.config.ram || item.config.ram.includes(v.label))
          );
          if (ramVariant && !ramVariant.isDefault) {
            calculatedUnitPrice += ramVariant.priceAdjustment;
          }
        }

        // Check SSD variant adjustment
        if (item.config.ssd) {
          const ssdVariant = product.variants.find(
            (v) => v.variantType === 'ssd' && (v.label === item.config.ssd || item.config.ssd.includes(v.label))
          );
          if (ssdVariant && !ssdVariant.isDefault) {
            calculatedUnitPrice += ssdVariant.priceAdjustment;
          }
        }

        // Charger deduction
        if (product.hasChargerOption && item.config.charger === false) {
          calculatedUnitPrice = Math.max(
            0,
            calculatedUnitPrice - (product.chargerDeduction || defaultChargerDeduction)
          );
        }

        // Bag addition
        if (product.hasBagOption && item.config.bag === true) {
          calculatedUnitPrice += product.bagPrice || 0;
        }

        const lineTotal = calculatedUnitPrice * item.quantity;
        subtotal += lineTotal;

        // Deduct stock atomically
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        orderItemsToCreate.push({
          productId: product.id,
          productTitle: product.title,
          quantity: item.quantity,
          unitPrice: calculatedUnitPrice,
          lineTotal,
          selectedConfig: item.config,
        });
      }

      // Generate order number: LC-YYYYMMDD-XXXX
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderNumber = `LC-${datePart}-${randomCode}`;

      const totalAmount = subtotal + defaultDeliveryCharge;

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerCity,
          customerAddress,
          deliveryNotes,
          subtotal,
          deliveryCharge: defaultDeliveryCharge,
          discount: 0,
          totalAmount,
          status: 'PENDING',
          paymentVerified: false,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    return NextResponse.json({ order: result }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order. Please check item stock and retry.' },
      { status: 400 }
    );
  }
}
