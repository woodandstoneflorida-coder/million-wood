import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import QuoteRowActions from './QuoteRowActions';
import { Plus, Calendar, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import ExportCSVButton from '@/components/ExportCSVButton';
import QuoteList from './QuoteList';

export default async function QuotesPage() {
  const quotes = await db.getQuotes();

  const csvHeaders = ['Cotizacion', 'Cliente', 'Fecha Emision', 'Valido Hasta', 'Subtotal', 'Impuesto', 'Monto Total', 'Estado'];
  const csvRows = quotes.map(q => [
    q.quoteNumber,
    q.clientName,
    q.date,
    q.dueDate,
    q.subtotal,
    q.tax,
    q.total,
    q.status.toUpperCase()
  ]);

  // Stats Calculations
  const totalQuoted = quotes.reduce((sum, q) => sum + q.total, 0);
  const totalPending = quotes.filter(q => q.status === 'pending').reduce((sum, q) => sum + q.total, 0);
  const totalAccepted = quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0);

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Cotizaciones / Quotes</h1>
          <p className="text-light-gray/60 text-sm mt-1">
            Gestiona presupuestos para clientes y conviértelos en facturas cuando se aprueben.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportCSVButton
            headers={csvHeaders}
            rows={csvRows}
            filename={`cotizaciones_million_wood_${new Date().toISOString().split('T')[0]}.csv`}
            buttonText="Exportar CSV"
          />
          <Link
            href="/control-interno/quotes/new"
            className="flex items-center space-x-2 rounded-lg bg-foreground hover:opacity-90 px-4 py-2.5 text-sm font-semibold text-matte-black transition shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Cotización</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-metallic-gold/10 p-3 text-metallic-gold">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Total Cotizado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalQuoted)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-yellow-500/10 p-3 text-yellow-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Pendientes de Aceptación</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalPending)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-green-500/10 p-3 text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Aprobadas / Aceptadas</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalAccepted)}</p>
          </div>
        </div>
      </div>

      <QuoteList quotes={quotes} />
    </div>
  );
}
