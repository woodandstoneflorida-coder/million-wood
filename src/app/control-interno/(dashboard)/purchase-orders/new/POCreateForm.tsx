'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PurchaseOrderItem, PurchaseOrder } from '@/lib/db';
import { createPOAction, updatePOAction } from '@/app/actions/purchase-orders';
import { Plus, Trash, AlertCircle } from 'lucide-react';

interface POCreateFormProps {
  purchaseOrder?: PurchaseOrder;
}

export default function POCreateForm({ purchaseOrder }: POCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [vendorName, setVendorName] = useState(purchaseOrder?.vendorName || '');
  const [date, setDate] = useState(purchaseOrder?.date || '');
  const [notes, setNotes] = useState(purchaseOrder?.notes || '');

  useEffect(() => {
    if (!purchaseOrder) {
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [purchaseOrder]);

  // Dynamic Items list
  const [items, setItems] = useState<PurchaseOrderItem[]>(
    purchaseOrder?.items?.length ? purchaseOrder.items : [{ description: '', quantity: 1, price: 0 }]
  );

  // Calculation
  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
    const updated = [...items];
    if (field === 'description') {
      updated[index].description = value as string;
    } else {
      updated[index][field] = Number(value);
    }
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!vendorName.trim()) {
      setError('Por favor ingrese el nombre del proveedor.');
      return;
    }

    const invalidItems = items.some(item => !item.description.trim() || item.quantity <= 0 || item.price < 0);
    if (invalidItems) {
      setError('Por favor complete todos los campos de los items con valores válidos.');
      return;
    }

    startTransition(async () => {
      let response;
      if (purchaseOrder) {
        response = await updatePOAction(purchaseOrder.id, {
          vendorName,
          date,
          items,
          notes,
          total: total,
        });
      } else {
        response = await createPOAction({
          vendorName,
          date,
          items,
          notes,
        });
      }

      if (response.error) {
        setError(response.error);
      } else {
        router.push('/control-interno/purchase-orders');
      }
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Data Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="vendor" className="block text-[11px] font-semibold uppercase tracking-wider text-light-gray/60">
            Nombre del Proveedor *
          </label>
          <input
            type="text"
            id="vendor"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            required
            disabled={isPending}
            className="mt-2 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2.5 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50"
            placeholder="Ej: Maderas Miami, CNC Supplies Inc."
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-[11px] font-semibold uppercase tracking-wider text-light-gray/60">
            Fecha de Orden *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker();
              } catch (err) {}
            }}
            required
            disabled={isPending}
            className="mt-2 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2.5 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-light-gray/70">Conceptos / Materiales</h3>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={isPending}
            className="flex items-center space-x-1.5 rounded-lg border border-charcoal hover:border-metallic-gold/40 px-3 py-1.5 text-xs font-semibold text-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-metallic-gold" />
            <span>Agregar Fila</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3.5 items-end md:items-center">
              <div className="flex-1 w-full">
                <label className="block text-[9px] font-semibold uppercase text-light-gray/40 md:hidden">Descripción</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Descripción del material o servicio..."
                  required
                  disabled={isPending}
                  className="block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50"
                />
              </div>

              <div className="w-full md:w-24">
                <label className="block text-[9px] font-semibold uppercase text-light-gray/40 md:hidden">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  placeholder="Cant"
                  required
                  disabled={isPending}
                  className="block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50 text-right md:text-center"
                />
              </div>

              <div className="w-full md:w-36">
                <label className="block text-[9px] font-semibold uppercase text-light-gray/40 md:hidden">Costo Unitario ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={isPending}
                  className="block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50 text-right"
                />
              </div>

              <div className="flex justify-end w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  disabled={isPending || items.length === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition cursor-pointer"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-charcoal">
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-[11px] font-semibold uppercase tracking-wider text-light-gray/60">
            Notas Adicionales (Opcional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isPending}
            className="mt-2 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2.5 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50 resize-none"
            placeholder="Especificaciones técnicas, plazos de entrega..."
          />
        </div>

        <div className="rounded-lg bg-matte-black/40 border border-charcoal p-5 space-y-3.5 self-start">
          <div className="flex justify-between border-t border-charcoal pt-1.5 text-base font-bold text-foreground">
            <span>Total Orden:</span>
            <span className="text-foreground">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-charcoal">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center space-x-2 rounded-lg bg-foreground hover:opacity-90 px-6 py-3 text-sm font-semibold text-background transition duration-200 disabled:opacity-50 cursor-pointer shadow-lg"
        >
          {isPending ? 'Guardando Orden...' : 'Guardar Orden de Compra'}
        </button>
      </div>
    </form>
  );
}
