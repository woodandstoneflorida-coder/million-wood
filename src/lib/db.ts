import fs from 'fs/promises';
import path from 'path';

// Schema Definitions
export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role?: 'admin' | 'editor';
}

export interface CompanySettings {
  id: string;
  companyName: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  logoPath: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string; // Opcional según los nuevos requerimientos
  phone: string;
  address: string;
  taxId: string; // RFC, EIN, etc.
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  anticipo: number;
  notes?: string;
  createdAt: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string; // Expiration date
  status: 'pending' | 'accepted' | 'declined';
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  anticipo: number;
  isOptionsList?: boolean;
  notes?: string;
  createdAt: string;
}

export interface PurchaseOrderItem {
  description: string;
  quantity: number;
  price: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  date: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  total: number;
  notes?: string;
  createdAt: string;
}

export interface AccountingEntry {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  referenceId?: string; // links to invoiceId or poId
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  clients: Client[];
  invoices: Invoice[];
  quotes: Quote[];
  purchaseOrders: PurchaseOrder[];
  accountingEntries: AccountingEntry[];
  settings?: CompanySettings;
}

const LOCAL_DB_PATH = path.join(process.cwd(), 'db.json');

// Initialize database file if it doesn't exist
async function getLocalData(): Promise<DatabaseSchema> {
  try {
    const data = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Migration: ensure 'quotes' exists in the JSON database
    let migrated = false;
    if (!parsed.quotes) {
      parsed.quotes = [];
      migrated = true;
    }
    // Migration: ensure default settings exists
    if (!parsed.settings) {
      parsed.settings = {
        id: 'main',
        companyName: 'MILLION WOOD',
        subtitle: 'Custom Cabinets and Wood Works',
        address: '7321 NW 61st Street, Miami, FL 33166',
        phone: '+1-754-267-3047',
        email: 'millionwoodusa@gmail.com',
        logoPath: '/logos/logo%20png.png',
        updatedAt: new Date().toISOString(),
      };
      migrated = true;
    }
    // Migration: ensure admin user has role 'admin'
    if (parsed.users) {
      parsed.users.forEach((u: any) => {
        if (!u.role) {
          u.role = u.username === 'admin' ? 'admin' : 'editor';
          migrated = true;
        }
      });
    }

    // Migration: ensure each invoice/quote has anticipo field
    if (parsed.invoices) {
      parsed.invoices.forEach((inv: any) => {
        if (inv.anticipo === undefined) { inv.anticipo = 0; migrated = true; }
      });
    }
    if (parsed.quotes) {
      parsed.quotes.forEach((q: any) => {
        if (q.anticipo === undefined) { q.anticipo = 0; migrated = true; }
        if (q.isOptionsList === undefined) { q.isOptionsList = false; migrated = true; }
      });
    }

    if (migrated) {
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    
    return parsed as DatabaseSchema;
  } catch (error) {
    const initialSchema: DatabaseSchema = {
      users: [
        {
          id: 'admin-id',
          username: 'admin',
          // Contraseña por defecto: "admin123"
          passwordHash: '350c3c1bb65a3f216f91f6e67327164c:958d6501f8bf619d0f75c5fb6657e644a68c9ba9a753228d1685ffe4b297ddb0e97c3ea9d7df599c9bbb996b9b445bb4eb74b7dd74329f1da161fa0bd985e85d',
          name: 'Administrador Million Wood',
          role: 'admin',
        }
      ],
      clients: [],
      invoices: [],
      quotes: [],
      purchaseOrders: [],
      accountingEntries: [],
      settings: {
        id: 'main',
        companyName: 'MILLION WOOD',
        subtitle: 'Custom Cabinets and Wood Works',
        address: '7321 NW 61st Street, Miami, FL 33166',
        phone: '+1-754-267-3047',
        email: 'millionwoodusa@gmail.com',
        logoPath: '/logos/logo%20png.png',
        updatedAt: new Date().toISOString(),
      },
    };
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(initialSchema, null, 2), 'utf-8');
    return initialSchema;
  }
}

