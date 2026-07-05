import React from 'react';
import { cookies } from 'next/headers';
import { decryptSession } from '@/lib/auth-session';
import { db } from '@/lib/db';
import SettingsTabWrapper from './SettingsTabWrapper';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('mw_session')?.value;
  const session = sessionToken ? await decryptSession(sessionToken) : null;
  if (session && session.username === 'admin') {
    session.role = 'admin';
  }
  const isAdmin = session?.role === 'admin';

  const settings = await db.getSettings();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
          <p className="text-light-gray/60 text-sm">
            Gestione la información comercial de los PDFs y administre los perfiles de usuario de la plataforma.
          </p>
        </div>
      </div>

      <SettingsTabWrapper settings={settings} isAdmin={isAdmin} />
    </div>
  );
}
