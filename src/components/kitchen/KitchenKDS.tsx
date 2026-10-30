import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, OrderItemStatus } from '../../types/restaurant';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Check, 
  Volume2, 
  VolumeX, 
  Filter, 
  Flame,
  ArrowUpDown
} from 'lucide-react';

export const KitchenKDS: React.FC = () => {
  const { 
    orders, 
    updateOrderItemStatus, 
    markOrderReady, 
    playAudioChime 
  } = useRestaurant();

  const [filterState, setFilterState] = useState<'todos' | 'pendiente' | 'preparando' | 'listo'>('todos');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [nowTimestamp, setNowTimestamp] = useState(Date.now());

  // Real-time ticking timer for elapsed minutes and seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort orders (active kitchen orders: not paid/cobrado)
  const kitchenOrders = orders
    .filter((o) => o.status !== 'cobrado')
    .filter((o) => {
      if (filterState === 'todos') return o.status !== 'entregado';
      return o.status === filterState;
    })
    .sort((a, b) => a.timestamp - b.timestamp); // Oldest first (FIFO priority)

  const getElapsedTimeInfo = (timestamp: number) => {
    const diffMs = Math.max(0, nowTimestamp - timestamp);
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    let urgency: 'normal' | 'warning' | 'urgent' = 'normal';
    let colorClass = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    let badgeBg = 'bg-emerald-500';

    if (minutes >= 20) {
      urgency = 'urgent';
      colorClass = 'text-rose-400 bg-rose-950/80 border-rose-500/60 animate-pulse';
      badgeBg = 'bg-rose-500';
    } else if (minutes >= 10) {
      urgency = 'warning';
      colorClass = 'text-amber-400 bg-amber-950/70 border-amber-500/50';
      badgeBg = 'bg-amber-500';
    }

    return { minutes, seconds, formatted, urgency, colorClass, badgeBg };
  };

  const handleStartPreparing = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    ord.items.forEach((item) => {
      if (item.status === 'pendiente') {
        updateOrderItemStatus(orderId, item.id, 'preparando');
      }
    });
    if (soundEnabled) playAudioChime('kitchen');
  };

  const handleItemStatusToggle = (orderId: string, itemId: string, currentStatus: OrderItemStatus) => {
    let nextStatus: OrderItemStatus = 'preparando';
    if (currentStatus === 'pendiente') nextStatus = 'preparando';
    else if (currentStatus === 'preparando') nextStatus = 'listo';
    else if (currentStatus === 'listo') nextStatus = 'preparando';

    updateOrderItemStatus(orderId, itemId, nextStatus);
    if (soundEnabled && nextStatus === 'listo') {
      playAudioChime('kitchen');
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    markOrderReady(orderId);
    if (soundEnabled) playAudioChime('call');
  };

  return (
    <div className="min-h-[90vh] bg-slate-950 text-slate-100 p-4 sm:p-6">
      {/* KDS Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Kitchen Display System (KDS)
              </span>
              <span className="text-xs text-slate-400">· Vista de Comandas en Vivo</span>
            </div>
            <h1 className="text-2xl font-black text-white">Pantalla de Cocina</h1>
          </div>
        </div>

        {/* Controls: Filter & Sound */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filters */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {(['todos', 'pendiente', 'preparando', 'listo'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterState(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterState === st
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'todos' ? 'Todas' : st}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Timbre de Cocina</span>
          </button>
        </div>
      </div>

      {/* Grid of Kitchen Order Cards */}
      <main className="max-w-7xl mx-auto mt-6">
        {kitchenOrders.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-800/80 rounded-3xl bg-slate-900/30 p-8">
            <ChefHat className="w-16 h-16 text-slate-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">No hay comandas pendientes</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Todas las órdenes han sido despachadas. Nuevos pedidos aparecerán aquí automáticamente en tiempo real.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kitchenOrders.map((ord) => {
              const timeInfo = getElapsedTimeInfo(ord.timestamp);
              const allItemsReady = ord.items.every((it) => it.status === 'listo');

              return (
                <div
                  key={ord.id}
                  className={`bg-slate-900 rounded-2xl border-2 flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                    ord.status === 'listo'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : timeInfo.urgency === 'urgent'
                      ? 'border-rose-500/80 shadow-rose-950/50'
                      : timeInfo.urgency === 'warning'
                      ? 'border-amber-500/60 shadow-amber-950/30'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Card Header: Table Number & Running Timer */}
                  <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Comanda #{ord.id}
                      </span>
                      <h3 className="text-2xl font-black text-white font-mono leading-none mt-0.5">
                        Mesa {ord.tableNumber}
                      </h3>
                    </div>

                    {/* Timer badge */}
                    <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold ${timeInfo.colorClass}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeInfo.formatted}</span>
                    </div>
                  </div>

                  {/* Order Metadata */}
                  <div className="px-4 py-2 bg-slate-950/30 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Ingreso: <strong className="text-slate-300">{ord.createdAt}</strong></span>
                    <span>Mozo: <strong className="text-slate-300">{ord.waiterName || 'QR Cliente'}</strong></span>
                  </div>

                  {/* Items List (Big & Highly Legible) */}
                  <div className="p-4 flex-1 space-y-3">
                    {ord.items.map((item) => {
                      const isItemReady = item.status === 'listo';
                      const isItemCooking = item.status === 'preparando';

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemStatusToggle(ord.id, item.id, item.status)}
                          className={`p-3 rounded-xl border cursor-pointer select-none transition-all ${
                            isItemReady
                              ? 'bg-emerald-950/40 border-emerald-500/40 opacity-75'
                              : isItemCooking
                              ? 'bg-amber-950/30 border-amber-500/40'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              {/* Quantity Badge */}
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-sm shrink-0 ${
                                isItemReady 
                                  ? 'bg-emerald-500 text-slate-950' 
                                  : isItemCooking 
                                  ? 'bg-amber-500 text-slate-950' 
                                  : 'bg-slate-800 text-white'
                              }`}>
                                {item.quantity}
                              </span>

                              <div>
                                <span className={`text-sm font-bold block leading-snug ${
                                  isItemReady ? 'line-through text-slate-400' : 'text-white'
                                }`}>
                                  {item.name}
                                </span>

                                {/* Customizations */}
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                  <span className="text-[11px] text-amber-300/90 font-medium block mt-0.5">
                                    {item.selectedOptions.join(' · ')}
                                  </span>
                                )}

                                {/* Special Notes (High Visiblity Callout) */}
                                {item.notes && (
                                  <div className="mt-1.5 p-1.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-300 font-semibold flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                    <span>Obs: "{item.notes}"</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Checkmark indicator */}
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isItemReady ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-700'
                            }`}>
                              {isItemReady && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer: Action Buttons */}
                  <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2">
                    {ord.status === 'pendiente' ? (
                      <button
                        type="button"
                        onClick={() => handleStartPreparing(ord.id)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Comenzar Preparación</span>
                      </button>
                    ) : ord.status === 'preparando' ? (
                      <button
                        type="button"
                        onClick={() => handleCompleteOrder(ord.id)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Marcar Pedido Listo</span>
                      </button>
                    ) : (
                      <div className="w-full text-center py-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>Listo · Notificado al Mozo</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
