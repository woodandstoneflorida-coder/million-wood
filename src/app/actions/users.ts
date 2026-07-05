'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth-passwords';
import { decryptSession } from '@/lib/auth-session';

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('mw_session')?.value;
  if (!token) return false;
  const session = await decryptSession(token);
  if (session && session.username === 'admin') {
    session.role = 'admin';
  }
  return session && session.role === 'admin';
}

export async function getUsersAction() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { error: 'No autorizado. Se requieren permisos de administrador.' };
    }
    const users = await db.getUsers();
    const safeUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      name: u.name,
      role: u.role || 'editor'
    }));
    return { success: true, users: safeUsers };
  } catch (error) {
    console.error('Error in getUsersAction:', error);
    return { error: 'Error al obtener usuarios.' };
  }
}

export async function createUserAction(formData: {
  username: string;
  name: string;
  passwordTxt: string;
  role: 'admin' | 'editor';
}) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { error: 'No autorizado.' };
    }

    if (!formData.username || !formData.name || !formData.passwordTxt || !formData.role) {
      return { error: 'Por favor complete todos los datos.' };
    }

    // Check if user already exists
    const existing = await db.getUserByUsername(formData.username.trim().toLowerCase());
    if (existing) {
      return { error: 'El nombre de usuario ya está registrado.' };
    }

    const hashed = hashPassword(formData.passwordTxt);
    await db.createUser({
      username: formData.username.trim().toLowerCase(),
      name: formData.name.trim(),
      passwordHash: hashed,
      role: formData.role
    });

    revalidatePath('/control-interno/settings');
    return { success: true };
  } catch (error) {
    console.error('Error in createUserAction:', error);
    return { error: 'Error al crear el usuario.' };
  }
}

export async function updateUserPasswordAction(userId: string, passwordTxt: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { error: 'No autorizado.' };
    }

    if (!passwordTxt) {
      return { error: 'La contraseña no puede estar vacía.' };
    }

    const hashed = hashPassword(passwordTxt);
    await db.updateUserPassword(userId, hashed);
    return { success: true };
  } catch (error) {
    console.error('Error in updateUserPasswordAction:', error);
    return { error: 'Error al actualizar la contraseña.' };
  }
}

export async function updateUserRoleAction(userId: string, role: 'admin' | 'editor') {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { error: 'No autorizado.' };
    }

    await db.updateUserRole(userId, role);
    revalidatePath('/control-interno/settings');
    return { success: true };
  } catch (error) {
    console.error('Error in updateUserRoleAction:', error);
    return { error: 'Error al actualizar el rol del usuario.' };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { error: 'No autorizado.' };
    }

    if (userId === 'admin-id') {
      return { error: 'No se puede eliminar el usuario administrador principal.' };
    }

    await db.deleteUser(userId);
    revalidatePath('/control-interno/settings');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteUserAction:', error);
    return { error: 'Error al eliminar el usuario.' };
  }
}
