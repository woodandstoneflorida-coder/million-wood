'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth-passwords';
import { encryptSession } from '@/lib/auth-session';

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Por favor complete todos los campos.' };
  }

  try {
    const user = await db.getUserByUsername(username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { error: 'Usuario o contraseña incorrectos.' };
    }

    // Create session token
    const sessionToken = await encryptSession({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role || 'editor',
    });

    // Save to HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('mw_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    });
  } catch (error: any) {
    if (error && error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error; // Let next.js handle redirect
    }
    return { error: 'Error del servidor. Por favor intente de nuevo.' };
  }

  // Redirect to dashboard
  redirect('/control-interno/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('mw_session');
  redirect('/');
}
