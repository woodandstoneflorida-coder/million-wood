import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Missing ID parameter', { status: 400 });
    }

    const quotes = await db.getQuotes();
    const quote = quotes.find(q => q.id === id);

    if (!quote) {
      return new Response('Quote not found', { status: 404 });
    }

    const clients = await db.getClients();
    const client = clients.find(c => c.id === quote.clientId);
    const settings = await db.getSettings();

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}/${year}`;
    };

    const taxRate = Math.round((quote.tax / (quote.subtotal || 1)) * 100);
    const discount = Math.max(0, quote.subtotal + quote.tax - quote.total);

    // HTML Template
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${quote.quoteNumber} ${quote.clientName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 40px;
      line-height: 1.4;
    }
    .print-btn-container {
      margin-bottom: 30px;
      text-align: right;
    }
    .print-btn {
      background-color: #BF953F;
      color: #000;
      border: none;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .print-btn:hover {
      background-color: #d4af37;
    }
    .quote-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #ddd;
      padding: 40px;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-logo {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #000;
    }
    .company-info {
      font-size: 12px;
      color: #555;
      text-align: right;
    }
    .quote-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .bill-to h3, .quote-info h3 {
      margin-top: 0;
      font-size: 13px;
      text-transform: uppercase;
      color: #777;
      margin-bottom: 8px;
    }
    .bill-to p, .quote-info p {
      margin: 4px 0;
      font-size: 14px;
    }
    .quote-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    .quote-table th {
      background-color: #f5f5f5;
      border-bottom: 2px solid #ddd;
      padding: 12px;
      font-size: 12px;
      text-transform: uppercase;
      text-align: left;
    }
    .quote-table td {
      border-bottom: 1px solid #eee;
      padding: 12px;
      font-size: 14px;
    }
    .text-right {
      text-align: right !important;
    }
    .summary-section {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .notes-box {
      width: 55%;
      font-size: 12px;
      color: #666;
    }
    .notes-box h4 {
      margin: 0 0 5px 0;
      text-transform: uppercase;
      color: #333;
    }
    .totals-box {
      width: 35%;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
    }
    .totals-row.grand-total {
      border-top: 2px solid #333;
      font-weight: bold;
      font-size: 16px;
      padding-top: 10px;
    }
    
    @page {
      margin: 0;
    }
    @media print {
      .print-btn-container {
        display: none;
      }
      /* Remove body padding reset so it keeps the 40px from outside */
      .quote-container {
        border: none;
        padding: 0;
      }
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 420px;
      height: auto;
      opacity: 0.045;
      z-index: 0;
      pointer-events: none;
    }
  </style>
</head>
<body>

  <div class="print-btn-container">
    <button class="print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
  </div>

  <div class="quote-container" style="position: relative;">
    <img src="${settings.logoPath}" class="watermark" alt="Watermark" />

    <div class="header" style="position: relative; z-index: 1;">
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="${settings.logoPath}" alt="Logo" style="height: 55px; width: auto;" />
        <div>
          <div class="company-logo">${settings.companyName}</div>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #666;">${settings.subtitle}</p>
        </div>
      </div>
      <div class="company-info">
        <p style="font-weight: bold; margin: 0 0 5px 0; font-size: 14px;">${settings.companyName}</p>
        <p>${settings.address}</p>
        <p>Tel: ${settings.phone}</p>
        <p>Email: ${settings.email}</p>
      </div>
    </div>

    <div class="quote-details" style="position: relative; z-index: 1;">
      <div class="bill-to">
        <h3>Preparado Para:</h3>
        <p style="font-weight: bold; font-size: 16px;">${quote.clientName}</p>
        ${client?.address ? `<p>${client.address}</p>` : ''}
        ${client?.phone ? `<p>Tel: ${client.phone}</p>` : ''}
        ${client?.email ? `<p>Email: ${client.email}</p>` : ''}
        ${client?.taxId ? `<p>ID Fiscal: ${client.taxId}</p>` : ''}
      </div>
      <div class="quote-info" style="text-align: right;">
        <h2 style="margin: 0 0 10px 0; font-size: 22px; color: #000; letter-spacing: 0.5px;">COTIZACIÓN</h2>
        <p><strong>Nro Cotización:</strong> ${quote.quoteNumber}</p>
        <p><strong>Fecha Emisión:</strong> ${formatDate(quote.date)}</p>
        <p><strong>Válido Hasta:</strong> ${formatDate(quote.dueDate)}</p>
        <p><strong>Estado:</strong> <span style="font-weight: bold; color: ${quote.status === 'accepted' ? 'green' : quote.status === 'pending' ? 'orange' : 'red'}">${quote.status.toUpperCase()}</span></p>
      </div>
    </div>

    <table class="quote-table" style="position: relative; z-index: 1;">
      <thead>
        <tr>
          <th>Descripción</th>
          <th class="text-right" style="width: 100px;">Cant.</th>
          <th class="text-right" style="width: 150px;">Precio Unit.</th>
          ${!quote.isOptionsList ? '<th class="text-right" style="width: 150px;">Total</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${quote.items.map(item => `
          <tr>
            <td>${item.description}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${formatCurrency(item.price)}</td>
            ${!quote.isOptionsList ? `<td class="text-right">${formatCurrency(item.quantity * item.price)}</td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="summary-section" style="position: relative; z-index: 1;">
      <div class="notes-box">
        ${quote.notes ? `
          <h4>Notas y Plazos:</h4>
          <p>${quote.notes.replace(/\n/g, '<br>')}</p>
        ` : ''}
      </div>
      ${!quote.isOptionsList ? `
      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(quote.subtotal)}</span>
        </div>
        ${discount > 0.01 ? `
        <div class="totals-row" style="color: #d32f2f;">
          <span>Descuento:</span>
          <span>-${formatCurrency(discount)}</span>
        </div>
        ` : ''}
        <div class="totals-row">
          <span>Sales Tax (${taxRate}%):</span>
          <span>${formatCurrency(quote.tax)}</span>
        </div>
        <div class="totals-row grand-total">
          <span>Total Estimado:</span>
          <span>${formatCurrency(quote.total)}</span>
        </div>
        ${(quote.anticipo || 0) > 0 ? `
        <div class="totals-row" style="color: #2e7d32;">
          <span>Anticipo:</span>
          <span>-${formatCurrency(quote.anticipo || 0)}</span>
        </div>
        <div class="totals-row grand-total" style="border-top: 2px solid #BF953F; color: #BF953F;">
          <span>Saldo Pendiente:</span>
          <span>${formatCurrency(Math.max(0, quote.total - (quote.anticipo || 0)))}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}
    </div>
  </div>

</body>
</html>
    `;

    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating PDF view for quote:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
