import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import POCreateForm from '../new/POCreateForm';

export default async function EditPurchaseOrderPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const pos = await db.getPurchaseOrders();
  const po = pos.find((p) => p.id === params.id);

  if (!po) {
    notFound();
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Orden de Compra {po.poNumber}</h1>
        <p className="text-sm text-light-gray mt-1">
          Actualice los detalles de la orden de compra.
        </p>
      </div>

      <div className="bg-deep-charcoal border border-charcoal rounded-xl shadow-lg p-6">
        <POCreateForm purchaseOrder={po} />
      </div>
    </div>
  );
}
