import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import PORowActions from './PORowActions';
import { Plus, Calendar, ShoppingBag, TrendingDown, Clock, CheckSquare } from 'lucide-react';
import ExportCSVButton from '@/components/ExportCSVButton';

export default async function PurchaseOrdersPage() {
  const pos = await db.getPurchaseOrders();

  // Metrics
  const totalPO = pos.reduce((sum, po) => sum + po.total, 0);
  const totalPending = pos
    .filter(po => po.status === 'pending' || po.status === 'approved')
    .reduce((sum, po) => sum + po.total, 0);
  const totalExpenses = pos
    .filter(po => po.status === 'received')
    .reduce((sum, po) => sum + po.total, 0);

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

  const csvHeaders = ['Nro Orden', 'Proveedor', 'Fecha', 'Total', 'Estado', 'Notas'];
  const csvRows = pos.map(po => [
    po.poNumber,
    po.vendorName,
    po.date,
    po.total,
    po.status,
    po.notes || ''
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Órdenes de Compra</h1>
          <p className="text-light-gray/60 text-sm mt-1">
            Gestiona adquisiciones con proveedores, egresos por materiales y stock.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportCSVButton
            headers={csvHeaders}
            rows={csvRows}
            filename={`ordenes_compra_${new Date().toISOString().split('T')[0]}.csv`}
            buttonText="Exportar"
          />
          <Link
            href="/control-interno/purchase-orders/new"
            className="flex items-center space-x-2 rounded-lg bg-foreground hover:opacity-90 px-4 py-2.5 text-sm font-semibold text-matte-black transition shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Orden</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-metallic-gold/10 p-3 text-metallic-gold">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Monto Total Solicitado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalPO)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Monto en Proceso / Pendiente</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalPending)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-red-500/10 p-3 text-red-400">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Gasto Total Registrado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm overflow-hidden">
        {pos.length === 0 ? (
          <div className="text-center py-16 text-light-gray/40 text-sm">
            No se han registrado órdenes de compra aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-charcoal bg-matte-black/35 text-[11px] font-semibold uppercase tracking-wider text-light-gray/50">
                  <th className="px-6 py-3.5">Nro Orden</th>
                  <th className="px-6 py-3.5">Proveedor</th>
                  <th className="px-6 py-3.5">Fecha</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-charcoal/25 transition">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <Link href={`/control-interno/purchase-orders/${po.id}`} className="hover:underline hover:text-metallic-gold block w-full">
                        {po.poNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {po.vendorName}
                    </td>
                    <td className="px-6 py-4 text-sm text-light-gray/80">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-metallic-gold/70" />
                        <span>{formatDate(po.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      {formatCurrency(po.total)}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                          : 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <PORowActions poId={po.id} status={po.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
