import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table, PaymentMethod, PaymentRecord } from '../../types/restaurant';
import { 
  CreditCard, 
  Receipt, 
  DollarSign, 
  QrCode, 
  Users, 
  CheckCircle2, 
  Printer, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  X,
  Sparkles,
  RefreshCw,
  Building2,
  FileText
} from 'lucide-react';

export const CashierPanel: React.FC = () => {
  const { 
    config, 
    tables, 
    orders, 
    getTableOrders, 
    getTableTotal, 
    recordPayment, 
    payments 
  } = useRestaurant();

  // Active tables that have items ordered or are occupied
  const occupiedTables = tables.filter((t) => t.status !== 'libre');
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(
    occupiedTables.length > 0 ? occupiedTables[0].number : 4
  );

  // Bill Splitting state
  const [splitCount, setSplitCount] = useState<number>(1);
  const [tipPercentage, setTipPercentage] = useState<number>(10);

  // Payment checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mercadopago');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);

  // Mercado Pago QR dynamic simulation states
  const [mpStatus, setMpStatus] = useState<'generando' | 'esperando_escaneo' | 'pagado'>('esperando_escaneo');

  const selectedTable = tables.find((t) => t.number === selectedTableNumber);
  const tableOrders = getTableOrders(selectedTableNumber);
  const totals = getTableTotal(selectedTableNumber);

  const calculatedTip = Math.round((totals.subtotal * tipPercentage) / 100);
  const finalTotalWithTip = totals.total + calculatedTip;
  const splitAmountPerPerson = Math.ceil(finalTotalWithTip / splitCount);

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
    setMpStatus('esperando_escaneo');
    setCashTendered(finalTotalWithTip.toString());
  };

  const handleSimulateMercadoPagoScan = async () => {
    setIsProcessingPayment(true);
    // Simulate webhook ping from Mercado Pago backend
    setTimeout(async () => {
      setMpStatus('pagado');
      const record = await recordPayment({
        orderId: tableOrders[0]?.id || `ORD-${Date.now().toString().slice(-4)}`,
        tableNumber: selectedTableNumber,
        total: finalTotalWithTip,
        tip: calculatedTip,
        method: 'mercadopago',
        splitCount,
        splitAmount: splitAmountPerPerson,
      });
      setIsProcessingPayment(false);
      setCompletedPayment(record);
    }, 1800);
  };

  const handleConfirmCashOrCard = async () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      const record = await recordPayment({
        orderId: tableOrders[0]?.id || `ORD-${Date.now().toString().slice(-4)}`,
        tableNumber: selectedTableNumber,
        total: finalTotalWithTip,
        tip: calculatedTip,
        method: selectedPaymentMethod,
        splitCount,
        splitAmount: splitAmountPerPerson,
      });
      setIsProcessingPayment(false);
      setCompletedPayment(record);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-[90vh]">
      {/* Cashier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Terminal Punto de Venta & Caja
            </span>
            <span className="text-xs text-slate-400">· Turno {config.currentShift}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Panel de Caja y Cobros</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {occupiedTables.length} cuentas abiertas activas
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout: Open Tables Left, Detailed Bill Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Open Tables Picker (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
              Cuentas por Cobrar
            </h3>
            <span className="text-xs text-emerald-400 font-mono">
              {occupiedTables.length} mesas
            </span>
          </div>

          <div className="space-y-2.5 max-h-[72vh] overflow-y-auto pr-1">
            {occupiedTables.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No hay mesas ocupadas en este momento.
              </div>
            ) : (
              occupiedTables.map((tbl) => {
                const tTotal = getTableTotal(tbl.number);
                const isSelected = tbl.number === selectedTableNumber;
                const isPaying = tbl.status === 'pendiente_pago';

                return (
                  <div
                    key={tbl.number}
                    onClick={() => setSelectedTableNumber(tbl.number)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg font-black text-white font-mono">
                        Mesa #{tbl.number}
                      </span>
                      {isPaying ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-slate-950 animate-pulse">
                          Pide Cuenta
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                          Consumiendo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{tbl.zone}</span>
                      <span className="font-bold text-white font-mono text-sm">
                        ${tTotal.total.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Bill, Splitting, and Checkout (8 cols) */}
        <div className="lg:col-span-8">
          {selectedTable ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
              {/* Account Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Detalle de Consumo
                    </span>
                    <span className="text-xs text-slate-500">· {selectedTable.zone}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    Mesa #{selectedTable.number}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedTable.guestsCount || 2} personas</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Apertura {selectedTable.openedAt || '13:00'}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Table of Orders */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Ítems Consumidos
                </h4>

                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                  <div className="max-h-60 overflow-y-auto">
                    {tableOrders.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No hay consumos registrados para esta mesa.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 sticky top-0">
                          <tr>
                            <th className="py-2.5 px-4 font-semibold">Cant.</th>
                            <th className="py-2.5 px-4 font-semibold">Descripción del Plato</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Precio Unit.</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {tableOrders.flatMap((ord) =>
                            ord.items.map((it) => (
                              <tr key={it.id} className="hover:bg-slate-900/60 transition-colors">
                                <td className="py-2.5 px-4 font-mono font-bold text-white">
                                  {it.quantity}x
                                </td>
                                <td className="py-2.5 px-4 text-slate-200">
                                  <span className="font-semibold">{it.name}</span>
                                  {it.selectedOptions && it.selectedOptions.length > 0 && (
                                    <span className="block text-[11px] text-slate-400">
                                      {it.selectedOptions.join(' · ')}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                                  ${it.price.toLocaleString('es-AR')}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                                  ${(it.price * it.quantity).toLocaleString('es-AR')}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Bill Splitting Calculator */}
              <div className="mt-6 p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Dividir Cuenta entre Comensales
                    </span>
                  </div>

                  {/* Split count buttons: 1, 2, 3, 4, 5 */}
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSplitCount(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                          splitCount === num
                            ? 'bg-sky-500 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}p
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tip Selector */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <span>Propina sugerida mozo:</span>
                  <div className="flex items-center gap-1">
                    {[0, 10, 15, 20].map((tip) => (
                      <button
                        key={tip}
                        onClick={() => setTipPercentage(tip)}
                        className={`px-2 py-0.5 rounded text-xs font-medium font-mono ${
                          tipPercentage === tip
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tip}%
                      </button>
                    ))}
                  </div>
                </div>

                {splitCount > 1 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between text-xs text-sky-300">
                    <span>Monto por comensal ({splitCount} partes):</span>
                    <span className="text-base font-bold font-mono text-white">
                      ${splitAmountPerPerson.toLocaleString('es-AR')} ARS
                    </span>
                  </div>
                )}
              </div>

              {/* Total Calculation breakdown */}
              <div className="mt-6 border-t border-slate-800 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal Platos y Bebidas</span>
                  <span className="font-mono text-white">${totals.subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Servicio de Mesa / Cubierto ({selectedTable.guestsCount || 2} personas)</span>
                  <span className="font-mono text-white">${totals.coverFee.toLocaleString('es-AR')}</span>
                </div>
                {calculatedTip > 0 && (
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Propina sugerida ({tipPercentage}%)</span>
                    <span className="font-mono text-emerald-400">+${calculatedTip.toLocaleString('es-AR')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-black text-white pt-3 border-t border-slate-800">
                  <span>Total Final a Cobrar</span>
                  <span className="text-2xl font-mono text-emerald-400">
                    ${finalTotalWithTip.toLocaleString('es-AR')} <span className="text-xs text-slate-400 font-sans font-normal">ARS</span>
                  </span>
                </div>
              </div>

              {/* Payment Action Button */}
              <div className="mt-6">
                <button
                  type="button"
                  disabled={totals.total === 0}
                  onClick={handleOpenCheckout}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black py-4 px-6 rounded-2xl text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Cobrar Mesa #{selectedTable.number}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
              Selecciona una mesa a la izquierda para ver su cuenta y cobrar.
            </div>
          )}
        </div>
      </div>

      {/* Payment Processing Modal with Mercado Pago, Cash & Card */}
      {isCheckoutOpen && selectedTable && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in zoom-in-95">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400">Cobro de Mesa</span>
                <h3 className="text-xl font-bold text-white">Mesa #{selectedTable.number}</h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Display */}
            <div className="my-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total a Facturar</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ${finalTotalWithTip.toLocaleString('es-AR')} ARS
                </span>
              </div>
              {splitCount > 1 && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Dividido en {splitCount}p</span>
                  <span className="text-xs font-mono text-sky-400 font-bold">
                    ${splitAmountPerPerson.toLocaleString('es-AR')} c/u
                  </span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('mercadopago')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedPaymentMethod === 'mercadopago'
                    ? 'bg-sky-950/60 border-sky-400 text-sky-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-sky-400" />
                <span className="text-xs font-bold block">Mercado Pago</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('efectivo')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedPaymentMethod === 'efectivo'
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs font-bold block">Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('tarjeta')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedPaymentMethod === 'tarjeta'
                    ? 'bg-purple-950/60 border-purple-400 text-purple-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                <span className="text-xs font-bold block">Tarjeta Déb/Créd</span>
              </button>
            </div>

            {/* Content for Mercado Pago QR */}
            {selectedPaymentMethod === 'mercadopago' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-sky-500/30 text-center space-y-3">
                <span className="text-xs font-semibold text-sky-400">
                  Escaneá con la App de Mercado Pago
                </span>

                {/* Dynamic QR graphic with Mercado Pago branding styling */}
                <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-xl flex flex-col items-center justify-center relative">
                  {/* Stylized QR Matrix */}
                  <div className="w-full h-full border-4 border-slate-900 rounded-xl p-2 grid grid-cols-6 grid-rows-6 gap-1 bg-white">
                    <div className="bg-slate-950 col-span-2 row-span-2 rounded-sm" />
                    <div className="bg-slate-950 col-span-2" />
                    <div className="bg-slate-950 col-span-2 row-span-2 rounded-sm" />
                    <div className="bg-slate-950" />
                    <div className="bg-sky-500" />
                    <div className="bg-slate-950" />
                    <div className="bg-slate-950" />
                    <div className="bg-slate-950 col-span-2 row-span-2 rounded-sm" />
                    <div className="bg-sky-500" />
                    <div className="bg-slate-950 col-span-2" />
                    <div className="bg-slate-950" />
                    <div className="bg-slate-950" />
                    <div className="bg-slate-950 col-span-2" />
                    <div className="bg-sky-500 col-span-2" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-sky-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                      MP
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Webhook en tiempo real conectado al backend</span>
                </div>

                {/* Simulate Customer Scanning Button */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleSimulateMercadoPagoScan}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verificando transacción bancaria...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Simular Pago del Cliente por Mercado Pago</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Content for Cash payment */}
            {selectedPaymentMethod === 'efectivo' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Monto Recibido en Efectivo (ARS)
                  </label>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {Number(cashTendered) >= finalTotalWithTip && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                    <span>Vuelto a entregar al cliente:</span>
                    <span className="text-lg font-mono font-bold text-white">
                      ${(Number(cashTendered) - finalTotalWithTip).toLocaleString('es-AR')}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  disabled={Number(cashTendered) < finalTotalWithTip || isProcessingPayment}
                  onClick={handleConfirmCashOrCard}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Pago en Efectivo y Cerrar Mesa</span>
                </button>
              </div>
            )}

            {/* Content for Card payment */}
            {selectedPaymentMethod === 'tarjeta' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex justify-between">
                    <span>Terminal POS:</span>
                    <span className="font-semibold text-white">Ingenico Move 2500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarjetas Aceptadas:</span>
                    <span className="text-slate-400">Visa, Mastercard, Cabal, Amex</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleConfirmCashOrCard}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar Transacción de Tarjeta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fiscal Ticket / Receipt Modal */}
      {completedPayment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Cobro Exitoso & Mesa Liberada
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Comprobante de Pago
              </h3>
            </div>

            {/* Ticket Preview in Paper Look */}
            <div className="mt-4 p-4 bg-slate-100 text-slate-900 rounded-xl font-mono text-[11px] space-y-1.5 shadow-inner">
              <div className="text-center font-bold pb-2 border-b border-dashed border-slate-400">
                <p className="text-sm font-black">{config.restaurantName.toUpperCase()}</p>
                <p className="text-[10px] text-slate-600 font-sans">CUIT: 30-71458923-8 · RESPONSABLE INSCRIPTO</p>
                <p className="text-[10px] text-slate-600 font-sans">Palermo Soho, CABA - IVA e Ingresos Brutos Incluidos</p>
              </div>

              <div className="pt-2 flex justify-between">
                <span>COMPROBANTE TICKET B:</span>
                <span className="font-bold">{completedPayment.id}</span>
              </div>
              <div className="flex justify-between">
                <span>FECHA / HORA:</span>
                <span>{completedPayment.createdAt} hs</span>
              </div>
              <div className="flex justify-between">
                <span>MESA COBRADA:</span>
                <span>MESA #{completedPayment.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>MEDIO DE PAGO:</span>
                <span className="font-bold uppercase">{completedPayment.method}</span>
              </div>
              <div className="flex justify-between">
                <span>REF TRANSACCIÓN:</span>
                <span>{completedPayment.referenceId}</span>
              </div>

              <div className="py-2 border-t border-b border-dashed border-slate-400 my-2">
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL COBRADO:</span>
                  <span>${completedPayment.total.toLocaleString('es-AR')} ARS</span>
                </div>
                {completedPayment.splitCount > 1 && (
                  <p className="text-[10px] text-slate-600 font-sans">
                    Dividido en {completedPayment.splitCount} comensales (${completedPayment.splitAmount.toLocaleString('es-AR')} c/u)
                  </p>
                )}
              </div>

              <p className="text-center text-[10px] text-slate-600 pt-1 font-sans">
                ¡Muchas gracias por su visita a {config.restaurantName}!
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ticket</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCompletedPayment(null);
                  setIsCheckoutOpen(false);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
              >
                Listo, Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
