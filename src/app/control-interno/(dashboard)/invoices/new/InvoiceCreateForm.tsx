'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Client, Invoice, InvoiceItem } from '@/lib/db';
import { createInvoiceAction, updateInvoiceStatusAction, updateInvoiceAction } from '@/app/actions/invoices';
import { 
  Plus, 
  Trash, 
  FileDown, 
  Printer, 
  Mail, 
  MessageSquare, 
  CheckSquare, 
  Save, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface InvoiceCreateFormProps {
  clients: Client[];
  initialInvoice?: Invoice;
  nextInvoiceNumber?: string;
}

export default function InvoiceCreateForm({ clients, initialInvoice, nextInvoiceNumber }: InvoiceCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const formRef = React.useRef<HTMLFormElement>(null);

  const [invoiceId, setInvoiceId] = useState(initialInvoice?.id || null);
  const [isSaved, setIsSaved] = useState(!!initialInvoice);
  const isEditMode = !!initialInvoice || !!invoiceId;
  const invoiceNumber = initialInvoice?.invoiceNumber || nextInvoiceNumber || 'NEW';

  // Client Data Fields (Auto-filled by dropdown or manual edit)
  const [selectedClientId, setSelectedClientId] = useState(initialInvoice?.clientId || '');
  const [clientName, setClientName] = useState(initialInvoice?.clientName || '');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState(initialInvoice?.notes?.split('Proyecto: ')[1]?.split('\n')[0] || '');

  // Dates
  const [date, setDate] = useState(initialInvoice?.date || '');
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate || '');

  useEffect(() => {
    if (!initialInvoice) {
      const d = new Date();
      setDate(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 15);
      setDueDate(d.toISOString().split('T')[0]);
    }
  }, [initialInvoice]);

  const [status, setStatus] = useState<'pending' | 'paid' | 'cancelled'>(initialInvoice?.status || 'pending');
  const [notes, setNotes] = useState(() => {
    if (initialInvoice?.notes) {
      // Remove "Proyecto: ..." prefix if present to keep it clean
      return initialInvoice.notes.replace(/Proyecto:.*?\n/, '');
    }
    return '';
  });

  // Dynamic Items
  const [items, setItems] = useState<InvoiceItem[]>(initialInvoice?.items || [
    { description: '', quantity: 1, price: 0 }
  ]);

  // Tax and Discount (Editable totals)
  const [taxRate, setTaxRate] = useState<number | ''>(() => {
    if (initialInvoice) {
      return Math.round((initialInvoice.tax / (initialInvoice.subtotal || 1)) * 100);
    }
    return 7; // Default 7% FL Sales Tax
  });
  const [discount, setDiscount] = useState<number | ''>(0);
  const [anticipo, setAnticipo] = useState<number | ''>(initialInvoice?.anticipo || '');

  // Auto-fetch client metadata when selectedClientId matches
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        setClientName(client.name);
        setClientAddress(client.address || '');
        setClientPhone(client.phone || '');
        setClientEmail(client.email || '');
      }
    }
  }, [selectedClientId, clients]);

  // Totals Calculations
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)), 0);
  const tax = subtotal * ((Number(taxRate) || 0) / 100);
  const total = Math.max(0, subtotal - (Number(discount) || 0) + tax);
  const pendingBalance = Math.max(0, total - (Number(anticipo) || 0));

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    if (field === 'description') {
      updated[index].description = value as string;
    } else {
      updated[index][field] = value === '' ? ('' as any) : Number(value);
    }
    setItems(updated);
  };

  const handleLoadCustomer = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!clientName.trim()) {
      setError('Por favor ingrese el nombre del cliente o cargue uno.');
      return;
    }

    const invalidItems = items.some(item => !item.description.trim() || item.quantity <= 0 || item.price < 0);
    if (invalidItems) {
      setError('Por favor complete todos los campos de los items con valores válidos.');
      return;
    }

    // Attach project title to notes if provided
    const finalNotes = projectTitle ? `Proyecto: ${projectTitle}\n${notes}` : notes;

    startTransition(async () => {
      // If we don't have a database Client matching this name, create a dummy ID
      const clientIdToSave = selectedClientId || 'generic-client';

      let response;
      if (isEditMode && invoiceId) {
        response = await updateInvoiceAction(invoiceId, {
          clientId: clientIdToSave,
          clientName,
          clientAddress,
          clientPhone,
          clientEmail,
          date,
          dueDate,
          items,
          notes: finalNotes,
          subtotal,
          tax,
          total,
          anticipo: Number(anticipo) || 0,
        });
      } else {
        response = await createInvoiceAction({
          clientId: clientIdToSave,
          clientName,
          clientAddress,
          clientPhone,
          clientEmail,
          date,
          dueDate,
          items,
          notes: finalNotes,
          subtotal,
          tax,
          total,
          anticipo: Number(anticipo) || 0,
        });
      }

      if (response.error) {
        setError(response.error);
      } else {
        setSuccessMsg('Factura guardada exitosamente.');
        const res = response as any;
        if (res.invoiceId) {
          setInvoiceId(res.invoiceId);
          setIsSaved(true);
        } else if (invoiceId) {
          setIsSaved(true);
        }
        if (!isEditMode) {
          router.push('/control-interno/invoices');
        }
      }
    });
  };

  // Status Change actions
  const handleMarkPaid = () => {
    if (!invoiceId) return;
    if (confirm('¿Marcar esta factura como PAGADA? Se generará un ingreso en contabilidad.')) {
      startTransition(async () => {
        const result = await updateInvoiceStatusAction(invoiceId, 'paid');
        if (result.success) {
          setStatus('paid');
          setSuccessMsg('Factura cobrada y registrada en libro diario.');
        } else {
          setError(result.error || 'Error al actualizar.');
        }
      });
    }
  };

  // Helper to background save before printing/downloading/sharing
  const ensureSaved = async (): Promise<string | null> => {
    const clientIdToSave = selectedClientId || 'generic-client';
    const finalNotes = projectTitle ? `Proyecto: ${projectTitle}\n${notes}` : notes;
    const subtotalVal = items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)), 0);
    const taxVal = subtotalVal * ((Number(taxRate) || 0) / 100);
    const totalVal = Math.max(0, subtotalVal - (Number(discount) || 0) + taxVal);

    if (invoiceId) {
      await updateInvoiceAction(invoiceId, {
        clientId: clientIdToSave,
        clientName: clientName || 'Cliente Factura',
        clientAddress,
        clientPhone,
        clientEmail,
        date,
        dueDate,
        items,
        notes: finalNotes,
        subtotal: subtotalVal,
        tax: taxVal,
        total: totalVal,
        anticipo: Number(anticipo) || 0,
      });
      return invoiceId;
    }

    const response = await createInvoiceAction({
      clientId: clientIdToSave,
      clientName: clientName || 'Cliente Factura',
      clientAddress,
      clientPhone,
      clientEmail,
      date,
      dueDate,
      items,
      notes: finalNotes,
      subtotal: subtotalVal,
      tax: taxVal,
      total: totalVal,
      anticipo: Number(anticipo) || 0,
    });

    if (response.success && response.invoiceId) {
      setInvoiceId(response.invoiceId);
      setIsSaved(true);
      return response.invoiceId;
    } else {
      setError(response.error || 'Ocurrió un error al guardar automáticamente.');
      return null;
    }
  };

  // Actions Toolbar triggers
  const handleDownloadPDF = async () => {
    const newWindow = window.open('about:blank', '_blank');
    const id = await ensureSaved();
    if (id && newWindow) {
      newWindow.location.href = `/api/invoices/pdf?id=${id}`;
    } else if (newWindow) {
      newWindow.close();
    }
  };

  const handlePrint = async () => {
    const newWindow = window.open('about:blank', '_blank');
    const id = await ensureSaved();
    if (id && newWindow) {
      newWindow.location.href = `/api/invoices/pdf?id=${id}`;
    } else if (newWindow) {
      newWindow.close();
    }
  };

  const handleSendEmail = async () => {
    const id = await ensureSaved();
    if (!id) return;
    const subject = encodeURIComponent(`Factura ${invoiceNumber} - Million Wood`);
    const body = encodeURIComponent(`Hola ${clientName},\n\nTe comparto la factura ${invoiceNumber} de Million Wood por un total de ${formatCurrency(total)}.\n\nPuedes verla e imprimirla en el siguiente enlace:\n${window.location.origin}/api/invoices/pdf?id=${id}\n\nAtentamente,\nMillion Wood USA`);
    window.open(`mailto:${clientEmail || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleSendWhatsApp = async () => {
    const id = await ensureSaved();
    if (!id) return;
    const msg = `Hola *${clientName}*, te comparto la factura *${invoiceNumber}* de *Million Wood* por un total de *${formatCurrency(total)}*. Puedes verla en el siguiente enlace: ${window.location.origin}/api/invoices/pdf?id=${id}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${clientPhone ? clientPhone.replace(/\D/g, '') : ''}?text=${encoded}`, '_blank');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="relative pb-24 space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {successMsg && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          {successMsg}
        </div>
      )}

      {/* PAPER SHEET CARD CONTAINER */}
      <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-2xl border border-charcoal bg-deep-charcoal p-8 shadow-2xl relative">
        {/* Top Section / Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between border-b border-charcoal pb-6 mb-6">
          <div>
            <div className="text-2xl font-bold tracking-wider text-foreground">MILLION WOOD</div>
            <p className="text-[11px] text-light-gray/40 mt-1 leading-relaxed">
              7321 NW 61ST STREET<br />
              MIAMI, FL, 33166<br />
              7542673047
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right space-y-2">
            <div className="inline-flex rounded-lg border border-charcoal bg-matte-black px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-light-gray/70">
              INVOICE
            </div>
            <div className="text-xl font-bold text-foreground">
              N° <span className="text-foreground">{invoiceNumber}</span>
            </div>
          </div>
        </div>

        {/* Client Metadata and Dates columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Client uploader & details */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-light-gray/40">Cliente / Bill To</span>
              <select
                value={selectedClientId}
                onChange={(e) => handleLoadCustomer(e.target.value)}
                disabled={isPending}
                className="rounded bg-matte-black/60 border border-charcoal px-2.5 py-1 text-xs text-foreground outline-none transition focus:border-charcoal/50"
              >
                <option value="">Cargar Cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 bg-matte-black/25 border border-charcoal rounded-xl p-4">
              <input
                type="text"
                placeholder="Nombre del Cliente (Requerido)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none border-b border-transparent focus:border-charcoal pb-1"
              />
              <input
                type="text"
                placeholder="Dirección Comercial"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full bg-transparent text-xs text-light-gray/60 outline-none border-b border-transparent focus:border-charcoal pb-1"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-transparent text-xs text-light-gray/60 outline-none border-b border-transparent focus:border-charcoal pb-1"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-light-gray/60 outline-none border-b border-transparent focus:border-charcoal pb-1"
              />
              <input
                type="text"
                placeholder="Nombre del Proyecto (Ej: Gabinetes Cocina)"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-transparent text-xs text-foreground outline-none border-b border-transparent focus:border-charcoal pt-1.5"
              />
            </div>
          </div>

          {/* Right Column: Dates & Status */}
          <div className="space-y-4">
            <div className="rounded-xl border border-charcoal bg-matte-black/25 p-4 space-y-3.5">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-light-gray/40">Fecha Emisión</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  required
                  className="mt-1 block w-full rounded border border-charcoal bg-matte-black px-2.5 py-1 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-light-gray/40">Vence El</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {}
                  }}
                  required
                  className="mt-1 block w-full rounded border border-charcoal bg-matte-black px-2.5 py-1 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-light-gray/40">Estado</label>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold mt-1.5 ${
                  status === 'paid' 
                    ? 'bg-green-500/10 text-green-400' 
                    : status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {status === 'paid' ? 'PAGADA / COBRADA' : status === 'pending' ? 'PENDIENTE' : 'CANCELADA'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Items Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-light-gray/50">Conceptos de Facturación</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center space-x-1.5 rounded-lg border border-charcoal hover:border-foreground/30 px-3 py-1.5 text-[11px] font-semibold text-foreground transition cursor-pointer"
            >
              <Plus className="h-3 w-3 text-foreground" />
              <span>+ Add Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-charcoal text-[10px] font-semibold uppercase tracking-wider text-light-gray/40">
                  <th className="py-2 w-10">#</th>
                  <th className="py-2">Descripción</th>
                  <th className="py-2 w-20 text-right">Cant.</th>
                  <th className="py-2 w-32 text-right">Precio Unit.</th>
                  <th className="py-2 w-32 text-right">Subtotal</th>
                  <th className="py-2 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/45">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-charcoal/10">
                    <td className="py-3 text-xs font-medium text-light-gray/50">
                      {index + 1}
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Descripción del concepto..."
                        required
                        className="w-full bg-transparent text-xs text-foreground outline-none border-b border-transparent focus:border-charcoal pb-0.5"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-transparent text-xs text-foreground text-right outline-none border-b border-transparent focus:border-charcoal pb-0.5"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-transparent text-xs text-foreground text-right outline-none border-b border-transparent focus:border-charcoal pb-0.5"
                      />
                    </td>
                    <td className="py-3 text-xs font-bold text-foreground text-right whitespace-nowrap">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className="text-red-400/60 hover:text-red-400 disabled:opacity-20 cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes and Totals section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-charcoal mt-8">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-light-gray/40">Notas Adicionales / Condiciones de Pago</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-charcoal bg-matte-black/25 px-3.5 py-2.5 text-xs text-foreground outline-none resize-none"
              placeholder="Términos comerciales, información bancaria, plazos de entrega..."
            />
          </div>

          <div className="rounded-xl border border-charcoal bg-matte-black/15 p-5 space-y-3.5 self-start">
            <div className="flex justify-between text-xs text-light-gray/60">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            
            {/* Discount editable */}
            <div className="flex justify-between items-center text-xs text-light-gray/60">
              <span>Descuento ($):</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                onFocus={(e) => e.target.select()}
                className="w-20 rounded bg-matte-black border border-charcoal px-1.5 py-0.5 text-right text-xs text-red-400 outline-none"
              />
            </div>
            
            {/* Sales Tax editable */}
            <div className="flex justify-between items-center text-xs text-light-gray/60">
              <span className="flex items-center space-x-1">
                <span>Sales Tax (</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
                  onFocus={(e) => e.target.select()}
                  className="w-10 rounded bg-matte-black border border-charcoal px-1 py-0.5 text-center text-xs text-foreground outline-none"
                />
                <span>%):</span>
              </span>
              <span className="font-semibold text-foreground">{formatCurrency(tax)}</span>
            </div>
            
            <div className="flex justify-between border-t border-charcoal pt-3.5 text-base font-bold text-foreground">
              <span>Total:</span>
              <span className="text-foreground">{formatCurrency(total)}</span>
            </div>

            {/* Anticipo editable */}
            <div className="flex justify-between items-center text-xs text-light-gray/60 pt-2">
              <span>Anticipo ($):</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={anticipo}
                onChange={(e) => setAnticipo(e.target.value === '' ? '' : Number(e.target.value))}
                onFocus={(e) => e.target.select()}
                className="w-24 rounded bg-matte-black border border-charcoal px-1.5 py-0.5 text-right text-xs text-green-400 outline-none"
              />
            </div>

            <div className="flex justify-between border-t border-metallic-gold/30 pt-3.5 text-base font-bold">
              <span className="text-metallic-gold">Saldo Pendiente:</span>
              <span className="text-metallic-gold">{formatCurrency(pendingBalance)}</span>
            </div>
          </div>
        </div>

        {/* Signature lines */}
        <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-charcoal/30">
          <div className="text-center">
            <div className="h-10 flex items-end justify-center border-b border-charcoal text-sm text-foreground font-serif tracking-wider">
              Julian Moya
            </div>
            <p className="text-[10px] uppercase font-bold text-light-gray/40 mt-2">Manager</p>
          </div>
          <div className="text-center">
            <div className="h-10 border-b border-charcoal"></div>
            <p className="text-[10px] uppercase font-bold text-light-gray/40 mt-2">Customer Signature</p>
          </div>
        </div>
      </form>

      {/* FLOATING ACTION TOOLBAR DOCK AT THE BOTTOM */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center bg-deep-charcoal/90 border border-charcoal rounded-full px-5 py-3.5 shadow-2xl backdrop-blur-md gap-4">
        {/* PDF Download */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          title="Ver / Descargar PDF"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer shadow-lg shadow-blue-600/20"
        >
          <FileDown className="h-5 w-5" />
        </button>

        {/* Print */}
        <button
          type="button"
          onClick={handlePrint}
          title="Imprimir"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition cursor-pointer shadow-lg shadow-white/10"
        >
          <Printer className="h-5 w-5" />
        </button>

        {/* Email */}
        <button
          type="button"
          onClick={handleSendEmail}
          title="Enviar por Correo"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-500 transition cursor-pointer shadow-lg shadow-purple-600/20"
        >
          <Mail className="h-5 w-5" />
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={handleSendWhatsApp}
          title="Enviar por WhatsApp"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-500 transition cursor-pointer shadow-lg shadow-green-600/20"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Status Actions */}
        {isEditMode && status === 'pending' && (
          <button
            type="button"
            onClick={handleMarkPaid}
            title="Marcar como Cobrada (Pagada)"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-500 transition cursor-pointer shadow-lg shadow-teal-600/20"
          >
            <CheckSquare className="h-5 w-5" />
          </button>
        )}

        {/* Save/Submit */}
        <button
          type="button"
          onClick={(e) => {
            if (formRef.current) formRef.current.requestSubmit();
          }}
          title="Guardar Factura"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-600 text-white hover:bg-gray-500 transition cursor-pointer shadow-lg shadow-gray-600/20"
        >
          <Save className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
