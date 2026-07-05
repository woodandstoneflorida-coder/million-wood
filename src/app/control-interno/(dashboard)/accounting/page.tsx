import React from 'react';
import { db } from '@/lib/db';
import EntryForm from './EntryForm';
import { Calendar, PlusCircle, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import ExportCSVButton from '@/components/ExportCSVButton';
import AccountingRowActions from './AccountingRowActions';

export default async function AccountingPage() {
  const entries = await db.getAccountingEntries();

  const csvHeaders = ['Fecha', 'Descripcion', 'Tipo', 'Monto', 'Categoria', 'ID de Referencia'];
  const csvRows = entries.map(e => [
    e.date,
    e.description,
    e.type === 'income' ? 'INGRESO' : 'EGRESO',
    e.amount,
    e.category,
    e.referenceId || ''
  ]);

  // Metrics calculation
  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpense;

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Contabilidad</h1>
          <p className="text-light-gray/60 text-sm mt-1">
            Libro diario general, registro de flujos de caja y balances de Million Wood.
          </p>
        </div>
        <div>
          <ExportCSVButton
            headers={csvHeaders}
            rows={csvRows}
            filename={`libro_diario_million_wood_${new Date().toISOString().split('T')[0]}.csv`}
            buttonText="Exportar Libro Diario"
          />
        </div>
      </div>

      {/* Stats Balance Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-green-500/10 p-3 text-green-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Total Ingresos</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-red-500/10 p-3 text-red-400">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Total Egresos / Gastos</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalExpense)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Caja Neta / Utilidad</p>
            <p className={`text-xl font-bold mt-0.5 ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(netBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: Manual adjustments form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-charcoal bg-deep-charcoal p-6 shadow-sm sticky top-6">
            <div className="flex items-center space-x-2 text-metallic-gold mb-5">
              <PlusCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground font-sans">Registrar Ajuste Manual</h2>
            </div>
            <EntryForm />
          </div>
        </div>

        {/* Right column: General ledger listing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-charcoal flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5 text-metallic-gold" />
                <h2 className="text-lg font-semibold text-foreground">Libro Diario General</h2>
              </div>
              <span className="text-xs text-light-gray/50 font-medium">({entries.length} registros)</span>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-16 text-light-gray/40 text-sm">
                No hay transacciones registradas en el libro contable.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-charcoal bg-matte-black/35 text-[11px] font-semibold uppercase tracking-wider text-light-gray/50">
                      <th className="px-6 py-3.5">Fecha</th>
                      <th className="px-6 py-3.5">Detalle / Concepto</th>
                      <th className="px-6 py-3.5">Categoría</th>
                      <th className="px-6 py-3.5 text-right">Monto</th>
                      <th className="px-6 py-3.5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-charcoal/25 transition">
                        <td className="px-6 py-4 text-sm text-light-gray/80 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="h-3.5 w-3.5 text-metallic-gold/70" />
                            <span>{formatDate(entry.date)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {entry.description}
                          {entry.referenceId && (
                            <div className="text-[10px] text-metallic-gold font-normal mt-0.5 flex items-center space-x-1">
                              <ArrowUpRight className="h-3 w-3" />
                              <span>Enlazado a documento</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-light-gray/60">
                          <span className="inline-block border border-charcoal px-2 py-0.5 rounded bg-matte-black/30">
                            {entry.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap">
                          <span className={entry.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                            {entry.type === 'income' ? '+' : '-'} {formatCurrency(entry.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <AccountingRowActions entry={entry} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
