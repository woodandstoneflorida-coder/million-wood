'use client';

import React, { useState } from 'react';
import { CompanySettings } from '@/lib/db';
import { updateSettingsAction } from '@/app/actions/settings';

export default function SettingsForm({ 
  initialSettings,
  isAdmin = false
}: { 
  initialSettings: CompanySettings;
  isAdmin?: boolean;
}) {
  const [companyName, setCompanyName] = useState(initialSettings.companyName);
  const [subtitle, setSubtitle] = useState(initialSettings.subtitle);
  const [address, setAddress] = useState(initialSettings.address);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [email, setEmail] = useState(initialSettings.email);
  const [logoPath, setLogoPath] = useState(initialSettings.logoPath);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await updateSettingsAction({
      companyName,
      subtitle,
      address,
      phone,
      email,
      logoPath,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const logos = [
    { name: 'Logo estándar (Negro/Color)', path: '/logos/logo%20png.png' },
    { name: 'Logo redondo negro', path: '/logos/logo%20negro%20redondo%20%20png.png' },
    { name: 'Solo logo blanco', path: '/logos/solo%20logo%20blanco.png' },
    { name: 'Solo letra blanca', path: '/logos/solo%20letra%20blanca.png' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20">
          Configuración guardada exitosamente. Los documentos PDF generados a partir de ahora usarán estos datos.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">Nombre Comercial / Razón Social</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border border-charcoal bg-matte-black p-3 text-foreground placeholder-light-gray/30 focus:border-foreground focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">Subtítulo de Empresa (debajo del logo)</label>
          <input
            type="text"
            required
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-charcoal bg-matte-black p-3 text-foreground placeholder-light-gray/30 focus:border-foreground focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">Teléfono de Contacto</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-charcoal bg-matte-black p-3 text-foreground placeholder-light-gray/30 focus:border-foreground focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">Correo Electrónico del PDF</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-charcoal bg-matte-black p-3 text-foreground placeholder-light-gray/30 focus:border-foreground focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-light-gray mb-2">Dirección Física Completa</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-charcoal bg-matte-black p-3 text-foreground placeholder-light-gray/30 focus:border-foreground focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-light-gray mb-2">Logo del Documento</label>
          <div className="grid gap-4 md:grid-cols-2 items-center">
            <select
              value={logoPath}
              onChange={(e) => setLogoPath(e.target.value)}
              className="w-full rounded-lg border border-charcoal bg-matte-black p-3 text-foreground focus:border-foreground focus:outline-none"
            >
              {logos.map((logo) => (
                <option key={logo.path} value={logo.path}>
                  {logo.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-matte-black border border-charcoal justify-center h-20">
              <span className="text-xs text-light-gray/40 mr-2">Vista previa logo:</span>
              <img
                src={logoPath.replace(/%20/g, ' ')}
                alt="Logo Vista Previa"
                className="max-h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logos/logo%20png.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-foreground px-6 py-3 font-semibold text-background hover:bg-light-gray transition duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {isAdmin && (
        <div className="border-t border-charcoal pt-6 mt-6">
          <h4 className="text-sm font-semibold text-foreground mb-1">Copia de Seguridad (Backup)</h4>
          <p className="text-xs text-light-gray/50 mb-4">
            Descargue una copia de seguridad en formato JSON que contiene todos los clientes, cotizaciones, facturas, compras y movimientos contables registrados en la plataforma.
          </p>
          <a
            href="/api/backup"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-charcoal bg-matte-black px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-charcoal transition duration-200 cursor-pointer shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Respaldo (.json)
          </a>
        </div>
      )}
    </form>
  );
}
