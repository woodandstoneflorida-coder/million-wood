'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateQuoteStatusAction, convertQuoteToInvoiceAction, deleteQuoteAction } from '@/app/actions/quotes';
import { Check, X, FileDown, ArrowRightLeft, Loader2, Trash2 } from 'lucide-react';

interface QuoteRowActionsProps {
  quoteId: string;
  status: 'pending' | 'accepted' | 'declined';
  quoteNumber: string;
}

export default function QuoteRowActions({ quoteId, status, quoteNumber }: QuoteRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (newStatus: 'pending' | 'accepted' | 'declined') => {
    let confirmMsg = '';
    if (newStatus === 'accepted') confirmMsg = `¿Marcar la cotización ${quoteNumber} como ACEPTADA?`;
    if (newStatus === 'declined') confirmMsg = `¿Marcar la cotización ${quoteNumber} como RECHAZADA?`;

    if (confirm(confirmMsg)) {
      startTransition(async () => {
        const result = await updateQuoteStatusAction(quoteId, newStatus);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  const handleConvertToInvoice = () => {
    if (confirm(`¿Desea convertir la cotización ${quoteNumber} en una Factura activa? Se generará una nueva factura y la cotización pasará a estado ACEPTADA.`)) {
      startTransition(async () => {
        const result = await convertQuoteToInvoiceAction(quoteId);
        if (result?.error) {
          alert(result.error);
        } else {
          router.push('/control-interno/invoices');
        }
      });
    }
  };

  const handleDelete = () => {
    if (confirm(`¿Está seguro de ELIMINAR la cotización ${quoteNumber}? Esta acción no se puede deshacer.`)) {
      startTransition(async () => {
        const result = await deleteQuoteAction(quoteId);
        if (result?.error) {
          alert(result.error);
        } else {
          router.refresh();
        }
      });
    }
  };

  return (
    <div className="flex items-center space-x-2.5">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-metallic-gold" />
      ) : (
        <>
          {status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange('accepted')}
                title="Aceptar Cotización"
                className="flex h-7 w-7 items-center justify-center rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition cursor-pointer"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleStatusChange('declined')}
                title="Rechazar Cotización"
                className="flex h-7 w-7 items-center justify-center rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleConvertToInvoice}
                title="Convertir a Factura"
                className="flex h-7 w-7 items-center justify-center rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </>
          )}

          <a
            href={`/api/quotes/pdf?id=${quoteId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Descargar PDF"
            className="flex h-7 w-7 items-center justify-center rounded bg-charcoal text-light-gray/80 border border-charcoal hover:border-metallic-gold/30 transition cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
          </a>

          <button
            onClick={handleDelete}
            title="Eliminar Cotización"
            className="flex h-7 w-7 items-center justify-center rounded bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-900/40 transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
