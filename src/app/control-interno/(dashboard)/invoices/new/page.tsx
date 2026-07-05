import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import InvoiceCreateForm from './InvoiceCreateForm';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default async function NewInvoicePage() {
  const clients = await db.getClients();
  const invoices = await db.getInvoices();
  const existingNumbers = invoices
    .map(i => parseInt(i.invoiceNumber, 10))
    .filter(n => !isNaN(n));
  const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 99;
  const nextNumber = Math.max(100, maxNum + 1);
  const nextInvoiceNumber = String(nextNumber);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center space-x-3">
        <Link
          href="/control-interno/invoices"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-charcoal bg-deep-charcoal text-light-gray/80 hover:text-foreground hover:border-metallic-gold/30 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Nueva Factura / Invoice</h1>
          <p className="text-light-gray/60 text-xs mt-0.5">
            Crea un nuevo comprobante de cobro para tus clientes.
          </p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-8 text-center space-y-4">
          <p className="text-sm text-light-gray/60">
            No tienes clientes registrados para poder facturar. Registra al menos uno primero.
          </p>
          <Link
            href="/control-interno/clients"
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-metallic-gold to-[#b38728] px-4 py-2.5 text-sm font-semibold text-matte-black transition hover:from-[#FCF6BA] hover:to-metallic-gold shadow-md"
          >
            <UserPlus className="h-4 w-4" />
            <span>Ir a Registrar Cliente</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-6 md:p-8 shadow-sm">
          <InvoiceCreateForm clients={clients} nextInvoiceNumber={nextInvoiceNumber} />
        </div>
      )}
    </div>
  );
}
