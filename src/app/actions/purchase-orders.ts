'use server';

import { revalidatePath } from 'next/cache';
import { db, PurchaseOrderItem } from '@/lib/db';

export async function createPOAction(data: {
  vendorName: string;
  date: string;
  items: PurchaseOrderItem[];
  notes?: string;
}) {
  if (!data.vendorName || !data.date || data.items.length === 0) {
    return { error: 'Por favor complete todos los datos requeridos y agregue al menos un item.' };
  }

  // Calculate Total
  const total = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  try {
    const newPO = await db.createPurchaseOrder({
      vendorName: data.vendorName,
      date: data.date,
      status: 'pending',
      items: data.items,
      total,
      notes: data.notes || '',
    });

    revalidatePath('/control-interno/purchase-orders');
    revalidatePath('/control-interno/dashboard');
    revalidatePath('/control-interno/accounting');

    return { success: true, poId: newPO.id };
  } catch (error) {
    console.error('Error in createPOAction:', error);
    return { error: 'Ocurrió un error al registrar la orden de compra.' };
  }
}

export async function updatePOStatusAction(
  id: string, 
  status: 'pending' | 'approved' | 'received' | 'cancelled'
) {
  try {
    await db.updatePOStatus(id, status);

    revalidatePath('/control-interno/purchase-orders');
    revalidatePath('/control-interno/dashboard');
    revalidatePath('/control-interno/accounting');

    return { success: true };
  } catch (error) {
    console.error('Error in updatePOStatusAction:', error);
    return { error: 'Ocurrió un error al actualizar el estado de la orden.' };
  }
}

export async function updatePOAction(id: string, data: {
  vendorName: string;
  date: string;
  items: PurchaseOrderItem[];
  notes?: string;
  total: number;
}) {
  if (!data.vendorName || !data.date || data.items.length === 0) {
    return { error: 'Por favor complete todos los datos requeridos y agregue al menos un item.' };
  }

  try {
    await db.updatePurchaseOrder(id, {
      vendorName: data.vendorName,
      date: data.date,
      items: data.items,
      total: data.total,
      notes: data.notes || '',
    });

    revalidatePath('/control-interno/purchase-orders');
    revalidatePath('/control-interno/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error in updatePOAction:', error);
    return { error: 'Ocurrió un error al actualizar la orden de compra.' };
  }
}

export async function deletePOAction(id: string) {
  try {
    await db.deletePurchaseOrder(id);
    
    revalidatePath('/control-interno/purchase-orders');
    revalidatePath('/control-interno/dashboard');
    revalidatePath('/control-interno/accounting');
    
    return { success: true };
  } catch (error) {
    console.error('Error in deletePOAction:', error);
    return { error: 'Ocurrió un error al eliminar la orden de compra.' };
  }
}
