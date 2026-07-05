'use client';

import React, { useState } from 'react';
import { CompanySettings } from '@/lib/db';
import SettingsForm from './SettingsForm';
import UserManagement from './UserManagement';

export default function SettingsTabWrapper({
  settings,
  isAdmin,
}: {
  settings: CompanySettings;
  isAdmin: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'profile' | 'users'>('profile');

  return (
    <div className="space-y-6">
      {/* Tabs list */}
      <div className="flex border-b border-charcoal">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition duration-200 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-light-gray/60 hover:text-foreground'
          }`}
        >
          Datos de Empresa
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition duration-200 cursor-pointer ${
            activeTab === 'users'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-light-gray/60 hover:text-foreground'
          }`}
        >
          Gestión de Usuarios
        </button>
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-charcoal bg-deep-charcoal p-6 md:p-8 shadow-xl">
        {activeTab === 'profile' && <SettingsForm initialSettings={settings} isAdmin={isAdmin} />}
        {activeTab === 'users' && (
          isAdmin ? (
            <UserManagement />
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-foreground">Acceso Restringido</h4>
              <p className="text-sm text-light-gray/60 max-w-md mx-auto">
                Se requieren permisos de Administrador para gestionar las cuentas, roles y contraseñas de acceso a la plataforma.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