async function saveLocalData(data: DatabaseSchema): Promise<void> {
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// PostgreSQL Integration if DATABASE_URL is defined
let pgSql: any = null;

async function getPostgresClient() {
  if (pgSql) return pgSql;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  try {
    // Dynamic import to avoid crash if not installed
    const postgres = (await import('postgres')).default;
    pgSql = postgres(dbUrl, {
      ssl: { rejectUnauthorized: false }, // Useful for Supabase/Neon serverless connections
    });
    
    // Create tables if they don't exist
    await pgSql`
      CREATE TABLE IF NOT EXISTS mw_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'editor'
      );
    `;
    try {
      await pgSql`ALTER TABLE mw_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'editor'`;
    } catch (e) {
      // Catch in case database engine doesn't support IF NOT EXISTS in ALTER
    }

    await pgSql`
      CREATE TABLE IF NOT EXISTS mw_settings (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        logo_path TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `;

    await pgSql`
      CREATE TABLE IF NOT EXISTS mw_clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        tax_id TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `;
    await pgSql`
      CREATE TABLE IF NOT EXISTS mw_invoices (
        id TEXT PRIMARY KEY,
        invoice_number TEXT UNIQUE NOT NULL,
        client_id TEXT NOT NULL,
        client_name TEXT NOT NULL,
        date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        status TEXT NOT NULL,
        items JSONB NOT NULL,
        subtotal NUMERIC NOT NULL,
        tax NUMERIC NOT NULL,
        total NUMERIC NOT NULL,
        anticipo NUMERIC NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL
      );
    `;
    try {
      await pgSql`ALTER TABLE mw_invoices ADD COLUMN IF NOT EXISTS anticipo NUMERIC NOT NULL DEFAULT 0`;
    } catch (e) { /* column may already exist */ }
    await pgSql`
      CREATE TABLE IF NOT EXISTS mw_quotes (
        id TEXT PRIMARY KEY,
        quote_number TEXT UNIQUE NOT NULL,
        client_id TEXT NOT NULL,
        client_name TEXT NOT NULL,
        date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        status TEXT NOT NULL,
        items JSONB NOT NULL,
        subtotal NUMERIC NOT NULL,
        tax NUMERIC NOT NULL,
        total NUMERIC NOT NULL,
        anticipo NUMERIC NOT NULL DEFAULT 0,
        is_options_list BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TEXT NOT NULL
      );
    `;
    try {
      await pgSql`ALTER TABLE mw_quotes ADD COLUMN IF NOT EXISTS anticipo NUMERIC NOT NULL DEFAULT 0`;
    } catch (e) { /* column may already exist */ }
    try {
      await pgSql`ALTER TABLE mw_quotes ADD COLUMN IF NOT EXISTS is_options_list BOOLEAN DEFAULT false`;
    } catch (e) { /* column may already exist */ }
    await pgSql`
      CREATE TABLE IF NOT EXISTS mw_purchase_orders (
        id TEXT PRIMARY KEY,
        po_number TEXT UNIQUE NOT NULL,
        vendor_name TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        items JSONB NOT NULL,
        total NUMERIC NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL
      );
    `;
    await pgSql`
      CREATE TABLE IF NOT EXISTS mw_accounting_entries (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        category TEXT NOT NULL,
        reference_id TEXT,
        created_at TEXT NOT NULL
      );
    `;

    // Insert default admin if not exists in SQL
    const admins = await pgSql`SELECT id FROM mw_users WHERE username = 'admin'`;
    if (admins.length === 0) {
      await pgSql`
        INSERT INTO mw_users (id, username, password_hash, name, role)
        VALUES (
          'admin-id', 
          'admin', 
          '350c3c1bb65a3f216f91f6e67327164c:958d6501f8bf619d0f75c5fb6657e644a68c9ba9a753228d1685ffe4b297ddb0e97c3ea9d7df599c9bbb996b9b445bb4eb74b7dd74329f1da161fa0bd985e85d', 
          'Administrador Million Wood',
          'admin'
        )
      `;
    }

    // Insert default settings if not exists in SQL
    const settings = await pgSql`SELECT id FROM mw_settings LIMIT 1`;
    if (settings.length === 0) {
      await pgSql`
        INSERT INTO mw_settings (id, company_name, subtitle, address, phone, email, logo_path, updated_at)
        VALUES (
          'main',
          'MILLION WOOD',
          'Custom Cabinets and Wood Works',
          '7321 NW 61st Street, Miami, FL 33166',
          '+1-754-267-3047',
          'millionwoodusa@gmail.com',
          '/logos/logo%20png.png',
          ${new Date().toISOString()}
        )
      `;
    }

    return pgSql;
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    return null;
  }
}

// Unified Database Repository
export const db = {
  // --- USERS ---
  async getUserByUsername(username: string): Promise<User | null> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`SELECT id, username, password_hash as "passwordHash", name, role FROM mw_users WHERE username = ${username}`;
      return rows[0] || null;
    }
    const data = await getLocalData();
    return data.users.find(u => u.username === username) || null;
  },

  async getUsers(): Promise<User[]> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`SELECT id, username, password_hash as "passwordHash", name, role FROM mw_users ORDER BY username ASC`;
      return rows as User[];
    }
    const data = await getLocalData();
    return data.users;
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = crypto.randomUUID();
    const newUser: User = { ...user, id };

    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        INSERT INTO mw_users (id, username, password_hash, name, role)
        VALUES (${id}, ${user.username}, ${user.passwordHash}, ${user.name}, ${user.role || 'editor'})
      `;
      return newUser;
    }

    const data = await getLocalData();
    data.users.push(newUser);
    await saveLocalData(data);
    return newUser;
  },

  async updateUserPassword(id: string, passwordHash: string): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`UPDATE mw_users SET password_hash = ${passwordHash} WHERE id = ${id}`;
      return;
    }

    const data = await getLocalData();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      data.users[idx].passwordHash = passwordHash;
      await saveLocalData(data);
    }
  },

  async updateUserRole(id: string, role: 'admin' | 'editor'): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`UPDATE mw_users SET role = ${role} WHERE id = ${id}`;
      return;
    }

    const data = await getLocalData();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      data.users[idx].role = role;
      await saveLocalData(data);
    }
  },

  async deleteUser(id: string): Promise<void> {
    if (id === 'admin-id') return;

    const pg = await getPostgresClient();
    if (pg) {
      await pg`DELETE FROM mw_users WHERE id = ${id}`;
      return;
    }

    const data = await getLocalData();
    data.users = data.users.filter(u => u.id !== id);
    await saveLocalData(data);
  },

  // --- SETTINGS ---
  async getSettings(): Promise<CompanySettings> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`
        SELECT 
          id, 
          company_name as "companyName", 
          subtitle, 
          address, 
          phone, 
          email, 
          logo_path as "logoPath", 
          updated_at as "updatedAt" 
        FROM mw_settings 
        WHERE id = 'main'
      `;
      if (rows[0]) return rows[0] as CompanySettings;
    }

    const data = await getLocalData();
    if (data.settings) return data.settings;

    return {
      id: 'main',
      companyName: 'MILLION WOOD',
      subtitle: 'Custom Cabinets and Wood Works',
      address: '7321 NW 61st Street, Miami, FL 33166',
      phone: '+1-754-267-3047',
      email: 'millionwoodusa@gmail.com',
      logoPath: '/logos/logo%20png.png',
      updatedAt: new Date().toISOString(),
    };
  },

  async updateSettings(settings: Partial<Omit<CompanySettings, 'id' | 'updatedAt'>>): Promise<void> {
    const updatedAt = new Date().toISOString();
    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        UPDATE mw_settings 
        SET 
          company_name = COALESCE(${settings.companyName}, company_name),
          subtitle = COALESCE(${settings.subtitle}, subtitle),
          address = COALESCE(${settings.address}, address),
          phone = COALESCE(${settings.phone}, phone),
          email = COALESCE(${settings.email}, email),
          logo_path = COALESCE(${settings.logoPath}, logo_path),
          updated_at = ${updatedAt}
        WHERE id = 'main'
      `;
      return;
    }

    const data = await getLocalData();
    data.settings = {
      ...(data.settings || {
        id: 'main',
        companyName: 'MILLION WOOD',
        subtitle: 'Custom Cabinets and Wood Works',
        address: '7321 NW 61st Street, Miami, FL 33166',
        phone: '+1-754-267-3047',
        email: 'millionwoodusa@gmail.com',
        logoPath: '/logos/logo%20png.png',
      }),
      ...settings,
      updatedAt,
    } as CompanySettings;
    await saveLocalData(data);
  },

  // --- CLIENTS ---
  async getClients(): Promise<Client[]> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`SELECT id, name, email, phone, address, tax_id as "taxId", created_at as "createdAt" FROM mw_clients ORDER BY name ASC`;
      return rows;
    }
    const data = await getLocalData();
    return [...data.clients].sort((a, b) => a.name.localeCompare(b.name));
  },

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newClient: Client = { ...client, id, createdAt };

    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        INSERT INTO mw_clients (id, name, email, phone, address, tax_id, created_at)
        VALUES (${id}, ${client.name}, ${client.email}, ${client.phone}, ${client.address}, ${client.taxId}, ${createdAt})
      `;
      return newClient;
    }

    const data = await getLocalData();
    data.clients.push(newClient);
    await saveLocalData(data);
    return newClient;
  },

  async updateClient(id: string, client: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        UPDATE mw_clients 
        SET 
          name = COALESCE(${client.name}, name),
          email = COALESCE(${client.email}, email),
          phone = COALESCE(${client.phone}, phone),
          address = COALESCE(${client.address}, address),
          tax_id = COALESCE(${client.taxId}, tax_id)
        WHERE id = ${id}
      `;
      return;
    }

    const data = await getLocalData();
    const idx = data.clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.clients[idx] = { 
        ...data.clients[idx], 
        ...client,
      } as Client;
      await saveLocalData(data);
    }
  },

  async deleteClient(id: string): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`DELETE FROM mw_clients WHERE id = ${id}`;
      return;
    }

    const data = await getLocalData();
    data.clients = data.clients.filter(c => c.id !== id);
    await saveLocalData(data);
  },

  // --- INVOICES ---
  async getInvoices(): Promise<Invoice[]> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`
        SELECT 
          id, invoice_number as "invoiceNumber", client_id as "clientId", client_name as "clientName",
          date, due_date as "dueDate", status, items, 
          subtotal::float, tax::float, total::float, COALESCE(anticipo, 0)::float as anticipo, notes, created_at as "createdAt"
        FROM mw_invoices 
        ORDER BY date DESC, created_at DESC
      `;
      return rows;
    }
    const data = await getLocalData();
    return [...data.invoices].sort((a, b) => b.date.localeCompare(a.date));
  },

  async createInvoice(invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Promise<Invoice> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    // Generate Invoice Number based on highest existing number, starting at 100
    const invoices = await this.getInvoices();
    const existingNumbers = invoices
      .map(i => parseInt(i.invoiceNumber, 10))
      .filter(n => !isNaN(n));
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 99;
    const invoiceNumber = String(Math.max(100, maxNum + 1));

    const newInvoice: Invoice = { ...invoice, id, invoiceNumber, createdAt };

    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        INSERT INTO mw_invoices (id, invoice_number, client_id, client_name, date, due_date, status, items, subtotal, tax, total, anticipo, notes, created_at)
        VALUES (
          ${id}, ${invoiceNumber}, ${invoice.clientId}, ${invoice.clientName}, 
          ${invoice.date}, ${invoice.dueDate}, ${invoice.status}, 
          ${JSON.stringify(invoice.items)}, ${invoice.subtotal}, ${invoice.tax}, ${invoice.total}, 
          ${invoice.anticipo || 0},
          ${invoice.notes || null}, ${createdAt}
        )
      `;
      // Auto-create accounting entry for Income
      if (invoice.status === 'paid') {
        await this.createAccountingEntry({
          date: invoice.date,
          description: `Cobro Factura ${invoiceNumber} - ${invoice.clientName}`,
          type: 'income',
          amount: invoice.total,
          category: 'Ventas',
          referenceId: id,
        });
      }
      return newInvoice;
    }

    const data = await getLocalData();
    data.invoices.push(newInvoice);
    await saveLocalData(data);

    // Auto-create accounting entry for Income in local file
    if (invoice.status === 'paid') {
      await this.createAccountingEntry({
        date: invoice.date,
        description: `Cobro Factura ${invoiceNumber} - ${invoice.clientName}`,
        type: 'income',
        amount: invoice.total,
        category: 'Ventas',
        referenceId: id,
      });
    }

    return newInvoice;
  },

  async updateInvoiceStatus(id: string, status: 'pending' | 'paid' | 'cancelled'): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`UPDATE mw_invoices SET status = ${status} WHERE id = ${id}`;
      // Handle accounting sync if status is changed to paid
      if (status === 'paid') {
        const rows = await pg`SELECT invoice_number, client_name, date, total FROM mw_invoices WHERE id = ${id}`;
        if (rows[0]) {
          await this.createAccountingEntry({
            date: rows[0].date,
            description: `Cobro Factura ${rows[0].invoice_number} - ${rows[0].client_name}`,
            type: 'income',
            amount: Number(rows[0].total),
            category: 'Ventas',
            referenceId: id,
          });
        }
      }
      return;
    }

    const data = await getLocalData();
    const invoiceIndex = data.invoices.findIndex(inv => inv.id === id);
    if (invoiceIndex !== -1) {
      data.invoices[invoiceIndex].status = status;
      await saveLocalData(data);

      if (status === 'paid') {
        const invoice = data.invoices[invoiceIndex];
        await this.createAccountingEntry({
          date: invoice.date,
          description: `Cobro Factura ${invoice.invoiceNumber} - ${invoice.clientName}`,
          type: 'income',
          amount: invoice.total,
          category: 'Ventas',
          referenceId: id,
        });
      }
    }
  },

  async updateInvoice(id: string, invoice: Partial<Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>>): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        UPDATE mw_invoices 
        SET 
          client_id = ${invoice.clientId},
          client_name = ${invoice.clientName},
          date = ${invoice.date},
          due_date = ${invoice.dueDate},
          items = ${JSON.stringify(invoice.items)},
          subtotal = ${invoice.subtotal},
          tax = ${invoice.tax},
          total = ${invoice.total},
          anticipo = ${invoice.anticipo ?? 0},
          notes = ${invoice.notes || null}
        WHERE id = ${id}
      `;
      return;
    }

    const data = await getLocalData();
    const idx = data.invoices.findIndex(inv => inv.id === id);
    if (idx !== -1) {
      data.invoices[idx] = { 
        ...data.invoices[idx], 
        ...invoice,
      } as Invoice;
      await saveLocalData(data);
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`DELETE FROM mw_invoices WHERE id = ${id}`;
      await pg`DELETE FROM mw_accounting_entries WHERE reference_id = ${id}`;
      return;
    }

    const data = await getLocalData();
    data.invoices = data.invoices.filter(inv => inv.id !== id);
    data.accountingEntries = data.accountingEntries.filter(e => e.referenceId !== id);
    await saveLocalData(data);
  },

  // --- QUOTES ---
  async getQuotes(): Promise<Quote[]> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`
        SELECT 
          id, quote_number as "quoteNumber", client_id as "clientId", client_name as "clientName",
          date, due_date as "dueDate", status, items, 
          subtotal::float, tax::float, total::float, COALESCE(anticipo, 0)::float as anticipo,
          COALESCE(is_options_list, false) as "isOptionsList",
          notes, created_at as "createdAt"
        FROM mw_quotes 
        ORDER BY date DESC, created_at DESC
      `;
      return rows;
    }
    const data = await getLocalData();
    return [...data.quotes].sort((a, b) => b.date.localeCompare(a.date));
  },

  async createQuote(quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>): Promise<Quote> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    // Generate Quote Number based on highest existing number, starting at 173
    const quotes = await this.getQuotes();
    const existingNumbers = quotes
      .map(q => parseInt(q.quoteNumber, 10))
      .filter(n => !isNaN(n));
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 172;
    const quoteNumber = String(Math.max(173, maxNum + 1));

    const newQuote: Quote = { ...quote, id, quoteNumber, createdAt };

    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        INSERT INTO mw_quotes (id, quote_number, client_id, client_name, date, due_date, status, items, subtotal, tax, total, anticipo, is_options_list, notes, created_at)
        VALUES (
          ${id}, ${quoteNumber}, ${quote.clientId}, ${quote.clientName}, 
          ${quote.date}, ${quote.dueDate}, ${quote.status}, 
          ${JSON.stringify(quote.items)}, ${quote.subtotal}, ${quote.tax}, ${quote.total}, 
          ${quote.anticipo || 0}, ${quote.isOptionsList || false},
          ${quote.notes || null}, ${createdAt}
        )
      `;
      return newQuote;
    }

    const data = await getLocalData();
    data.quotes.push(newQuote);
    await saveLocalData(data);
    return newQuote;
  },

  async updateQuoteStatus(id: string, status: 'pending' | 'accepted' | 'declined'): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`UPDATE mw_quotes SET status = ${status} WHERE id = ${id}`;
      return;
    }

    const data = await getLocalData();
    const quoteIndex = data.quotes.findIndex(q => q.id === id);
    if (quoteIndex !== -1) {
      data.quotes[quoteIndex].status = status;
      await saveLocalData(data);
    }
  },

  async updateQuote(id: string, quote: Partial<Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>>): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        UPDATE mw_quotes 
        SET 
          client_id = ${quote.clientId},
          client_name = ${quote.clientName},
          date = ${quote.date},
          due_date = ${quote.dueDate},
          items = ${JSON.stringify(quote.items)},
          subtotal = ${quote.subtotal},
          tax = ${quote.tax},
          total = ${quote.total},
          anticipo = ${quote.anticipo ?? 0},
          is_options_list = ${quote.isOptionsList ?? false},
          notes = ${quote.notes || null}
        WHERE id = ${id}
      `;
      return;
    }

    const data = await getLocalData();
    const idx = data.quotes.findIndex(q => q.id === id);
    if (idx !== -1) {
      data.quotes[idx] = { 
        ...data.quotes[idx], 
        ...quote,
      } as Quote;
      await saveLocalData(data);
    }
  },

  async deleteQuote(id: string): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`DELETE FROM mw_quotes WHERE id = ${id}`;
      return;
    }

    const data = await getLocalData();
    data.quotes = data.quotes.filter(q => q.id !== id);
    await saveLocalData(data);
  },

  async convertQuoteToInvoice(quoteId: string): Promise<Invoice> {
    // 1. Fetch Quote
    const quotes = await this.getQuotes();
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) {
      throw new Error('Cotización no encontrada.');
    }

    // 2. Create Invoice (uses unified numbering via createInvoice)
    const invoice = await this.createInvoice({
      clientId: quote.clientId,
      clientName: quote.clientName,
      date: new Date().toISOString().split('T')[0],
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 15);
        return d.toISOString().split('T')[0];
      })(),
      status: 'pending',
      items: quote.items,
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      anticipo: quote.anticipo || 0,
      notes: `Convertida de Cotización ${quote.quoteNumber}. ${quote.notes || ''}`,
    });

    // 3. Mark Quote as Accepted
    await this.updateQuoteStatus(quoteId, 'accepted');

    return invoice;
  },

  // --- PURCHASE ORDERS ---
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`
        SELECT 
          id, po_number as "poNumber", vendor_name as "vendorName",
          date, status, items, total::float, notes, created_at as "createdAt"
        FROM mw_purchase_orders 
        ORDER BY date DESC, created_at DESC
      `;
      return rows;
    }
    const data = await getLocalData();
    return [...data.purchaseOrders].sort((a, b) => b.date.localeCompare(a.date));
  },

  async createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Generate PO Number
    const pos = await this.getPurchaseOrders();
    const year = new Date().getFullYear();
    const nextNumber = String(pos.length + 1).padStart(4, '0');
    const poNumber = `PO-${year}-${nextNumber}`;

    const newPO: PurchaseOrder = { ...po, id, poNumber, createdAt };

    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        INSERT INTO mw_purchase_orders (id, po_number, vendor_name, date, status, items, total, notes, created_at)
        VALUES (
          ${id}, ${poNumber}, ${po.vendorName}, ${po.date}, ${po.status}, 
          ${JSON.stringify(po.items)}, ${po.total}, ${po.notes || null}, ${createdAt}
        )
      `;
      // Auto-create accounting entry for Expense if received
      if (po.status === 'received') {
        await this.createAccountingEntry({
          date: po.date,
          description: `Compra Proveedor ${poNumber} - ${po.vendorName}`,
          type: 'expense',
          amount: po.total,
          category: 'Materiales y Compras',
          referenceId: id,
        });
      }
      return newPO;
    }

    const data = await getLocalData();
    data.purchaseOrders.push(newPO);
    await saveLocalData(data);

    // Auto-create accounting entry for Expense if received
    if (po.status === 'received') {
      await this.createAccountingEntry({
        date: po.date,
        description: `Compra Proveedor ${poNumber} - ${po.vendorName}`,
        type: 'expense',
        amount: po.total,
        category: 'Materiales y Compras',
        referenceId: id,
      });
    }

    return newPO;
  },

  async updatePOStatus(id: string, status: 'pending' | 'approved' | 'received' | 'cancelled'): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`UPDATE mw_purchase_orders SET status = ${status} WHERE id = ${id}`;
      if (status === 'received') {
        const rows = await pg`SELECT po_number, vendor_name, date, total FROM mw_purchase_orders WHERE id = ${id}`;
        if (rows[0]) {
          await this.createAccountingEntry({
            date: rows[0].date,
            description: `Compra Proveedor ${rows[0].po_number} - ${rows[0].vendor_name}`,
            type: 'expense',
            amount: Number(rows[0].total),
            category: 'Materiales y Compras',
            referenceId: id,
          });
        }
      }
      return;
    }

    const data = await getLocalData();
    const poIndex = data.purchaseOrders.findIndex(po => po.id === id);
    if (poIndex !== -1) {
      data.purchaseOrders[poIndex].status = status;
      await saveLocalData(data);

      if (status === 'received') {
        const po = data.purchaseOrders[poIndex];
        await this.createAccountingEntry({
          date: po.date,
          description: `Compra Proveedor ${po.poNumber} - ${po.vendorName}`,
          type: 'expense',
          amount: po.total,
          category: 'Materiales y Compras',
          referenceId: id,
        });
      }
    }
  },

  async updatePurchaseOrder(id: string, po: Partial<Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>>): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        UPDATE mw_purchase_orders 
        SET 
          vendor_name = COALESCE(${po.vendorName}, vendor_name),
          date = COALESCE(${po.date}, date),
          items = COALESCE(${po.items ? JSON.stringify(po.items) : null}, items),
          total = COALESCE(${po.total}, total),
          notes = COALESCE(${po.notes}, notes)
        WHERE id = ${id}
      `;
      return;
    }

    const data = await getLocalData();
    const idx = data.purchaseOrders.findIndex(p => p.id === id);
    if (idx !== -1) {
      data.purchaseOrders[idx] = { 
        ...data.purchaseOrders[idx], 
        ...po,
      } as PurchaseOrder;
      await saveLocalData(data);
    }
  },

  async deletePurchaseOrder(id: string): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`DELETE FROM mw_purchase_orders WHERE id = ${id}`;
      // Note: we don't automatically delete the accounting entry for 'received' POs here 
      // to keep it simple, or we could if reference_id is linked.
      await pg`DELETE FROM mw_accounting_entries WHERE reference_id = ${id}`;
      return;
    }

    const data = await getLocalData();
    data.purchaseOrders = data.purchaseOrders.filter(p => p.id !== id);
    data.accountingEntries = data.accountingEntries.filter(e => e.referenceId !== id);
    await saveLocalData(data);
  },

  // --- ACCOUNTING ENTRIES ---
  async getAccountingEntries(): Promise<AccountingEntry[]> {
    const pg = await getPostgresClient();
    if (pg) {
      const rows = await pg`
        SELECT 
          id, date, description, type, amount::float, category, 
          reference_id as "referenceId", created_at as "createdAt"
        FROM mw_accounting_entries 
        ORDER BY date DESC, created_at DESC
      `;
      return rows;
    }
    const data = await getLocalData();
    return [...data.accountingEntries].sort((a, b) => b.date.localeCompare(a.date));
  },

  async createAccountingEntry(entry: Omit<AccountingEntry, 'id' | 'createdAt'>): Promise<AccountingEntry> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newEntry: AccountingEntry = { ...entry, id, createdAt };

    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        INSERT INTO mw_accounting_entries (id, date, description, type, amount, category, reference_id, created_at)
        VALUES (${id}, ${entry.date}, ${entry.description}, ${entry.type}, ${entry.amount}, ${entry.category}, ${entry.referenceId || null}, ${createdAt})
      `;
      return newEntry;
    }

    const data = await getLocalData();
    data.accountingEntries.push(newEntry);
    await saveLocalData(data);
    return newEntry;
  },

  async deleteAccountingEntry(id: string): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`DELETE FROM mw_accounting_entries WHERE id = ${id}`;
      return;
    }

    const data = await getLocalData();
    data.accountingEntries = data.accountingEntries.filter(e => e.id !== id);
    await saveLocalData(data);
  },

  async updateAccountingEntry(id: string, entry: Partial<Omit<AccountingEntry, 'id' | 'createdAt'>>): Promise<void> {
    const pg = await getPostgresClient();
    if (pg) {
      await pg`
        UPDATE mw_accounting_entries 
        SET 
          date = COALESCE(${entry.date}, date),
          description = COALESCE(${entry.description}, description),
          type = COALESCE(${entry.type}, type),
          amount = COALESCE(${entry.amount}, amount),
          category = COALESCE(${entry.category}, category)
        WHERE id = ${id}
      `;
      return;
    }

    const data = await getLocalData();
    const idx = data.accountingEntries.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.accountingEntries[idx] = { 
        ...data.accountingEntries[idx], 
        ...entry,
      } as AccountingEntry;
      await saveLocalData(data);
    }
  }
};
