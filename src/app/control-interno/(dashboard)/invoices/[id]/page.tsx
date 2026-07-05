import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import InvoiceCreateForm from '../new/InvoiceCreateForm';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewInvoicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const invoices = await db.getInvoices();
  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="rounded-xl border border-charcoal bg-deep-charcoal p-8 text-center space-y-4">
        <p className="text-sm text-light-gray/60">Factura no encontrada en el sistema.</p>
        <Link
          href="/control-interno/invoices"
          className="inline-flex items-center space-x-2 rounded-lg bg-charcoal px-4 py-2.5 text-sm font-semibold text-foreground transition border border-charcoal hover:border-metallic-gold/30"
        >
          Volver a Lista
        </Link>
      </div>
    );
  }

  const clients = await db.getClients();

  return (
    <div className="space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center space-x-3 max-w-4xl mx-auto">
        <Link
          href="/control-interno/invoices"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-charcoal bg-deep-charcoal text-light-gray/80 hover:text-foreground hover:border-metallic-gold/30 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Factura {invoice.invoiceNumber}
          </h1>
          <p className="text-light-gray/60 text-xs mt-0.5">
            Detalle, edición y opciones de envío.
          </p>
        </div>
      </div>

      <InvoiceCreateForm clients={clients} initialInvoice={invoice} />
    </div>
  );
}
