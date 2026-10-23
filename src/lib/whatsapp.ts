import { formatPKR } from '@/components/ui/PriceDisplay';

export interface OrderItemConfig {
  ram?: string;
  ssd?: string;
  processor?: string;
  graphics?: string;
  color?: string;
  charger?: boolean;
  bag?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface OrderItemData {
  productTitle: string;
  brand?: string | null;
  config: OrderItemConfig;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderData {
  orderNumber?: string;
  items: OrderItemData[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  deliveryNotes?: string | null;
}

export function generateOrderMessage(order: OrderData): string {
  let msg = `Assalam o Alaikum! 🤝\n\n`;
  msg += `📋 *NEW ORDER — Laptop Collection*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (order.orderNumber) {
    msg += `🔖 *Order #:* ${order.orderNumber}\n\n`;
  }

  // Each item
  order.items.forEach((item, index) => {
    msg += `📦 *Item ${index + 1}:*\n`;
    msg += `• Product: ${item.productTitle}\n`;
    if (item.brand) msg += `• Brand: ${item.brand}\n`;

    // Selected configurations
    if (item.config.processor) msg += `• Processor: ${item.config.processor}\n`;
    if (item.config.ram) msg += `• RAM: ${item.config.ram}\n`;
    if (item.config.ssd) msg += `• SSD: ${item.config.ssd}\n`;
    if (item.config.graphics) msg += `• Graphics: ${item.config.graphics}\n`;
    if (item.config.color) msg += `• Color: ${item.config.color}\n`;
    if (item.config.charger !== undefined) {
      msg += `• Charger: ${item.config.charger ? 'With Charger (Included)' : 'Without Charger (−Rs 3,000)'}\n`;
    }
    if (item.config.bag !== undefined) {
      msg += `• Laptop Bag: ${item.config.bag ? 'Included' : 'Not Included'}\n`;
    }

    msg += `• Quantity: ${item.quantity}\n`;
    msg += `• Unit Price: Rs ${formatPKR(item.unitPrice)}\n`;
    msg += `• Line Total: Rs ${formatPKR(item.lineTotal)}\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *Order Summary:*\n`;
  msg += `• Subtotal: Rs ${formatPKR(order.subtotal)}\n`;
  if (order.deliveryCharge > 0) {
    msg += `• Delivery: Rs ${formatPKR(order.deliveryCharge)}\n`;
  } else {
    msg += `• Delivery: FREE across Pakistan\n`;
  }
  if (order.discount > 0) {
    msg += `• Discount: −Rs ${formatPKR(order.discount)}\n`;
  }
  msg += `*TOTAL AMOUNT: Rs ${formatPKR(order.totalAmount)}*\n\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🚚 *Delivery Details:*\n`;
  msg += `• Name: ${order.customerName}\n`;
  msg += `• Phone: ${order.customerPhone}\n`;
  msg += `• City: ${order.customerCity}\n`;
  msg += `• Address: ${order.customerAddress}\n`;
  if (order.deliveryNotes) {
    msg += `• Delivery Notes: ${order.deliveryNotes}\n`;
  }

  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💳 *Payment:* Full advance bank transfer required.\n`;
  msg += `Please confirm the order and share payment details.\n`;
  msg += `I will send the payment screenshot after transfer.\n\n`;
  msg += `Thank you! 🙏`;

  return msg;
}

export function generateWhatsAppLink(
  order: OrderData,
  whatsappNumber: string = '923134951239'
): string {
  // Normalize phone number: e.g. 03134951239 -> 923134951239
  let cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '92' + cleanNumber.substring(1);
  }

  const message = generateOrderMessage(order);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

export function generateProductInquiryLink(
  productTitle: string,
  price: number,
  configSummary?: string,
  whatsappNumber: string = '923134951239'
): string {
  let cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '92' + cleanNumber.substring(1);
  }

  let text = `Assalam o Alaikum! 🤝\nI am interested in buying: *${productTitle}*\nPrice: Rs ${formatPKR(price)}\n`;
  if (configSummary) {
    text += `Configuration: ${configSummary}\n`;
  }
  text += `\nPlease let me know if this is available for delivery!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
