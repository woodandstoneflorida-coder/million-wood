'use server';

import { revalidatePath } from 'next/cache';
import { db, QuoteItem } from '@/lib/db';

export async function createQuoteAction(data: {
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: QuoteItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  anticipo?: number;
  isOptionsList?: boolean;
}) {
  if (!data.clientId || !data.clientName || !data.date || !data.dueDate || data.items.length === 0) {
    return { error: 'Por favor complete todos los datos requeridos y agregue al menos un item.' };
  }

  try {
    const newQuote = await db.createQuote({
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
      isOptionsList: data.isOptionsList || false,
      notes: data.notes || '',
    });

    revalidatePath('/control-interno/quotes');
    revalidatePath('/control-interno/dashboard');
    return { success: true, quoteId: newQuote.id };
  } catch (error) {
    console.error('Error in createQuoteAction:', error);
    return { error: 'Ocurrió un error al registrar la cotización.' };
  }
}

export async function updateQuoteStatusAction(id: string, status: 'pending' | 'accepted' | 'declined') {
  try {
    await db.updateQuoteStatus(id, status);
    revalidatePath('/control-interno/quotes');
    revalidatePath('/control-interno/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error in updateQuoteStatusAction:', error);
    return { error: 'Ocurrió un error al actualizar el estado de la cotización.' };
  }
}

export async function convertQuoteToInvoiceAction(quoteId: string) {
  try {
    const newInvoice = await db.convertQuoteToInvoice(quoteId);
    
    revalidatePath('/control-interno/quotes');
    revalidatePath('/control-interno/invoices');
    revalidatePath('/control-interno/dashboard');
    
    return { success: true, invoiceId: newInvoice.id };
  } catch (error) {
    console.error('Error in convertQuoteToInvoiceAction:', error);
    return { error: 'Ocurrió un error al convertir la cotización en factura.' };
  }
}

export async function updateQuoteAction(id: string, data: {
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: QuoteItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  anticipo?: number;
  isOptionsList?: boolean;
}) {
  if (!id || !data.clientId || !data.clientName || !data.date || !data.dueDate || data.items.length === 0) {
    return { error: 'Por favor complete todos los datos requeridos y agregue al menos un item.' };
  }

  try {
    await db.updateQuote(id, {
      clientId: data.clientId,
      clientName: data.clientName,
      date: data.date,
      dueDate: data.dueDate,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      anticipo: data.anticipo || 0,
      isOptionsList: data.isOptionsList || false,
      notes: data.notes || '',
    });

    revalidatePath(`/control-interno/quotes/${id}`);
    revalidatePath('/control-interno/quotes');
    revalidatePath('/control-interno/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateQuoteAction:', error);
    return { error: 'Ocurrió un error al actualizar la cotización.' };
  }
}

export async function deleteQuoteAction(id: string) {
  try {
    await db.deleteQuote(id);

    revalidatePath('/control-interno/quotes');
    revalidatePath('/control-interno/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteQuoteAction:', error);
    return { error: 'Ocurrió un error al eliminar la cotización.' };
  }
}
