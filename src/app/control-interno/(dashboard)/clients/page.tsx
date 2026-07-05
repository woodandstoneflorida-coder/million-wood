import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import ClientForm from './ClientForm';
import ClientList from './ClientList';
import { UserPlus } from 'lucide-react';

export default async function ClientsPage() {
  const clients = await db.getClients();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Clientes</h1>
        <p className="text-light-gray/60 text-sm mt-1">
          Administra y registra tu lista de clientes y contactos comerciales.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side: Client Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-charcoal bg-deep-charcoal p-6 shadow-sm sticky top-6">
            <div className="flex items-center space-x-2 text-metallic-gold mb-6">
              <UserPlus className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground">Registrar Cliente</h2>
            </div>
            <ClientForm />
          </div>
        </div>

        {/* Right Side: Clients List */}
        <div className="lg:col-span-2 space-y-4">
          <ClientList clients={clients} />
        </div>
      </div>
    </div>
  );
}
