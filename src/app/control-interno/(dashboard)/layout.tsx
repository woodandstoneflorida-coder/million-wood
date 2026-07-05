import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decryptSession } from '@/lib/auth-session';
import { logoutAction } from '@/app/actions/auth';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList,
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  LogOut,
  User,
  Settings
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('mw_session')?.value;
  const session = sessionToken ? await decryptSession(sessionToken) : null;

  if (session && session.username === 'admin') {
    session.role = 'admin';
  }

  if (!session) {
    redirect('/control-interno');
  }

  const menuItems = [
    { name: 'Resumen', href: '/control-interno/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/control-interno/clients', icon: Users },
    { name: 'Cotizaciones / Quotes', href: '/control-interno/quotes', icon: ClipboardList },
    { name: 'Facturas / Invoices', href: '/control-interno/invoices', icon: FileText },
    { name: 'Órdenes de Compra', href: '/control-interno/purchase-orders', icon: ShoppingBag },
    { name: 'Contabilidad', href: '/control-interno/accounting', icon: TrendingUp },
    { name: 'Configuración', href: '/control-interno/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-matte-black text-foreground">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-charcoal bg-deep-charcoal md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-charcoal px-6">
          <Link href="/control-interno/dashboard" className="text-xl font-bold tracking-wider text-foreground">
            MILLION WOOD
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium text-light-gray/70 hover:bg-charcoal hover:text-foreground transition duration-200"
              >
                <Icon className="h-5 w-5 text-foreground/80" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="border-t border-charcoal p-4 bg-matte-black/40">
          <div className="flex items-center space-x-3 px-2 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal border border-charcoal">
              <User className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">{session.name}</p>
              <p className="truncate text-[10px] text-light-gray/50">
                @{session.username} ({session.role === 'admin' ? 'Administrador' : 'Editor'})
              </p>
            </div>
          </div>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition duration-200 cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Header Mobile / Info bar */}
        <header className="flex h-16 items-center justify-between border-b border-charcoal bg-deep-charcoal px-6 md:justify-end">
          <div className="md:hidden">
            <Link href="/control-interno/dashboard" className="text-lg font-bold tracking-wider text-foreground">
              MILLION WOOD
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile session indicators */}
            <div className="flex items-center space-x-2 text-xs text-light-gray/60 md:hidden">
              <span>{session.name}</span>
              <form action={logoutAction}>
                <button type="submit" className="p-1 text-red-400 hover:text-red-300">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="hidden items-center space-x-2 text-sm text-light-gray/60 md:flex">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Conexión Segura</span>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <nav className="flex justify-around border-b border-charcoal bg-deep-charcoal/70 py-2 md:hidden px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                className="flex flex-col items-center justify-center p-2 text-xs text-light-gray/60 hover:text-foreground transition"
              >
                <Icon className="h-5 w-5 text-foreground/80 mb-0.5" />
              </Link>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
