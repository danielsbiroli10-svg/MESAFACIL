import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table, MenuItem } from '../../types/restaurant';
import { 
  Users, 
  Clock, 
  UtensilsCrossed, 
  Plus, 
  Check, 
  Bell, 
  ChefHat, 
  CreditCard, 
  Receipt, 
  X, 
  Search,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  User
} from 'lucide-react';

export const WaiterPanel: React.FC = () => {
  const { 
    tables, 
    waiters, 
    currentWaiter, 
    setCurrentWaiter, 
    menu, 
    createOrder, 
    getTableOrders, 
    getTableTotal, 
    updateTableStatus, 
    closeTable,
    waiterCalls,
    respondToWaiterCall,
    dismissWaiterCall,
    orders,
    markOrderDelivered
  } = useRestaurant();

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [filterMode, setFilterMode] = useState<'mis_mesas' | 'todas'>('mis_mesas');
  
  // Quick Order taking inside Waiter screen
  const [isTakingOrder, setIsTakingOrder] = useState(false);
  const [orderDraft, setOrderDraft] = useState<{ item: MenuItem; quantity: number; notes: string }[]>([]);
  const [searchMenuQuery, setSearchMenuQuery] = useState('');
  const [guestCountInput, setGuestCountInput] = useState(2);

  // Tables visible to this waiter
  const visibleTables = tables.filter((t) => {
    if (filterMode === 'mis_mesas') {
      return currentWaiter.assignedTables.includes(t.number);
    }
    return true;
  });

  // Ready dishes notification for waiter
  const readyOrders = orders.filter((o) => o.status === 'listo');

  // Customer waiter calls
  const pendingCalls = waiterCalls.filter((c) => c.status !== 'atendido');

  const handleOpenTableDetail = (table: Table) => {
    setSelectedTable(table);
    setGuestCountInput(table.guestsCount || 2);
  };

  const handleStartOrderForTable = (table: Table) => {
    setSelectedTable(table);
    setIsTakingOrder(true);
    setOrderDraft([]);
  };

  const addToOrderDraft = (item: MenuItem) => {
    setOrderDraft((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1, notes: '' }];
    });
  };

  const updateDraftQty = (index: number, delta: number) => {
    setOrderDraft((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) return updated.filter((_, i) => i !== index);
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleConfirmWaiterOrder = () => {
    if (!selectedTable || orderDraft.length === 0) return;

    const itemsToSend = orderDraft.map((d) => ({
      menuItemId: d.item.id,
      name: d.item.name,
      price: d.item.price,
      quantity: d.quantity,
      selectedOptions: [],
      notes: d.notes,
    }));

    createOrder(selectedTable.number, itemsToSend, 'mozo');
    updateTableStatus(selectedTable.number, 'esperando_pedido', guestCountInput);
    setIsTakingOrder(false);
    setOrderDraft([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 min-h-[90vh]">
      {/* Waiter Profile Bar & Shift Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentWaiter.avatar}
              alt={currentWaiter.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/50"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Mozo de Servicio
              </span>
              <span className="text-xs text-slate-500">· Turno {currentWaiter.shift}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{currentWaiter.name}</h2>
          </div>
        </div>

        {/* Switch Waiter Login */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Cambiar Mozo:</span>
          <div className="flex gap-1.5">
            {waiters.map((w) => (
              <button
                key={w.id}
                onClick={() => setCurrentWaiter(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentWaiter.id === w.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {w.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Notifications: Kitchen Ready Dishes & Waiter Calls */}
      <div className="space-y-3 mb-6">
        {/* Calls from tables */}
        {pendingCalls.length > 0 && (
          <div className="space-y-2">
            {pendingCalls.map((call) => (
              <div
                key={call.id}
                className="bg-amber-950/70 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      {call.type === 'cuenta' ? 'Solicitud de Cuenta' : 'Llamado de Mozo'}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Mesa #{call.tableNumber} {call.status === 'en_camino' ? '(En camino)' : 'espera atención'}
                    </h4>
                    <span className="text-xs text-slate-400">Hora: {call.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {call.status !== 'en_camino' ? (
                    <button
                      onClick={() => respondToWaiterCall(call.id)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
                    >
                      En camino
                    </button>
                  ) : (
                    <button
                      onClick={() => dismissWaiterCall(call.id)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Atendido
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ready dishes in kitchen */}
        {readyOrders.length > 0 && (
          <div className="space-y-2">
            {readyOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      ¡Platos Listos en Cocina!
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Mesa #{ord.tableNumber} · {ord.items.length} plato(s) listos
                    </h4>
                    <p className="text-xs text-slate-300">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => markOrderDelivered(ord.id)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <CheckCheck className="w-4 h-4" />
                  Entregado a Mesa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Tabs: Mis Mesas vs Todas */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterMode('mis_mesas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'mis_mesas'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mis Mesas Asignadas ({currentWaiter.assignedTables.length})
          </button>
          <button
            onClick={() => setFilterMode('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'todas'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas las Mesas ({tables.length})
          </button>
        </div>

        <span className="text-xs text-slate-400">
          {visibleTables.filter((t) => t.status !== 'libre').length} activas
        </span>
      </div>

      {/* Tables Status Cards Grid (Optimized for Mobile Touch) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {visibleTables.map((tbl) => {
          const tableOrders = getTableOrders(tbl.number);
          const totals = getTableTotal(tbl.number);

          let statusBg = 'bg-slate-900 border-slate-800';
          let statusBadge = 'bg-slate-800 text-slate-400 border-slate-700';
          let statusText = 'Libre';

          if (tbl.status === 'esperando_pedido') {
            statusBg = 'bg-amber-950/30 border-amber-500/40';
            statusBadge = 'bg-amber-950 text-amber-300 border-amber-500/40';
            statusText = 'En Espera';
          } else if (tbl.status === 'ocupada') {
            statusBg = 'bg-emerald-950/20 border-emerald-500/40';
            statusBadge = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
            statusText = 'Ocupada';
          } else if (tbl.status === 'pendiente_pago') {
            statusBg = 'bg-sky-950/40 border-sky-500/40';
            statusBadge = 'bg-sky-950 text-sky-300 border-sky-500/40';
            statusText = 'Pide Cuenta';
          }

          return (
            <div
              key={tbl.number}
              onClick={() => handleOpenTableDetail(tbl)}
              className={`p-4 rounded-2xl border ${statusBg} flex flex-col justify-between cursor-pointer hover:border-slate-500 transition-all hover:scale-[1.01] active:scale-[0.99]`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-black text-white font-mono">
                    Mesa {tbl.number}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${statusBadge}`}>
                    {statusText}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{tbl.guestsCount ? `${tbl.guestsCount} comensales` : `Cap: ${tbl.capacity}`}</span>
                  </div>
                  {tbl.openedAt && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Abierta {tbl.openedAt}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Consumo</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {totals.total > 0 ? `$${totals.total.toLocaleString('es-AR')}` : '$0'}
                  </span>
                </div>

                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Table Drawer */}
      {selectedTable && !isTakingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-5 sm:p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    {selectedTable.zone}
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Mesa #{selectedTable.number}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Action pills */}
              <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Estado Actual</span>
                  <span className="text-sm font-bold text-white capitalize">
                    {selectedTable.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedTable.status === 'libre' ? (
                    <button
                      onClick={() => updateTableStatus(selectedTable.number, 'ocupada', guestCountInput)}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      Ocupar Mesa
                    </button>
                  ) : (
                    <button
                      onClick={() => closeTable(selectedTable.number)}
                      className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold hover:bg-rose-500/30"
                    >
                      Liberar Mesa
                    </button>
                  )}
                </div>
              </div>

              {/* Orders on this table */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Comandas Activas
                  </h4>
                  <span className="text-xs text-slate-500">
                    {getTableOrders(selectedTable.number).length} pedidos
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
                  {getTableOrders(selectedTable.number).length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Mesa sin comandas cargadas actualmente.
                    </div>
                  ) : (
                    getTableOrders(selectedTable.number).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">
                            {ord.id} ({ord.createdAt}) · Origen: {ord.source === 'cliente_qr' ? 'QR Cliente' : 'Mozo'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                            {ord.status}
                          </span>
                        </div>
                        <div className="border-t border-slate-800/60 pt-2 space-y-1">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex justify-between text-xs text-slate-300">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="font-mono text-slate-400">
                                ${(it.price * it.quantity).toLocaleString('es-AR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Agregar Pedido Manual / Solicitar Cierre */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>Total Consumido:</span>
                <span className="text-emerald-400 font-mono text-base">
                  ${getTableTotal(selectedTable.number).total.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsTakingOrder(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cargar Pedido</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateTableStatus(selectedTable.number, 'pendiente_pago');
                    setSelectedTable(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Receipt className="w-4 h-4 text-sky-400" />
                  <span>Pedir Cuenta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Quick POS Order Taking Modal */}
      {isTakingOrder && selectedTable && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in zoom-in-95">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs uppercase text-emerald-400 font-bold">Comanda Rápida</span>
                  <h3 className="text-xl font-bold text-white">Cargar Mesa #{selectedTable.number}</h3>
                </div>
                <button
                  onClick={() => setIsTakingOrder(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search dishes */}
              <div className="mt-3 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar plato para agregar a la comanda..."
                  value={searchMenuQuery}
                  onChange={(e) => setSearchMenuQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Dishes Quick Grid */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-800/80 rounded-xl bg-slate-950/40">
                {menu
                  .filter((m) => m.available && m.name.toLowerCase().includes(searchMenuQuery.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addToOrderDraft(item)}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left transition-all flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-white truncate block">
                        {item.name}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 mt-1 block">
                        ${item.price.toLocaleString('es-AR')}
                      </span>
                    </button>
                  ))}
              </div>

              {/* Current Order Draft */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  Ítems Seleccionados ({orderDraft.length})
                </span>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {orderDraft.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">
                      Toca los platos de arriba para sumarlos a la comanda.
                    </p>
                  ) : (
                    orderDraft.map((draft, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <span className="font-semibold text-white truncate block">
                            {draft.item.name}
                          </span>
                          <span className="text-slate-400 font-mono">
                            ${(draft.item.price * draft.quantity).toLocaleString('es-AR')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded">
                          <button
                            type="button"
                            onClick={() => updateDraftQty(idx, -1)}
                            className="text-slate-400 hover:text-white font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold font-mono text-white w-4 text-center">
                            {draft.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateDraftQty(idx, 1)}
                            className="text-slate-400 hover:text-white font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Confirm send to kitchen */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4 mt-4">
              <div>
                <span className="text-xs text-slate-400 block">Total Comanda</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  $
                  {orderDraft
                    .reduce((acc, d) => acc + d.item.price * d.quantity, 0)
                    .toLocaleString('es-AR')}
                </span>
              </div>

              <button
                type="button"
                disabled={orderDraft.length === 0}
                onClick={handleConfirmWaiterOrder}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 shadow-lg"
              >
                <ChefHat className="w-4 h-4" />
                <span>Enviar a Cocina</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
