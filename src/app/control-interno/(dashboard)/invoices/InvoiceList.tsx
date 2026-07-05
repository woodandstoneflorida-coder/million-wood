'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Invoice } from '@/lib/db';
import InvoiceRowActions from './InvoiceRowActions';
import { Calendar, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm overflow-hidden flex flex-col h-full mt-8">
      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-charcoal flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-lg font-semibold text-foreground">Listado de Facturas ({filteredInvoices.length})</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="relative w-full sm:w-40 flex items-center">
            <Filter className="absolute left-3 h-4 w-4 text-light-gray/50" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-matte-black border border-charcoal rounded-md text-sm text-foreground focus:outline-none focus:border-metallic-gold transition appearance-none"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-light-gray/50" />
            </div>
            <input
              type="text"
              placeholder="Buscar número o cliente..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-matte-black border border-charcoal rounded-md text-sm text-foreground focus:outline-none focus:border-metallic-gold transition"
            />
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-16 text-light-gray/40 text-sm">
          No se encontraron facturas.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-charcoal bg-matte-black/35 text-[11px] font-semibold uppercase tracking-wider text-light-gray/50">
                  <th className="px-6 py-3.5">Nro Factura</th>
                  <th className="px-6 py-3.5">Cliente</th>
                  <th className="px-6 py-3.5">Fecha Emisión / Vto</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal">
                {paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-charcoal/25 transition">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <Link href={`/control-interno/invoices/${inv.id}`} className="hover:underline block w-full">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <Link href={`/control-interno/clients/${inv.clientId}`} className="hover:underline hover:text-metallic-gold block w-full">
                        {inv.clientName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-light-gray/80">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-foreground/70" />
                        <span>{formatDate(inv.date)}</span>
                      </div>
                      <div className="text-[11px] text-light-gray/50 mt-0.5">
                        Vence: {formatDate(inv.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      {formatCurrency(inv.total)}
                      <div className="text-[10px] font-normal text-light-gray/40">
                        Subtotal: {formatCurrency(inv.subtotal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        inv.status === 'paid'
                          ? 'bg-green-500/10 text-green-400'
                          : inv.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {inv.status === 'paid' ? 'Pagada' : inv.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <InvoiceRowActions invoiceId={inv.id} status={inv.status} invoiceNumber={inv.invoiceNumber} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-charcoal flex items-center justify-between bg-matte-black/20">
              <span className="text-xs text-light-gray/60">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} de {filteredInvoices.length}
              </span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-charcoal text-light-gray disabled:opacity-30 hover:text-white transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold text-foreground">
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded bg-charcoal text-light-gray disabled:opacity-30 hover:text-white transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
