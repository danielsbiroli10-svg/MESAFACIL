import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CategoryType, MenuItem } from '../../types/restaurant';
import { 
  Search, 
  ShoppingBag, 
  Bell, 
  Receipt, 
  Check, 
  Plus, 
  Minus, 
  X, 
  UtensilsCrossed, 
  Clock, 
  ChefHat,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CartItemDraft {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: string[];
  notes: string;
  totalPrice: number;
}

export const ClientDigitalMenu: React.FC = () => {
  const { 
    config, 
    menu, 
    clientTableNumber, 
    createOrder, 
    callWaiter, 
    waiterCalls,
    getTableOrders,
    getTableTotal,
    isOnline
  } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState<CategoryType | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  // Customization modal state
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalSelectedOptions, setModalSelectedOptions] = useState<{ [groupName: string]: { label: string; priceDelta: number } }>({});
  const [modalNotes, setModalNotes] = useState('');

  // Cart state
  const [cart, setCart] = useState<CartItemDraft[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [orderSentSuccess, setOrderSentSuccess] = useState<string | null>(null);
  const [callSentFeedback, setCallSentFeedback] = useState<string | null>(null);

  // Check if waiter was already called for this table
  const activeWaiterCall = waiterCalls.find(
    (c) => c.tableNumber === clientTableNumber && c.status !== 'atendido'
  );

  const tableOrders = getTableOrders(clientTableNumber);
  const tableTotals = getTableTotal(clientTableNumber);

  // Categories list
  const categories: { key: CategoryType | 'todas'; label: string }[] = [
    { key: 'todas', label: 'Todo el Menú' },
    { key: 'entradas', label: 'Entradas' },
    { key: 'carnes', label: 'Carnes & Parrilla' },
    { key: 'principales', label: 'Platos Principales' },
    { key: 'pastas', label: 'Pastas Caseras' },
    { key: 'pizzas', label: 'Pizzas a la Piedra' },
    { key: 'ensaladas', label: 'Ensaladas' },
    { key: 'postres', label: 'Postres' },
    { key: 'bebidas', label: 'Bebidas & Vinos' },
  ];

  // Filter menu items
  const filteredItems = menu.filter((item) => {
    const matchesCategory = activeCategory === 'todas' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openCustomizer = (item: MenuItem) => {
    setSelectedItemForModal(item);
    setModalQuantity(1);
    setModalNotes('');
    const defaultOptions: { [group: string]: { label: string; priceDelta: number } } = {};
    if (item.customizations) {
      item.customizations.forEach((c) => {
        if (c.options.length > 0) {
          defaultOptions[c.name] = c.options[0];
        }
      });
    }
    setModalSelectedOptions(defaultOptions);
  };

  const calculateModalUnitPrice = () => {
    if (!selectedItemForModal) return 0;
    const base = selectedItemForModal.price;
    const extras = Object.values(modalSelectedOptions).reduce((acc, opt) => acc + opt.priceDelta, 0);
    return base + extras;
  };

  const handleAddToCart = () => {
    if (!selectedItemForModal) return;
    const unitPrice = calculateModalUnitPrice();
    const optionsArray = Object.entries(modalSelectedOptions).map(
      ([group, opt]) => `${group}: ${opt.label}`
    );

    const newItem: CartItemDraft = {
      menuItem: selectedItemForModal,
      quantity: modalQuantity,
      selectedOptions: optionsArray,
      notes: modalNotes.trim(),
      totalPrice: unitPrice * modalQuantity,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedItemForModal(null);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      const singleUnitPrice = updated[index].totalPrice / updated[index].quantity;
      updated[index] = {
        ...updated[index],
        quantity: newQty,
        totalPrice: singleUnitPrice * newQty,
      };
      return updated;
    });
  };

  const cartTotal = cart.reduce((acc, itm) => acc + itm.totalPrice, 0);
  const cartItemsCount = cart.reduce((acc, itm) => acc + itm.quantity, 0);

  const handleSendOrderToKitchen = () => {
    if (cart.length === 0) return;

    const itemsToSend = cart.map((c) => ({
      menuItemId: c.menuItem.id,
      name: c.menuItem.name,
      price: c.totalPrice / c.quantity,
      quantity: c.quantity,
      selectedOptions: c.selectedOptions,
      notes: c.notes,
    }));

    const orderId = createOrder(clientTableNumber, itemsToSend, 'cliente_qr');
    setCart([]);
    setIsCartOpen(false);
    setOrderSentSuccess(orderId);
  };

  const handleCallWaiterClick = (type: 'mozo' | 'cuenta') => {
    callWaiter(clientTableNumber, type);
    setCallSentFeedback(
      type === 'cuenta' 
        ? 'Se ha solicitado la cuenta. El mozo se acercará a la mesa.' 
        : '¡Aviso enviado! El mozo está notificado y se acerca a tu mesa.'
    );
    setTimeout(() => setCallSentFeedback(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Hero Brand & Detected Table Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Mesa #{clientTableNumber} Verificada
                </span>
                <span className="text-xs text-slate-400">QR Escaneado</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {config.restaurantName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {config.tagline} · Carta Digital Oficial
              </p>
            </div>

            {/* Quick Customer Action Buttons: Llamar al Mozo & Solicitar Cuenta */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCallWaiterClick('mozo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  activeWaiterCall && activeWaiterCall.type === 'mozo'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                {activeWaiterCall?.status === 'en_camino'
                  ? 'Mozo en camino...'
                  : activeWaiterCall?.type === 'mozo'
                  ? 'Aviso pendiente'
                  : 'Llamar al mozo'}
              </button>

              <button
                onClick={() => handleCallWaiterClick('cuenta')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all"
              >
                <Receipt className="w-3.5 h-3.5 text-sky-400" />
                Pedir Cuenta
              </button>

              {tableOrders.length > 0 && (
                <button
                  onClick={() => setIsAccountDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-all"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tu Consumo:</span>
                  <span className="font-mono">${tableTotals.total.toLocaleString('es-AR')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-time Call Feedback message */}
          {callSentFeedback && (
            <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-600/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{callSentFeedback}</span>
            </div>
          )}

          {/* Search bar */}
          <div className="mt-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar platos, cortes, pastas, bebidas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Horizontal Category Nav */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dishes Grid */}
      <main className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white tracking-tight">
            {activeCategory === 'todas'
              ? 'Todos los Platos Disponibles'
              : categories.find((c) => c.key === activeCategory)?.label}
          </h2>
          <span className="text-xs text-slate-400">
            {filteredItems.length} opciones
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-8">
            <UtensilsCrossed className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No encontramos platos</h3>
            <p className="text-xs text-slate-500 mt-1">Prueba con otra palabra o categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => item.available && openCustomizer(item)}
                className={`group bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between ${
                  !item.available ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-black/40'
                }`}
              >
                <div>
                  {/* Dish Image */}
                  <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30">
                          {item.tags[0]}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] text-slate-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>~{item.preparationTimeMinutes} min</span>
                    </div>

                    {!item.available && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 border border-rose-500/40 px-3 py-1 rounded-lg">
                          Agotado Temporalmente
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer price & action */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Precio</span>
                    <span className="text-lg font-bold text-white font-mono">
                      ${item.price.toLocaleString('es-AR')} <span className="text-xs font-normal text-slate-400">ARS</span>
                    </span>
                  </div>

                  {item.available && (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Pedir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-5 rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center justify-between transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950 font-bold text-sm">
                {cartItemsCount}
              </div>
              <div className="text-left">
                <span className="text-sm font-extrabold block leading-tight">
                  Ver Carrito de la Mesa
                </span>
                <span className="text-[11px] font-semibold opacity-90 block">
                  {cart.length} {cart.length === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-mono">
                ${cartTotal.toLocaleString('es-AR')}
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Item Customizer Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                  Personalizar Plato
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedItemForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Options */}
            {selectedItemForModal.customizations && selectedItemForModal.customizations.length > 0 && (
              <div className="mt-5 space-y-4">
                {selectedItemForModal.customizations.map((custom) => (
                  <div key={custom.name} className="border-t border-slate-800/80 pt-3">
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      {custom.name}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {custom.options.map((opt) => {
                        const isSelected = modalSelectedOptions[custom.name]?.label === opt.label;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() =>
                              setModalSelectedOptions((prev) => ({
                                ...prev,
                                [custom.name]: opt,
                              }))
                            }
                            className={`flex items-center justify-between p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                              isSelected
                                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                                : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                              </span>
                              {opt.label}
                            </span>
                            {opt.priceDelta > 0 && (
                              <span className="text-emerald-400 font-mono">
                                +${opt.priceDelta.toLocaleString('es-AR')}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special Notes & Observations */}
            <div className="mt-4 border-t border-slate-800/80 pt-3">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Observaciones para la Cocina (Opcional)
              </label>
              <textarea
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Ej: Sin sal, aderezo aparte, bien cocido, sin cebolla..."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-white w-5 text-center font-mono">
                  {modalQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setModalQuantity((q) => q + 1)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-between"
              >
                <span>Agregar al Carrito</span>
                <span className="font-mono">
                  ${(calculateModalUnitPrice() * modalQuantity).toLocaleString('es-AR')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-5 sm:p-6 shadow-2xl">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Comanda - Mesa #{clientTableNumber}</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.menuItem.name}
                      </h4>
                      {item.selectedOptions.length > 0 && (
                        <p className="text-[11px] text-emerald-400/90 mt-0.5">
                          {item.selectedOptions.join(' · ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-0.5">
                          Obs: "{item.notes}"
                        </p>
                      )}
                      <span className="text-xs font-bold text-white font-mono mt-1 block">
                        ${item.totalPrice.toLocaleString('es-AR')}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(idx, -1)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, 1)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary & Enviar a Cocina */}
            <div className="border-t border-slate-800 pt-4 mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Subtotal Comanda</span>
                <span className="font-mono text-white text-sm">
                  ${cartTotal.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Al presionar el botón, la comanda ingresa de inmediato a la pantalla de cocina.
                </span>
              </div>

              {/* Botón destacado: "Enviar pedido a cocina" */}
              <button
                type="button"
                onClick={handleSendOrderToKitchen}
                disabled={!isOnline}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-black py-4 px-6 rounded-2xl text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <ChefHat className="w-5 h-5" />
                <span>Enviar Pedido a Cocina</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Orders / Table Consumption Drawer */}
      {isAccountDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-5 sm:p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-bold text-white">Consumo Mesa #{clientTableNumber}</h3>
                </div>
                <button
                  onClick={() => setIsAccountDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {tableOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Aún no se han enviado pedidos a cocina en esta mesa.
                  </p>
                ) : (
                  tableOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">
                          Comanda {ord.id} ({ord.createdAt})
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'entregado'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/30'
                              : ord.status === 'listo'
                              ? 'bg-sky-950 text-sky-400 border border-sky-600/30'
                              : 'bg-amber-950 text-amber-400 border border-amber-600/30'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <div className="border-t border-slate-800/60 pt-2 space-y-1">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex justify-between text-xs text-slate-300">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono text-slate-200">
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

            {/* Total Account Summary */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal Platos</span>
                <span className="font-mono text-white">${tableTotals.subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Servicio de Mesa / Cubierto</span>
                <span className="font-mono text-white">${tableTotals.coverFee.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Acumulado</span>
                <span className="font-mono text-emerald-400 text-lg">
                  ${tableTotals.total.toLocaleString('es-AR')} ARS
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleCallWaiterClick('cuenta');
                  setIsAccountDrawerOpen(false);
                }}
                className="w-full mt-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Pedir la Cuenta a la Mesa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Sent Success Modal */}
      {orderSentSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-slate-900 border border-emerald-500/50 max-w-md w-full rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <Check className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              ¡Pedido Confirmado!
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Comanda #{orderSentSuccess}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Tu pedido ya está en las pantallas de cocina. Puedes seguir agregando platos o bebidas en cualquier momento sin cerrar tu cuenta.
            </p>

            <div className="mt-5 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Tiempo estimado de elaboración: 15-20 minutos</span>
            </div>

            <button
              onClick={() => setOrderSentSuccess(null)}
              className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm"
            >
              Entendido, volver a la carta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
