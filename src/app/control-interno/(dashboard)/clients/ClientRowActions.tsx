'use client';

import { useState } from 'react';
import { deleteClientAction } from '@/app/actions/clients';
import { Pencil, Trash2 } from 'lucide-react';
import { Client } from '@/lib/db';
import ClientEditModal from './ClientEditModal';

interface ClientRowActionsProps {
  client: Client;
}

export default function ClientRowActions({ client }: ClientRowActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm(`¿Está seguro de ELIMINAR al cliente ${client.name}? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true);
      const result = await deleteClientAction(client.id);
      if (result?.error) {
        alert(result.error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          title="Editar Cliente"
          className="flex h-7 w-7 items-center justify-center rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title="Eliminar Cliente"
          className="flex h-7 w-7 items-center justify-center rounded bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-900/40 transition cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ClientEditModal
        client={client}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
