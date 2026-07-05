'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Client } from '@/lib/db';
import ClientRowActions from './ClientRowActions';
import { Mail, Phone, MapPin, Hash, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
}

export default function ClientList({ clients }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter clients
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm overflow-hidden flex flex-col h-full">
      {/* Search and Header */}
      <div className="px-6 py-4 border-b border-charcoal flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-lg font-semibold text-foreground">Lista de Clientes ({filteredClients.length})</h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-light-gray/50" />
          </div>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 bg-matte-black border border-charcoal rounded-md text-sm text-foreground focus:outline-none focus:border-metallic-gold transition"
          />
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-light-gray/40 text-sm">
          No se encontraron clientes.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-charcoal bg-matte-black/35 text-[11px] font-semibold uppercase tracking-wider text-light-gray/50">
                  <th className="px-6 py-3.5 w-1/3">Nombre</th>
                  <th className="px-6 py-3.5">Contacto</th>
                  <th className="px-6 py-3.5">Dirección / ID Fiscal</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal">
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-charcoal/25 transition">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <Link href={`/control-interno/clients/${client.id}`} className="hover:underline hover:text-metallic-gold block w-full">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-light-gray/80 space-y-1 align-top">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="h-3.5 w-3.5 text-light-gray/50" />
                        <span>{client.email || <span className="text-light-gray/40 italic">Sin correo</span>}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Phone className="h-3.5 w-3.5 text-light-gray/50" />
                        <span>{client.phone || <span className="text-light-gray/40 italic">Sin teléfono</span>}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-light-gray/80 space-y-1 align-top">
                      <div className="flex items-start space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-light-gray/50 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{client.address || <span className="text-light-gray/40 italic">Sin dirección</span>}</span>
                      </div>
                      {client.taxId && (
                        <div className="flex items-center space-x-1.5">
                          <Hash className="h-3.5 w-3.5 text-light-gray/50" />
                          <span className="text-[11px] uppercase tracking-wider">{client.taxId}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <ClientRowActions client={client} />
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
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredClients.length)} de {filteredClients.length}
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
