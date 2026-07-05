import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Acceso Administrativo | Million Wood',
  description: 'Portal de administración interna.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-matte-black p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1c1c1c_0%,_#080808_100%)] opacity-80 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-charcoal bg-deep-charcoal p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          {/* Logo Placeholder or Text */}
          <h1 className="text-3xl font-bold tracking-tight text-gradient-gold">
            MILLION WOOD
          </h1>
          <p className="mt-2 text-sm text-light-gray/60">
            Plataforma Contable y Control Interno
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
