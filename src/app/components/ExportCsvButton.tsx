'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface ExportCsvButtonProps {
  data: any[];
  filename: string;
  columns: { header: string; key: string | ((row: any) => string) }[];
}

export default function ExportCsvButton({ data, filename, columns }: ExportCsvButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // 1. Generate Headers
      const headers = columns.map(col => `"${col.header.replace(/"/g, '""')}"`).join(',');
      
      // 2. Generate Rows
      const rows = data.map(row => {
        return columns.map(col => {
          let value = '';
          if (typeof col.key === 'function') {
            value = col.key(row);
          } else {
            value = row[col.key] || '';
          }
          // Escape quotes
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        }).join(',');
      });

      // 3. Combine
      const csvContent = [headers, ...rows].join('\n');
      
      // 4. Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Hubo un error al exportar los datos.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || data.length === 0}
      className="inline-flex items-center px-4 py-2 bg-charcoal hover:bg-charcoal/80 text-light-gray text-sm font-semibold rounded-lg border border-light-gray/20 transition disabled:opacity-50"
      title="Exportar a CSV (Excel)"
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? 'Exportando...' : 'Exportar CSV'}
    </button>
  );
}
