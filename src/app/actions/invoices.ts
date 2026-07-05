'use server';

import { revalidatePath } from 'next/cache';
import { db, InvoiceItem } from '@/lib/db';

export async function createInvoiceAction(data: {
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  anticipo?: number;
}) {
  if (!data.clientId || !data.clientName || !data.date || !data.dueDate || data.items.length === 0) {
    return { error: 'Por favor complete todos los datos requeridos y agregue al menos un item.' };
  }

  try {
    const newInvoice = await db.createInvoice({
      clientId: data.clientId,
      clientName: data.clientName,
      date: data.date,
      dueDate: data.dueDate,
      status: 'pending',
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      anticipo: data.anticipo || 0,
      notes: data.notes || '',
    });

    revalidatePath('/control-interno/invoices');
    revalidatePath('/control-interno/dashboard');
    revalidatePath('/control-interno/accounting');
    
    return { success: true, invoiceId: newInvoice.id };
  } catch (error) {
    console.error('Error in createInvoiceAction:', error);
    return { error: 'Ocurrió un error al registrar la factura.' };
  }
}

export async function updateInvoiceStatusAction(id: string, status: 'pending' | 'paid' | 'cancelled') {
  try {
    await db.updateInvoiceStatus(id, status);
    
    revalidatePath('/control-interno/invoices');
    revalidatePath('/control-interno/dashboard');
    revalidatePath('/control-interno/accounting');
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateInvoiceStatusAction:', error);
    return { error: 'Ocurrió un error al actualizar el estado de la factura.' };
  }
}

export async function updateInvoiceAction(id: string, data: {
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  anticipo?: number;
}) {
  if (!id || !data.clientId || !data.clientName || !data.date || !data.dueDate || data.items.length === 0) {
    return { error: 'Por favor complete todos los datos requeridos y agregue al menos un item.' };
  }

  try {
    await db.updateInvoice(id, {
      clientId: data.clientId,
      clientName: data.clientName,
      date: data.date,
      dueDate: data.dueDate,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      anticipo: data.anticipo || 0,
      notes: data.notes || '',
    });

    revalidatePath(`/control-interno/invoices/${id}`);
    revalidatePath('/control-interno/invoices');
    revalidatePath('/control-interno/dashboard');
    revalidatePath('/control-interno/accounting');
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateInvoiceAction:', error);
    return { error: 'Ocurrió un error al actualizar la factura.' };
  }
}

export async function deleteInvoiceAction(id: string) {
  try {
    await db.deleteInvoice(id);

    revalidatePath('/control-interno/invoices');
    revalidatePath('/control-interno/dashboard');
    revalidatePath('/control-interno/accounting');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteInvoiceAction:', error);
    return { error: 'Ocurrió un error al eliminar la factura.' };
  }
}
