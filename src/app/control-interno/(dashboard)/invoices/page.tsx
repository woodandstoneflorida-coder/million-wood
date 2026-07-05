import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import InvoiceRowActions from './InvoiceRowActions';
import { Plus, Calendar, FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import ExportCSVButton from '@/components/ExportCSVButton';
import InvoiceList from './InvoiceList';

export default async function InvoicesPage() {
  const invoices = await db.getInvoices();

  const csvHeaders = ['Factura', 'Cliente', 'Fecha Emision', 'Fecha Vencimiento', 'Subtotal', 'Impuesto', 'Monto Total', 'Estado'];
  const csvRows = invoices.map(inv => [
    inv.invoiceNumber,
    inv.clientName,
    inv.date,
    inv.dueDate,
    inv.subtotal,
    inv.tax,
    inv.total,
    inv.status.toUpperCase()
  ]);

  // Calculations for stats
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalPending = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Facturas / Invoices</h1>
          <p className="text-light-gray/60 text-sm mt-1">
            Gestiona la facturación de clientes, cobros y estados de pago.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportCSVButton
            headers={csvHeaders}
            rows={csvRows}
            filename={`facturas_million_wood_${new Date().toISOString().split('T')[0]}.csv`}
            buttonText="Exportar CSV"
          />
          <Link
            href="/control-interno/invoices/new"
            className="flex items-center space-x-2 rounded-lg bg-foreground hover:opacity-90 px-4 py-2.5 text-sm font-semibold text-matte-black transition shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Factura</span>
          </Link>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-metallic-gold/10 p-3 text-metallic-gold">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Total Facturado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalBilled)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-green-500/10 p-3 text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Total Cobrado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalPaid)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-yellow-500/10 p-3 text-yellow-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Por Cobrar (Pendiente)</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalPending)}</p>
          </div>
        </div>
      </div>

      <InvoiceList invoices={invoices} />
    </div>
  );
}
