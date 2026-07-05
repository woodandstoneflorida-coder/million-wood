/**
 * Client-side helper to export arrays of data to UTF-8 CSV with BOM for proper Excel encoding.
 */
export function exportToCSV(headers: string[], rows: (string | number)[][], filename: string) {
  const content = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => 
      row.map(cell => {
        const strVal = cell === null || cell === undefined ? '' : String(cell);
        // Normalize line breaks and escape double quotes
        return `"${strVal.replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\r\n');

  // UTF-8 BOM to ensure Excel opens Spanish characters correctly
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
