'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updatePOStatusAction, deletePOAction } from '@/app/actions/purchase-orders';
import { Check, Truck, X, FileDown, Loader2, Trash2 } from 'lucide-react';

interface PORowActionsProps {
  poId: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
}

export default function PORowActions({ poId, status }: PORowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (newStatus: 'pending' | 'approved' | 'received' | 'cancelled') => {
    let confirmMsg = '';
    if (newStatus === 'approved') confirmMsg = '¿Aprobar esta orden de compra?';
    if (newStatus === 'received') confirmMsg = '¿Marcar esta orden como RECIBIDA? Esto registrará un gasto en contabilidad.';
    if (newStatus === 'cancelled') confirmMsg = '¿Cancelar esta orden de compra?';

    if (confirm(confirmMsg)) {
      startTransition(async () => {
        const result = await updatePOStatusAction(poId, newStatus);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  const handleDelete = () => {
    if (confirm('¿Está seguro de ELIMINAR esta orden de compra? Esta acción no se puede deshacer.')) {
      startTransition(async () => {
        const result = await deletePOAction(poId);
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
            <button
              onClick={() => handleStatusChange('approved')}
              title="Aprobar Orden"
              className="flex h-7 w-7 items-center justify-center rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
            >
              <Check className="h-4 w-4" />
            </button>
          )}

          {status === 'approved' && (
            <button
              onClick={() => handleStatusChange('received')}
              title="Registrar Recepción (Gasto)"
              className="flex h-7 w-7 items-center justify-center rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition cursor-pointer"
            >
              <Truck className="h-4 w-4" />
            </button>
          )}

          {status !== 'received' && status !== 'cancelled' && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              title="Cancelar Orden"
              className="flex h-7 w-7 items-center justify-center rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <a
            href={`/api/purchase-orders/pdf?id=${poId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Descargar PDF"
            className="flex h-7 w-7 items-center justify-center rounded bg-charcoal text-light-gray/80 border border-charcoal hover:border-metallic-gold/30 transition cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
          </a>

          <button
            onClick={handleDelete}
            title="Eliminar Orden de Compra"
            className="flex h-7 w-7 items-center justify-center rounded bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-900/40 transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
