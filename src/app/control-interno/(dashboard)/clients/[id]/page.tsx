import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { FileText, CheckCircle, Clock, XCircle, FileDown, ArrowLeft } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export default async function ClientProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const clients = await db.getClients();
  const client = clients.find(c => c.id === params.id);
  
  if (!client) {
    notFound();
  }

  const allQuotes = await db.getQuotes();
  const clientQuotes = allQuotes.filter(q => q.clientId === client.id).sort((a, b) => b.date.localeCompare(a.date));

  const allInvoices = await db.getInvoices();
  const clientInvoices = allInvoices.filter(i => i.clientId === client.id).sort((a, b) => b.date.localeCompare(a.date));

  // Metrics
  const totalBilled = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = clientInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalPending = clientInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  const totalQuotes = clientQuotes.length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <Link href="/control-interno/clients" className="inline-flex items-center text-xs text-light-gray hover:text-metallic-gold mb-2 transition">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Volver a Clientes
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
          <p className="text-sm text-light-gray mt-1 flex space-x-3">
            <span>{client.phone}</span>
            {client.email && <span>&bull; {client.email}</span>}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Total Cotizado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalQuotes} cotizaciones</p>
          </div>
        </div>

        <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-metallic-gold/10 p-3 text-metallic-gold">
            <CheckCircle className="h-6 w-6" />
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
            <p className="text-xs font-semibold text-light-gray/50 uppercase tracking-wider">Total Pagado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalPaid)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-red-900/30 bg-red-900/10 p-5 flex items-center space-x-4">
          <div className="rounded-lg bg-red-500/10 p-3 text-red-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Deuda Pendiente</p>
            <p className="text-xl font-bold text-red-400 mt-0.5">{formatCurrency(totalPending)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Invoices List */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-charcoal bg-matte-black/35 flex justify-between items-center">
            <h2 className="font-semibold text-foreground">Facturas ({clientInvoices.length})</h2>
            <Link 
              href="/control-interno/invoices/new" 
              className="text-xs bg-metallic-gold text-black px-3 py-1 rounded font-semibold hover:bg-metallic-gold/80 transition"
            >
              Nueva Factura
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {clientInvoices.length === 0 ? (
              <p className="text-sm text-light-gray/50 text-center py-10">No hay facturas registradas.</p>
            ) : (
              clientInvoices.map(inv => (
                <div key={inv.id} className="flex justify-between items-center p-3 rounded-lg border border-charcoal hover:bg-charcoal/30 transition">
                  <div>
                    <Link href={`/control-interno/invoices/${inv.id}`} className="font-semibold text-sm hover:text-metallic-gold hover:underline">
                      Factura {inv.invoiceNumber}
                    </Link>
                    <p className="text-xs text-light-gray mt-0.5">{formatDate(inv.date)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">{formatCurrency(inv.total)}</p>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        inv.status === 'paid' ? 'text-green-400' : inv.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {inv.status === 'paid' ? 'Pagada' : inv.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </div>
                    <a
                      href={`/api/invoices/pdf?id=${inv.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-charcoal text-light-gray/80 hover:border-foreground/30 transition"
                      title="Descargar PDF"
                    >
                      <FileDown className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quotes List */}
        <div className="rounded-xl border border-charcoal bg-deep-charcoal shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-charcoal bg-matte-black/35 flex justify-between items-center">
            <h2 className="font-semibold text-foreground">Cotizaciones ({clientQuotes.length})</h2>
            <Link 
              href="/control-interno/quotes/new" 
              className="text-xs bg-metallic-gold text-black px-3 py-1 rounded font-semibold hover:bg-metallic-gold/80 transition"
            >
              Nueva Cotización
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {clientQuotes.length === 0 ? (
              <p className="text-sm text-light-gray/50 text-center py-10">No hay cotizaciones registradas.</p>
            ) : (
              clientQuotes.map(quote => (
                <div key={quote.id} className="flex justify-between items-center p-3 rounded-lg border border-charcoal hover:bg-charcoal/30 transition">
                  <div>
                    <Link href={`/control-interno/quotes/${quote.id}`} className="font-semibold text-sm hover:text-metallic-gold hover:underline">
                      Cotización {quote.quoteNumber}
                    </Link>
                    <p className="text-xs text-light-gray mt-0.5">{formatDate(quote.date)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">{formatCurrency(quote.total)}</p>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        quote.status === 'accepted' ? 'text-green-400' : quote.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {quote.status === 'accepted' ? 'Aceptada' : quote.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                      </span>
                    </div>
                    <a
                      href={`/api/quotes/pdf?id=${quote.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-charcoal text-light-gray/80 hover:border-metallic-gold/30 transition"
                      title="Descargar PDF"
                    >
                      <FileDown className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
