'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createAccountingEntryAction(prevState: any, formData: FormData) {
  const date = formData.get('date') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as 'income' | 'expense';
  const amount = Number(formData.get('amount'));
  const category = formData.get('category') as string;

  if (!date || !description || !type || isNaN(amount) || amount <= 0 || !category) {
    return { error: 'Todos los campos son obligatorios y el monto debe ser mayor que 0.' };
  }

  try {
    await db.createAccountingEntry({
      date,
      description,
      type,
      amount,
      category,
    });
  } catch (error) {
    console.error('Error in createAccountingEntryAction:', error);
    return { error: 'Ocurrió un error al registrar el movimiento contable.' };
  }

  revalidatePath('/control-interno/accounting');
  revalidatePath('/control-interno/dashboard');
  return { success: true };
}

export async function deleteAccountingEntryAction(id: string) {
  try {
    await db.deleteAccountingEntry(id);
    
    revalidatePath('/control-interno/accounting');
    revalidatePath('/control-interno/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting accounting entry:', error);
    return { error: 'Error al eliminar el movimiento contable.' };
  }
}

export async function updateAccountingEntryAction(id: string, prevState: any, formData: FormData) {
  const date = formData.get('date') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as 'income' | 'expense';
  const amount = Number(formData.get('amount'));
  const category = formData.get('category') as string;

  if (!date || !description || !type || isNaN(amount) || amount <= 0 || !category) {
    return { error: 'Todos los campos son obligatorios y el monto debe ser mayor que 0.' };
  }

  try {
    await db.updateAccountingEntry(id, {
      date,
      description,
      type,
      amount,
      category,
    });
  } catch (error) {
    console.error('Error in updateAccountingEntryAction:', error);
    return { error: 'Ocurrió un error al actualizar el movimiento contable.' };
  }

  revalidatePath('/control-interno/accounting');
  revalidatePath('/control-interno/dashboard');
  return { success: true };
}
