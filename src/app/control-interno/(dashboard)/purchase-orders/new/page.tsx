import React from 'react';
import Link from 'next/link';
import POCreateForm from './POCreateForm';
import { ArrowLeft } from 'lucide-react';

export default function NewPurchaseOrderPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header and Back Button */}
      <div className="flex items-center space-x-3">
        <Link
          href="/control-interno/purchase-orders"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-charcoal bg-deep-charcoal text-light-gray/80 hover:text-foreground hover:border-metallic-gold/30 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Nueva Órden de Compra</h1>
          <p className="text-light-gray/60 text-xs mt-0.5">
            Registra una solicitud de adquisición de insumos o servicios a proveedores.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal bg-deep-charcoal p-6 md:p-8 shadow-sm">
        <POCreateForm />
      </div>
    </div>
  );
}
