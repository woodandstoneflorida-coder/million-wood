import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import DateFilter from './DateFilter';
import { 
  Users, 
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  DollarSign,
  ClipboardList,
  Briefcase,
  AlertTriangle
} from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // Fetch all raw data from database
  const clients = await db.getClients();
  const invoices = await db.getInvoices();
  const quotes = await db.getQuotes();
  const pos = await db.getPurchaseOrders();
  const entries = await db.getAccountingEntries();

  // Resolve query parameters
  const resolvedSearchParams = await searchParams;
  const startDate = resolvedSearchParams.startDate || '';
  const endDate = resolvedSearchParams.endDate || '';

  // Date Filtering Helper
  const filterByDate = (dateStr: string) => {
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  };

  // Filter lists
  const filteredInvoices = invoices.filter(inv => filterByDate(inv.date));
  const filteredQuotes = quotes.filter(q => filterByDate(q.date));
  const filteredPOs = pos.filter(po => filterByDate(po.date));
  const filteredEntries = entries.filter(e => filterByDate(e.date));

  // --- STATS CALCULATIONS ---
  // Invoices metrics
  const totalBilled = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalCollected = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = filteredInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0);
  const averageInvoice = filteredInvoices.length > 0 ? totalBilled / filteredInvoices.length : 0;

  // Quotes metrics
  const totalQuoted = filteredQuotes.reduce((sum, q) => sum + q.total, 0);
  const pendingQuotes = filteredQuotes
    .filter(q => q.status === 'pending')
    .reduce((sum, q) => sum + q.total, 0);

  // Purchases metrics
  const totalOrders = filteredPOs
    .filter(po => po.status === 'received')
    .reduce((sum, po) => sum + po.total, 0);

  // Accounting Ledger metrics
  const manualExpenses = filteredEntries
    .filter(e => e.type === 'expense' && !e.referenceId)
    .reduce((sum, e) => sum + e.amount, 0);
  const manualIncomes = filteredEntries
    .filter(e => e.type === 'income' && !e.referenceId)
    .reduce((sum, e) => sum + e.amount, 0);

  // Financial aggregates
  const totalIncome = totalCollected + manualIncomes;
  const totalExpense = totalOrders + manualExpenses;
  const netProfit = totalIncome - totalExpense;

  // Currency Formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const recentInvoices = filteredInvoices.slice(0, 4);
  const recentQuotes = filteredQuotes.slice(0, 4);
  const recentPOs = filteredPOs.slice(0, 4);

  const today = new Date().toISOString().split('T')[0];
  const overdueInvoices = filteredInvoices.filter(inv => inv.status === 'pending' && inv.dueDate < today);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Business Manager</h1>
          <p className="text-light-gray/60 text-sm mt-1">
            Resumen contable y financiero en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/control-interno/quotes/new"
            className="flex items-center space-x-2 rounded-lg bg-charcoal border border-charcoal hover:border-foreground/30 px-3.5 py-2 text-xs font-semibold text-foreground transition"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Cotización</span>
          </Link>
          <Link
            href="/control-interno/invoices/new"
            className="flex items-center space-x-2 rounded-lg bg-foreground hover:opacity-90 px-4 py-2 text-xs font-semibold text-matte-black transition shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Factura</span>
          </Link>
        </div>
      </div>

      {/* Date Filter Component */}
      <DateFilter />

      {/* Overdue Invoices Alert */}
      {overdueInvoices.length > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-bold text-red-400">Atención: Cuentas por Cobrar Vencidas</h2>
          </div>
          <p className="text-sm text-red-400/80 mb-4">
            Tienes {overdueInvoices.length} factura(s) que han superado su fecha límite de pago.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {overdueInvoices.map(inv => (
              <Link key={inv.id} href={`/control-interno/invoices/${inv.id}`} className="block">
                <div className="rounded-lg border border-red-500/20 bg-deep-charcoal p-4 hover:border-red-500/50 transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-foreground text-sm">{inv.invoiceNumber}</span>
                    <span className="font-bold text-red-400 text-sm">{formatCurrency(inv.total)}</span>
                  </div>
                  <p className="text-xs text-light-gray">{inv.clientName}</p>
                  <p className="text-[10px] text-red-400/70 mt-2">Venció el: {inv.dueDate}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Collected */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-light-gray/50">Total Facturado</span>
            <div className="rounded-lg bg-foreground/10 p-2 text-foreground">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalBilled)}</h3>
            <p className="mt-0.5 text-xs text-light-gray/40">{filteredInvoices.length} facturas emitidas</p>
          </div>
        </div>

        {/* Total Collected / Paid */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-light-gray/50">Cobrado (Paid)</span>
            <div className="rounded-lg bg-green-500/10 p-2 text-green-400">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalCollected)}</h3>
            <p className="mt-0.5 text-xs text-light-gray/40">Pendiente de cobro: {formatCurrency(pendingInvoices)}</p>
          </div>
        </div>

        {/* Total Quoted */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-light-gray/50">Cotizado (Quoted)</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalQuoted)}</h3>
            <p className="mt-0.5 text-xs text-light-gray/40">Pendiente aprobación: {formatCurrency(pendingQuotes)}</p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-light-gray/50">Caja Neta (Profit)</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(netProfit)}
            </h3>
            <p className="mt-0.5 text-xs text-light-gray/40">Ingresos menos egresos reales</p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-charcoal bg-deep-charcoal/40 p-4 flex items-center justify-between">
          <span className="text-xs text-light-gray/50">Promedio de Facturas:</span>
          <span className="text-sm font-semibold text-foreground">{formatCurrency(averageInvoice)}</span>
        </div>
        <div className="rounded-xl border border-charcoal bg-deep-charcoal/40 p-4 flex items-center justify-between">
          <span className="text-xs text-light-gray/50">Egresos en Compras (POs):</span>
          <span className="text-sm font-semibold text-red-400">{formatCurrency(totalOrders)}</span>
        </div>
        <div className="rounded-xl border border-charcoal bg-deep-charcoal/40 p-4 flex items-center justify-between">
          <span className="text-xs text-light-gray/50">Gastos Generales/Nómina:</span>
          <span className="text-sm font-semibold text-red-400">{formatCurrency(manualExpenses)}</span>
        </div>
      </div>

      {/* Lists Sections Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Quotes */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm">
          <div className="flex items-center justify-between border-b border-charcoal px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-light-gray/70">Últimos Presupuestos / Quotes</h2>
            <Link 
              href="/control-interno/quotes" 
              className="flex items-center space-x-1 text-xs font-semibold text-foreground hover:underline transition"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="p-6">
            {recentQuotes.length === 0 ? (
              <div className="text-center py-6 text-light-gray/40 text-xs">
                No hay presupuestos recientes.
              </div>
            ) : (
              <div className="divide-y divide-charcoal">
                {recentQuotes.map((q) => (
                  <div key={q.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{q.quoteNumber}</p>
                      <p className="text-[10px] text-light-gray/50 mt-0.5">{q.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{formatCurrency(q.total)}</p>
                      <span className={`inline-block rounded-full px-2 py-0.2 text-[8px] font-semibold mt-1 ${
                        q.status === 'accepted' 
                          ? 'bg-green-500/10 text-green-400' 
                          : q.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {q.status === 'accepted' ? 'Aprobada' : q.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm">
          <div className="flex items-center justify-between border-b border-charcoal px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-light-gray/70">Últimas Facturas / Invoices</h2>
            <Link 
              href="/control-interno/invoices" 
              className="flex items-center space-x-1 text-xs font-semibold text-foreground hover:underline transition"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="p-6">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-6 text-light-gray/40 text-xs">
                No hay facturas recientes.
              </div>
            ) : (
              <div className="divide-y divide-charcoal">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{inv.invoiceNumber}</p>
                      <p className="text-[10px] text-light-gray/50 mt-0.5">{inv.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{formatCurrency(inv.total)}</p>
                      <span className={`inline-block rounded-full px-2 py-0.2 text-[8px] font-semibold mt-1 ${
                        inv.status === 'paid' 
                          ? 'bg-green-500/10 text-green-400' 
                          : inv.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {inv.status === 'paid' ? 'Pagada' : inv.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm">
          <div className="flex items-center justify-between border-b border-charcoal px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-light-gray/70">Órdenes de Compra</h2>
            <Link 
              href="/control-interno/purchase-orders" 
              className="flex items-center space-x-1 text-xs font-semibold text-foreground hover:underline transition"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-6">
            {recentPOs.length === 0 ? (
              <div className="text-center py-6 text-light-gray/40 text-xs">
                No hay órdenes de compra recientes.
              </div>
            ) : (
              <div className="divide-y divide-charcoal">
                {recentPOs.map((po) => (
                  <div key={po.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{po.poNumber}</p>
                      <p className="text-[10px] text-light-gray/50 mt-0.5">{po.vendorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{formatCurrency(po.total)}</p>
                      <span className={`inline-block rounded-full px-2 py-0.2 text-[8px] font-semibold mt-1 ${
                        po.status === 'received' 
                          ? 'bg-green-500/10 text-green-400' 
                          : po.status === 'approved'
                          ? 'bg-blue-500/10 text-blue-400'
                          : po.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {po.status === 'received' 
                          ? 'Recibido' 
                          : po.status === 'approved' 
                          ? 'Aprobado' 
                          : po.status === 'pending' 
                          ? 'Pendiente' 
                          : 'Cancelado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
