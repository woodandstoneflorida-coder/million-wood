'use client';

import React from 'react';
import { exportToCSV } from '@/lib/export-csv';
import { Download } from 'lucide-react';

interface ExportCSVButtonProps {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  buttonText?: string;
  className?: string;
}

export default function ExportCSVButton({
  headers,
  rows,
  filename,
  buttonText = 'Exportar CSV',
  className = '',
}: ExportCSVButtonProps) {
  const handleExport = () => {
    exportToCSV(headers, rows, filename);
  };

  return (
    <button
      onClick={handleExport}
      type="button"
      className={`inline-flex items-center gap-2 rounded-lg border border-charcoal bg-matte-black px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-charcoal transition duration-200 cursor-pointer shadow ${className}`}
    >
      <Download className="h-4 w-4" />
      <span>{buttonText}</span>
    </button>
  );
}
