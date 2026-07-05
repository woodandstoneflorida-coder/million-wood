'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar } from 'lucide-react';

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const updateRange = (start: string, end: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (start) params.set('startDate', start);
    else params.delete('startDate');

    if (end) params.set('endDate', end);
    else params.delete('endDate');

    router.push(`/control-interno/dashboard?${params.toString()}`);
  };

  const setPreset = (type: 'week' | 'month' | 'year' | 'all') => {
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    if (type === 'all') {
      updateRange('', '');
      return;
    }

    if (type === 'week') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
      const monday = new Date(today.setDate(diff));
      const Sunday = new Date(monday);
      Sunday.setDate(Sunday.getDate() + 6);
      updateRange(formatDate(monday), formatDate(Sunday));
    } else if (type === 'month') {
      const y = today.getFullYear();
      const m = today.getMonth();
      const firstDay = new Date(y, m, 1);
      const lastDay = new Date(y, m + 1, 0);
      updateRange(formatDate(firstDay), formatDate(lastDay));
    } else if (type === 'year') {
      const y = today.getFullYear();
      const firstDay = new Date(y, 0, 1);
      const lastDay = new Date(y, 11, 31);
      updateRange(formatDate(firstDay), formatDate(lastDay));
    }
  };

  return (
    <div className="rounded-xl border border-charcoal bg-deep-charcoal p-5 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 text-metallic-gold">
        <Calendar className="h-4.5 w-4.5" />
        <span className="text-xs font-semibold uppercase tracking-wider text-light-gray/80">Filtrar por Rango de Fechas</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Custom Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-light-gray/50">Desde:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => updateRange(e.target.value, endDate)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker();
                } catch (err) {}
              }}
              className="rounded-lg border border-charcoal bg-matte-black px-3 py-1.5 text-xs text-foreground outline-none transition focus:border-metallic-gold/50"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-light-gray/50">Hasta:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => updateRange(startDate, e.target.value)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker();
                } catch (err) {}
              }}
              className="rounded-lg border border-charcoal bg-matte-black px-3 py-1.5 text-xs text-foreground outline-none transition focus:border-metallic-gold/50"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPreset('week')}
            className="rounded-lg bg-charcoal border border-charcoal hover:border-metallic-gold/30 px-3 py-1.5 text-xs font-medium text-foreground transition cursor-pointer"
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPreset('month')}
            className="rounded-lg bg-charcoal border border-charcoal hover:border-metallic-gold/30 px-3 py-1.5 text-xs font-medium text-foreground transition cursor-pointer"
          >
            Este Mes
          </button>
          <button
            onClick={() => setPreset('year')}
            className="rounded-lg bg-charcoal border border-charcoal hover:border-metallic-gold/30 px-3 py-1.5 text-xs font-medium text-foreground transition cursor-pointer"
          >
            Este Año
          </button>
          <button
            onClick={() => setPreset('all')}
            className="rounded-lg bg-metallic-gold/20 border border-metallic-gold/30 hover:bg-metallic-gold/30 px-3.5 py-1.5 text-xs font-semibold text-metallic-gold transition cursor-pointer"
          >
            Todo el Tiempo
          </button>
        </div>
      </div>
    </div>
  );
}
