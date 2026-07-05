import { cookies } from 'next/headers';
import { decryptSession } from '@/lib/auth-session';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Auth Check: only allow logged in administrators
    const cookieStore = await cookies();
    const token = cookieStore.get('mw_session')?.value;
    if (!token) {
      return new Response('No autorizado', { status: 401 });
    }
    const session = await decryptSession(token);
    // Apply admin fallback
    if (session && session.username === 'admin') {
      session.role = 'admin';
    }
    if (!session || session.role !== 'admin') {
      return new Response('No autorizado. Se requieren permisos de administrador.', { status: 403 });
    }

    // Gather all tables
    const users = await db.getUsers();
    const clients = await db.getClients();
    const invoices = await db.getInvoices();
    const quotes = await db.getQuotes();
    const purchaseOrders = await db.getPurchaseOrders();
    const accountingEntries = await db.getAccountingEntries();
    const settings = await db.getSettings();

    // Assemble payload (removing passwords for security backup standard)
    const safeUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      name: u.name,
      role: u.role || 'editor'
    }));

    const backupData = {
      users: safeUsers,
      clients,
      invoices,
      purchaseOrders,
      accountingEntries,
      quotes,
      settings,
      backupTimestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(backupData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="million-wood-backup.json"',
      },
    });
  } catch (error) {
    console.error('Error creating backup payload:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
