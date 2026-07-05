'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function getSettingsAction() {
  try {
    const settings = await db.getSettings();
    return { success: true, settings };
  } catch (error) {
    console.error('Error in getSettingsAction:', error);
    return { error: 'No se pudo obtener la configuración de la empresa.' };
  }
}

export async function updateSettingsAction(data: {
  companyName: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  logoPath: string;
}) {
  try {
    await db.updateSettings(data);
    revalidatePath('/control-interno/settings');
    return { success: true };
  } catch (error) {
    console.error('Error in updateSettingsAction:', error);
    return { error: 'Ocurrió un error al guardar la configuración.' };
  }
}
