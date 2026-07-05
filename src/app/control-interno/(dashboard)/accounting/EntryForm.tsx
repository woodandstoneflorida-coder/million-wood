'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createAccountingEntryAction } from '@/app/actions/accounting';
import { PlusCircle } from 'lucide-react';

export default function EntryForm() {
  const [state, formAction, isPending] = useActionState(createAccountingEntryAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  const categories = type === 'income' 
    ? ['Ventas', 'Servicios', 'Inversión', 'Otros Ingresos'] 
    : ['Nómina / Salarios', 'Alquiler', 'Materiales y Herramientas', 'Publicidad y Marketing', 'Servicios Públicos (Luz/Internet)', 'Impuestos', 'Reparaciones', 'Otros Egresos'];

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-400">
          Movimiento registrado exitosamente.
        </div>
      )}

      {/* Tipo de Movimiento */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60 mb-2">
          Tipo de Movimiento *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex justify-center items-center py-2.5 rounded-lg border text-sm font-semibold transition cursor-pointer ${
            type === 'expense'
              ? 'bg-red-500/10 border-red-500/50 text-red-400'
              : 'border-charcoal bg-matte-black/50 text-light-gray/60 hover:text-foreground'
          }`}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={type === 'expense'}
              onChange={() => setType('expense')}
              className="sr-only"
            />
            <span>Egreso / Gasto</span>
          </label>
          
          <label className={`flex justify-center items-center py-2.5 rounded-lg border text-sm font-semibold transition cursor-pointer ${
            type === 'income'
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'border-charcoal bg-matte-black/50 text-light-gray/60 hover:text-foreground'
          }`}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === 'income'}
              onChange={() => setType('income')}
              className="sr-only"
            />
            <span>Ingreso</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fecha */}
        <div>
          <label htmlFor="date" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
            Fecha *
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            disabled={isPending}
            defaultValue={new Date().toISOString().split('T')[0]}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker();
              } catch (err) {}
            }}
            className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition focus:border-metallic-gold/50 disabled:opacity-50"
          />
        </div>

        {/* Monto */}
        <div>
          <label htmlFor="amount" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
            Monto ($) *
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            required
            min="0.01"
            step="0.01"
            disabled={isPending}
            className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition focus:border-metallic-gold/50 disabled:opacity-50 text-right"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="category" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
          Categoría *
        </label>
        <select
          name="category"
          id="category"
          required
          disabled={isPending}
          className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition focus:border-metallic-gold/50 disabled:opacity-50"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
          Concepto / Descripción *
        </label>
        <input
          type="text"
          name="description"
          id="description"
          required
          disabled={isPending}
          className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition focus:border-metallic-gold/50 disabled:opacity-50"
          placeholder="Ej: Pago de alquiler taller de carpintería"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-gradient-to-r from-metallic-gold to-[#b38728] px-4 py-2.5 text-sm font-semibold text-matte-black transition duration-200 hover:from-[#FCF6BA] hover:to-metallic-gold disabled:opacity-50 cursor-pointer shadow-md shadow-metallic-gold/5"
      >
        <PlusCircle className="h-4 w-4" />
        <span>{isPending ? 'Registrando...' : 'Registrar Movimiento'}</span>
      </button>
    </form>
  );
}
