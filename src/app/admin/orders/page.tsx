import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Search, Eye, CheckCircle2, Clock, XCircle, ShoppingBag } from 'lucide-react';
import { formatPKR } from '@/components/ui/PriceDisplay';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 20;
  const search = searchParams.search || '';
  const status = searchParams.status;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search, mode: 'insensitive' } },
      { customerCity: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-steel">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Customer Orders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {total} orders received. Verify bank payment slips before confirming and dispatching.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-brand-charcoal border border-brand-steel flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form className="flex-1 flex gap-2 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by order #, customer name, phone, city..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-brand-navy border border-brand-steel text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-slate hover:bg-brand-steel text-white text-xs font-semibold rounded-lg"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <Link
              key={st}
              href={st === 'ALL' ? '/admin/orders' : `/admin/orders?status=${st}`}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                (st === 'ALL' && !status) || status === st
                  ? 'bg-accent-blue text-white'
                  : 'bg-brand-navy text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-brand-charcoal border border-brand-steel overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-navy text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-brand-steel">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">City</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-steel/50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-brand-slate/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{o.orderNumber}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{o.customerName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{o.customerPhone}</div>
                    </td>
                    <td className="p-4 text-slate-300">{o.customerCity}</td>
                    <td className="p-4 text-slate-300">{o.items.length} item(s)</td>
                    <td className="p-4 font-mono font-bold text-accent-blue whitespace-nowrap">
                      Rs {formatPKR(o.totalAmount)}
                    </td>
                    <td className="p-4">
                      {o.paymentVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          o.status === 'DELIVERED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : o.status === 'CONFIRMED' || o.status === 'PROCESSING'
                            ? 'bg-blue-500/20 text-blue-300'
                            : o.status === 'CANCELLED'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-slate hover:bg-brand-steel text-white text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-brand-steel flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/orders?page=${page - 1}`}
                  className="px-3 py-1.5 rounded bg-brand-slate text-white"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/orders?page=${page + 1}`}
                  className="px-3 py-1.5 rounded bg-brand-slate text-white"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
