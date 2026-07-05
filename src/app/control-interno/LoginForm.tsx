'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions/auth';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-light-gray/80">
          Usuario
        </label>
        <input
          type="text"
          name="username"
          id="username"
          required
          autoComplete="username"
          disabled={isPending}
          className="mt-2 block w-full rounded-lg border border-charcoal bg-matte-black px-4 py-3 text-sm text-foreground placeholder-light-gray/30 outline-none transition duration-200 focus:border-metallic-gold/50 focus:ring-1 focus:ring-metallic-gold/50 disabled:opacity-50"
          placeholder="admin"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-light-gray/80">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          className="mt-2 block w-full rounded-lg border border-charcoal bg-matte-black px-4 py-3 text-sm text-foreground placeholder-light-gray/30 outline-none transition duration-200 focus:border-metallic-gold/50 focus:ring-1 focus:ring-metallic-gold/50 disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="relative flex w-full justify-center rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-matte-black transition duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-charcoal disabled:opacity-50 cursor-pointer shadow-lg"
      >
        {isPending ? (
          <span className="flex items-center space-x-2">
            <svg className="h-4 w-4 animate-spin text-matte-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Verificando...</span>
          </span>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
}
