'use client';

import { useState, useActionState, useEffect } from 'react';
import { updateAccountingEntryAction } from '@/app/actions/accounting';
import { X, Loader2 } from 'lucide-react';
import { AccountingEntry } from '@/lib/db';

interface AccountingEditModalProps {
  entry: AccountingEntry;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountingEditModal({ entry, isOpen, onClose }: AccountingEditModalProps) {
  const updateWithId = updateAccountingEntryAction.bind(null, entry.id);
  const [state, formAction, isPending] = useActionState(updateWithId, null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg('Registro contable actualizado exitosamente.');
      const t = setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [state, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-deep-charcoal border border-charcoal rounded-xl shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b border-charcoal bg-charcoal/30">
          <h2 className="text-lg font-semibold text-foreground">Editar Movimiento</h2>
          <button onClick={onClose} className="text-light-gray/60 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form action={formAction} className="p-6 space-y-4 text-left">
          {state?.error && (
            <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {state.error}
            </div>
          )}
          {successMsg && (
            <div className="rounded border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs text-light-gray mb-1">Fecha</label>
            <input
              type="date"
              name="date"
              defaultValue={entry.date}
              required
              className="w-full rounded-md bg-matte-black border border-charcoal px-3 py-2 text-sm text-foreground focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs text-light-gray mb-1">Descripción</label>
            <input
              type="text"
              name="description"
              defaultValue={entry.description}
              required
              className="w-full rounded-md bg-matte-black border border-charcoal px-3 py-2 text-sm text-foreground focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-light-gray mb-1">Tipo</label>
              <select
                name="type"
                defaultValue={entry.type}
                className="w-full rounded-md bg-matte-black border border-charcoal px-3 py-2 text-sm text-foreground focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold outline-none transition"
              >
                <option value="income">Ingreso (+)</option>
                <option value="expense">Gasto (-)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-light-gray mb-1">Monto ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="amount"
                defaultValue={entry.amount}
                required
                className="w-full rounded-md bg-matte-black border border-charcoal px-3 py-2 text-sm text-foreground focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-light-gray mb-1">Categoría</label>
            <select
              name="category"
              defaultValue={entry.category}
              className="w-full rounded-md bg-matte-black border border-charcoal px-3 py-2 text-sm text-foreground focus:border-metallic-gold focus:ring-1 focus:ring-metallic-gold outline-none transition"
            >
              <option value="Ventas">Ventas</option>
              <option value="Servicios">Servicios</option>
              <option value="Materiales y Compras">Materiales y Compras</option>
              <option value="Nómina">Nómina</option>
              <option value="Impuestos">Impuestos</option>
              <option value="Operativos">Gastos Operativos</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-light-gray hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center px-4 py-2 bg-metallic-gold hover:bg-metallic-gold/80 text-black text-sm font-bold rounded-lg transition disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
