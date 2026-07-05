import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import QuoteCreateForm from './QuoteCreateForm';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default async function NewQuotePage() {
  const clients = await db.getClients();
  const quotes = await db.getQuotes();
  const existingNumbers = quotes
    .map(q => parseInt(q.quoteNumber, 10))
    .filter(n => !isNaN(n));
  const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 172;
  const nextQuoteNumber = String(Math.max(173, maxNum + 1));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center space-x-3">
        <Link
          href="/control-interno/quotes"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-charcoal bg-deep-charcoal text-light-gray/80 hover:text-foreground hover:border-metallic-gold/30 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Nueva Cotización / Quote</h1>
          <p className="text-light-gray/60 text-xs mt-0.5">
            Prepara un presupuesto estimado de carpintería o mecanizado para tus clientes.
          </p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-8 text-center space-y-4">
          <p className="text-sm text-light-gray/60">
            No tienes clientes registrados para poder cotizar. Registra al menos uno primero.
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
          <QuoteCreateForm clients={clients} nextQuoteNumber={nextQuoteNumber} />
        </div>
      )}
    </div>
  );
}
