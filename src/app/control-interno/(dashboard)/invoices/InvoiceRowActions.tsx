'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateInvoiceStatusAction, deleteInvoiceAction } from '@/app/actions/invoices';
import { Check, X, FileDown, Loader2, Trash2 } from 'lucide-react';

interface InvoiceRowActionsProps {
  invoiceId: string;
  status: 'pending' | 'paid' | 'cancelled';
}

export default function InvoiceRowActions({ invoiceId, status }: InvoiceRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (newStatus: 'pending' | 'paid' | 'cancelled') => {
    if (confirm(`¿Está seguro de cambiar el estado de esta factura a ${newStatus === 'paid' ? 'PAGADA' : 'CANCELADA'}?`)) {
      startTransition(async () => {
        const result = await updateInvoiceStatusAction(invoiceId, newStatus);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  const handleDelete = () => {
    if (confirm('¿Está seguro de ELIMINAR esta factura? Esta acción no se puede deshacer.')) {
      startTransition(async () => {
        const result = await deleteInvoiceAction(invoiceId);
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
        <Loader2 className="h-4 w-4 animate-spin text-foreground" />
      ) : (
        <>
          {status === 'pending' && (
            <button
              onClick={() => handleStatusChange('paid')}
              title="Marcar como Pagada"
              className="flex h-7 w-7 items-center justify-center rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition cursor-pointer"
            >
              <Check className="h-4 w-4" />
            </button>
          )}

          {status !== 'cancelled' && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              title="Cancelar Factura"
              className="flex h-7 w-7 items-center justify-center rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <a
            href={`/api/invoices/pdf?id=${invoiceId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Descargar PDF"
            className="flex h-7 w-7 items-center justify-center rounded bg-charcoal text-light-gray/80 border border-charcoal hover:border-foreground/30 transition cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
          </a>

          <button
            onClick={handleDelete}
            title="Eliminar Factura"
            className="flex h-7 w-7 items-center justify-center rounded bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-900/40 transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
