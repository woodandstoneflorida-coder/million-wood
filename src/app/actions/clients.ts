'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createClientAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const taxId = formData.get('taxId') as string;

  if (!name || !phone) {
    return { error: 'Nombre y Teléfono son requeridos.' };
  }

  try {
    await db.createClient({
      name,
      email: email || '',
      phone,
      address: address || '',
      taxId: taxId || '',
    });
  } catch (error) {
    console.error('Error in createClientAction:', error);
    return { error: 'Ocurrió un error al registrar el cliente.' };
  }

  revalidatePath('/control-interno/clients');
  revalidatePath('/control-interno/dashboard');
  return { success: true };
}

export async function updateClientAction(id: string, prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const taxId = formData.get('taxId') as string;

  if (!name || !phone) {
    return { error: 'Nombre y Teléfono son requeridos.' };
  }

  try {
    await db.updateClient(id, {
      name,
      email: email || '',
      phone,
      address: address || '',
      taxId: taxId || '',
    });
  } catch (error) {
    console.error('Error in updateClientAction:', error);
    return { error: 'Ocurrió un error al actualizar el cliente.' };
  }

  revalidatePath('/control-interno/clients');
  revalidatePath('/control-interno/dashboard');
  return { success: true };
}

export async function deleteClientAction(id: string) {
  try {
    await db.deleteClient(id);
    revalidatePath('/control-interno/clients');
    revalidatePath('/control-interno/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteClientAction:', error);
    return { error: 'Ocurrió un error al eliminar el cliente.' };
  }
}
