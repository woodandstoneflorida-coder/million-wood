'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createClientAction } from '@/app/actions/clients';

export default function ClientForm() {
  const [state, formAction, isPending] = useActionState(createClientAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-400">
          Cliente registrado exitosamente.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
          Nombre Completo *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          disabled={isPending}
          className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50"
          placeholder="Ej: Juan Pérez o Million Wood Inc"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label htmlFor="email" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
            Correo Electrónico (Opcional)
          </label>
          <input
            type="email"
            name="email"
            id="email"
            disabled={isPending}
            className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
            Teléfono *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            disabled={isPending}
            className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50"
            placeholder="+1 (754) 267-3047"
          />
        </div>
      </div>

      <div>
        <label htmlFor="taxId" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
          ID Fiscal / RUT / EIN (Opcional)
        </label>
        <input
          type="text"
          name="taxId"
          id="taxId"
          disabled={isPending}
          className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50"
          placeholder="Ej: 12-3456789"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-[10px] font-semibold uppercase tracking-wider text-light-gray/60">
          Dirección Comercial (Opcional)
        </label>
        <textarea
          name="address"
          id="address"
          rows={2}
          disabled={isPending}
          className="mt-1.5 block w-full rounded-lg border border-charcoal bg-matte-black px-3.5 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-metallic-gold/50 disabled:opacity-50 resize-none"
          placeholder="Dirección fiscal o comercial..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center rounded-lg bg-gradient-to-r from-metallic-gold to-[#b38728] px-4 py-2.5 text-sm font-semibold text-matte-black transition duration-200 hover:from-[#FCF6BA] hover:to-metallic-gold disabled:opacity-50 cursor-pointer shadow-md shadow-metallic-gold/5"
      >
        {isPending ? 'Guardando...' : 'Registrar Cliente'}
      </button>
    </form>
  );
}
