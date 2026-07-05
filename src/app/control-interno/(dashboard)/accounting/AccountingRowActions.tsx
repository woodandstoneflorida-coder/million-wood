'use client';

import { useState } from 'react';
import { Trash, Pencil } from 'lucide-react';
import { deleteAccountingEntryAction } from '@/app/actions/accounting';
import { AccountingEntry } from '@/lib/db';
import AccountingEditModal from './AccountingEditModal';

interface AccountingRowActionsProps {
  entry: AccountingEntry;
}

export default function AccountingRowActions({ entry }: AccountingRowActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este movimiento contable? Esta acción no se puede deshacer.')) return;
    
    setIsDeleting(true);
    const result = await deleteAccountingEntryAction(entry.id);
    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-400/60 hover:text-blue-400 transition cursor-pointer"
          title="Editar registro"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-400/60 hover:text-red-400 transition cursor-pointer disabled:opacity-50"
          title="Eliminar registro"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      <AccountingEditModal
        entry={entry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
