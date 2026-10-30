import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Table, Order, WaiterStaff, WaiterCall, PaymentRecord, OrderItem, OrderItemStatus } from '../types/restaurant';
import { INITIAL_MENU, INITIAL_TABLES, INITIAL_WAITERS, INITIAL_ORDERS } from '../data/mockData';

interface RestaurantConfig {
  restaurantName: string;
  tagline: string;
  coverFeePerPerson: number; // cubierto en ARS
  currentShift: 'Almuerzo' | 'Cena';
  currency: string;
  taxRatePercent: number;
}

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: number;
}

interface RestaurantContextType {
  // Config & State
  config: RestaurantConfig;
  updateConfig: (newConfig: Partial<RestaurantConfig>) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  
  // Navigation & Role Simulation
  activeRole: 'cliente' | 'mozo' | 'cocina' | 'caja' | 'admin';
  setActiveRole: (role: 'cliente' | 'mozo' | 'cocina' | 'caja' | 'admin') => void;
  clientTableNumber: number;
  setClientTableNumber: (tableNum: number) => void;
  currentWaiter: WaiterStaff;
  setCurrentWaiter: (waiter: WaiterStaff) => void;

  // Menu Management
  menu: MenuItem[];
  updateMenuItem: (item: MenuItem) => void;
  toggleItemAvailability: (id: string) => void;
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // Tables Management
  tables: Table[];
  getTable: (num: number) => Table | undefined;
  updateTableStatus: (tableNum: number, status: Table['status'], guests?: number) => void;
  closeTable: (tableNum: number) => void;

  // Orders Management
  orders: Order[];
  createOrder: (tableNumber: number, items: Omit<OrderItem, 'id' | 'status'>[], source: 'cliente_qr' | 'mozo') => string;
  updateOrderItemStatus: (orderId: string, itemId: string, newStatus: OrderItemStatus) => void;
  markOrderReady: (orderId: string) => void;
  markOrderDelivered: (orderId: string) => void;
  getTableOrders: (tableNum: number) => Order[];
  getTableTotal: (tableNum: number) => { subtotal: number; coverFee: number; total: number; itemsCount: number };

  // Waiter Calls
  waiterCalls: WaiterCall[];
  callWaiter: (tableNumber: number, type?: 'mozo' | 'cuenta') => void;
  respondToWaiterCall: (callId: string) => void;
  dismissWaiterCall: (callId: string) => void;

  // Waiters Staff
  waiters: WaiterStaff[];

  // Payments & Checkout
  payments: PaymentRecord[];
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'status'>) => Promise<PaymentRecord>;

  // Notifications & Sound
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  playAudioChime: (type: 'kitchen' | 'call' | 'cash') => void;

  // Reset to initial demo state
  resetDemoData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Web Audio synthesizer for pristine, zero-dependency kitchen bell and alerts
const playBeep = (freq: number, type: OscillatorType = 'sine', duration = 0.25) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio context errors if blocked by browser policy
  }
};

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial from localStorage if present
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const saved = localStorage.getItem('mesa_facil_config');
    return saved ? JSON.parse(saved) : {
      restaurantName: 'La Cabaña Gourmet',
      tagline: 'Parrilla & Cocina Criolla Contemporánea',
      coverFeePerPerson: 1200,
      currentShift: 'Cena',
      currency: 'ARS',
      taxRatePercent: 21,
    };
  });

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<'cliente' | 'mozo' | 'cocina' | 'caja' | 'admin'>('cliente');
  const [clientTableNumber, setClientTableNumber] = useState<number>(4);

  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('mesa_facil_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('mesa_facil_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mesa_facil_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [waiters] = useState<WaiterStaff[]>(INITIAL_WAITERS);
  const [currentWaiter, setCurrentWaiter] = useState<WaiterStaff>(INITIAL_WAITERS[0]);

  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>(() => {
    return [
      {
        id: 'call-1',
        tableNumber: 4,
        time: '13:35',
        timestamp: Date.now() - 2 * 60 * 1000,
        status: 'esperando',
        type: 'mozo',
      },
    ];
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('mesa_facil_payments');
    return saved ? JSON.parse(saved) : [
      {
        id: 'PAY-8901',
        orderId: 'ORD-1039',
        tableNumber: 2,
        total: 42500,
        tip: 4250,
        method: 'mercadopago',
        splitCount: 1,
        splitAmount: 46750,
        createdAt: '12:15',
        status: 'confirmado',
        referenceId: 'MP-98421034-BA',
      },
      {
        id: 'PAY-8902',
        orderId: 'ORD-1038',
        tableNumber: 7,
        total: 28900,
        tip: 2500,
        method: 'tarjeta',
        splitCount: 2,
        splitAmount: 15700,
        createdAt: '12:40',
        status: 'confirmado',
        referenceId: 'VISA-7712',
      },
    ];
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mesa_facil_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('mesa_facil_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('mesa_facil_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('mesa_facil_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mesa_facil_payments', JSON.stringify(payments));
  }, [payments]);

  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const newToast: ToastNotification = {
      id: 'toast-' + Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const playAudioChime = (type: 'kitchen' | 'call' | 'cash') => {
    if (type === 'kitchen') {
      playBeep(587.33, 'triangle', 0.15); // D5
      setTimeout(() => playBeep(880.0, 'sine', 0.25), 150); // A5
    } else if (type === 'call') {
      playBeep(440, 'sine', 0.2); // A4
      setTimeout(() => playBeep(659.25, 'sine', 0.3), 180); // E5
    } else if (type === 'cash') {
      playBeep(523.25, 'sine', 0.1); // C5
      setTimeout(() => playBeep(659.25, 'sine', 0.1), 100);
      setTimeout(() => playBeep(783.99, 'sine', 0.25), 200); // G5
    }
  };

  const updateConfig = (newConfig: Partial<RestaurantConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
    addToast('Configuración Actualizada', 'Los datos del restaurante se guardaron correctamente.', 'success');
  };

  // Menu functions
  const updateMenuItem = (item: MenuItem) => {
    setMenu((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    addToast('Plato Actualizado', `${item.name} modificado exitosamente.`, 'success');
  };

  const toggleItemAvailability = (id: string) => {
    setMenu((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = !m.available;
          addToast(
            updated ? 'Plato Habilitado' : 'Plato Pausado',
            `${m.name} ahora está ${updated ? 'disponible' : 'no disponible'}.`,
            updated ? 'success' : 'warning'
          );
          return { ...m, available: updated };
        }
        return m;
      })
    );
  };

  const addMenuItem = (item: MenuItem) => {
    setMenu((prev) => [item, ...prev]);
    addToast('Nuevo Plato Agregado', `${item.name} se sumó a la carta.`, 'success');
  };

  const deleteMenuItem = (id: string) => {
    const item = menu.find((m) => m.id === id);
    setMenu((prev) => prev.filter((m) => m.id !== id));
    addToast('Plato Eliminado', `${item?.name || 'El plato'} ha sido quitado de la carta.`, 'info');
  };

  // Tables functions
  const getTable = (num: number) => tables.find((t) => t.number === num);

  const updateTableStatus = (tableNum: number, status: Table['status'], guests?: number) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.number === tableNum) {
          return {
            ...t,
            status,
            guestsCount: guests !== undefined ? guests : t.guestsCount || 2,
            openedAt: t.openedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return t;
      })
    );
  };

  const closeTable = (tableNum: number) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.number === tableNum) {
          return {
            ...t,
            status: 'libre',
            guestsCount: undefined,
            openedAt: undefined,
            currentWaiterName: undefined,
          };
        }
        return t;
      })
    );
    // Mark associated orders as cobrado
    setOrders((prev) =>
      prev.map((ord) => (ord.tableNumber === tableNum ? { ...ord, status: 'cobrado', isPaid: true } : ord))
    );
    // Remove pending waiter calls
    setWaiterCalls((prev) => prev.filter((c) => c.tableNumber !== tableNum));
    addToast('Mesa Liberada', `Mesa #${tableNum} quedó libre para nuevos clientes.`, 'info');
  };

  // Order functions
  const createOrder = (tableNumber: number, rawItems: Omit<OrderItem, 'id' | 'status'>[], source: 'cliente_qr' | 'mozo') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const orderItems: OrderItem[] = rawItems.map((ri, index) => ({
      ...ri,
      id: `itm-${Date.now()}-${index}`,
      status: 'pendiente',
    }));

    const total = orderItems.reduce((acc, itm) => acc + itm.price * itm.quantity, 0);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber,
      source,
      createdAt: timeStr,
      timestamp: Date.now(),
      status: 'pendiente',
      waiterName: currentWaiter.name,
      total,
      items: orderItems,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update table status to 'esperando_pedido' or 'ocupada'
    updateTableStatus(tableNumber, 'esperando_pedido');

    // Chime kitchen
    playAudioChime('kitchen');
    addToast(
      '¡Comanda enviada a Cocina!',
      `Mesa #${tableNumber} - ${orderItems.length} producto(s) en preparación.`,
      'success'
    );

    return newOrder.id;
  };

  const updateOrderItemStatus = (orderId: string, itemId: string, newStatus: OrderItemStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedItems = ord.items.map((it) => (it.id === itemId ? { ...it, status: newStatus } : it));
          const allListo = updatedItems.every((it) => it.status === 'listo' || it.status === 'entregado');
          const allEntregado = updatedItems.every((it) => it.status === 'entregado');
          const anyPreparando = updatedItems.some((it) => it.status === 'preparando');

          let overallStatus = ord.status;
          if (allEntregado) overallStatus = 'entregado';
          else if (allListo) overallStatus = 'listo';
          else if (anyPreparando) overallStatus = 'preparando';

          return { ...ord, items: updatedItems, status: overallStatus };
        }
        return ord;
      })
    );
  };

  const markOrderReady = (orderId: string) => {
    let tableNum = 0;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          tableNum = ord.tableNumber;
          return {
            ...ord,
            status: 'listo',
            items: ord.items.map((it) => ({ ...it, status: 'listo' })),
          };
        }
        return ord;
      })
    );

    playAudioChime('call');
    addToast('¡Platos Listos en Cocina!', `Mesa #${tableNum}: Comanda ${orderId} lista para servir.`, 'alert');
  };

  const markOrderDelivered = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'entregado',
            items: ord.items.map((it) => ({ ...it, status: 'entregado' })),
          };
        }
        return ord;
      })
    );
    addToast('Comanda Servida', `Pedido ${orderId} entregado a la mesa.`, 'info');
  };

  const getTableOrders = (tableNum: number) => {
    return orders.filter((o) => o.tableNumber === tableNum && o.status !== 'cobrado');
  };

  const getTableTotal = (tableNum: number) => {
    const tableOrders = getTableOrders(tableNum);
    const table = getTable(tableNum);
    const guests = table?.guestsCount || 2;
    const subtotal = tableOrders.reduce((acc, ord) => acc + ord.total, 0);
    const coverFee = tableOrders.length > 0 ? guests * config.coverFeePerPerson : 0;
    const itemsCount = tableOrders.reduce(
      (acc, ord) => acc + ord.items.reduce((iacc, i) => iacc + i.quantity, 0),
      0
    );

    return {
      subtotal,
      coverFee,
      total: subtotal + coverFee,
      itemsCount,
    };
  };

  // Waiter calls
  const callWaiter = (tableNumber: number, type: 'mozo' | 'cuenta' = 'mozo') => {
    const now = new Date();
    const newCall: WaiterCall = {
      id: 'call-' + Date.now(),
      tableNumber,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      status: 'esperando',
      type,
    };

    setWaiterCalls((prev) => [newCall, ...prev.filter((c) => c.tableNumber !== tableNumber)]);
    playAudioChime('call');

    if (type === 'cuenta') {
      updateTableStatus(tableNumber, 'pendiente_pago');
      addToast('Solicitud de Cuenta', `Mesa #${tableNumber} ha solicitado la cuenta.`, 'alert');
    } else {
      addToast('Llamado de Mozo', `Mesa #${tableNumber} solicita atención en su mesa.`, 'alert');
    }
  };

  const respondToWaiterCall = (callId: string) => {
    setWaiterCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: 'en_camino' } : c))
    );
    addToast('Aviso Enviado al Cliente', 'Se notificó al comensal que el mozo está en camino.', 'info');
  };

  const dismissWaiterCall = (callId: string) => {
    setWaiterCalls((prev) => prev.filter((c) => c.id !== callId));
  };

  // Payments
  const recordPayment = async (payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'status'>): Promise<PaymentRecord> => {
    // Simulate payment processing
    const record: PaymentRecord = {
      ...payment,
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'confirmado',
      referenceId: payment.method === 'mercadopago' ? `MP-${Date.now().toString().slice(-8)}` : `OP-${Date.now().toString().slice(-6)}`,
    };

    setPayments((prev) => [record, ...prev]);
    playAudioChime('cash');

    // Close the table
    closeTable(payment.tableNumber);

    addToast(
      'Pago Confirmado con Éxito',
      `Mesa #${payment.tableNumber} - Total $${payment.total.toLocaleString('es-AR')} pagado por ${payment.method.toUpperCase()}.`,
      'success'
    );

    return record;
  };

  const resetDemoData = () => {
    localStorage.removeItem('mesa_facil_config');
    localStorage.removeItem('mesa_facil_menu');
    localStorage.removeItem('mesa_facil_tables');
    localStorage.removeItem('mesa_facil_orders');
    localStorage.removeItem('mesa_facil_payments');
    setConfig({
      restaurantName: 'La Cabaña Gourmet',
      tagline: 'Parrilla & Cocina Criolla Contemporánea',
      coverFeePerPerson: 1200,
      currentShift: 'Cena',
      currency: 'ARS',
      taxRatePercent: 21,
    });
    setMenu(INITIAL_MENU);
    setTables(INITIAL_TABLES);
    setOrders(INITIAL_ORDERS);
    setPayments([]);
    setWaiterCalls([]);
    addToast('Datos Restaurados', 'Se reinició el prototipo con los datos de fábrica.', 'info');
  };

  return (
    <RestaurantContext.Provider
      value={{
        config,
        updateConfig,
        isOnline,
        setIsOnline,
        activeRole,
        setActiveRole,
        clientTableNumber,
        setClientTableNumber,
        currentWaiter,
        setCurrentWaiter,
        menu,
        updateMenuItem,
        toggleItemAvailability,
        addMenuItem,
        deleteMenuItem,
        tables,
        getTable,
        updateTableStatus,
        closeTable,
        orders,
        createOrder,
        updateOrderItemStatus,
        markOrderReady,
        markOrderDelivered,
        getTableOrders,
        getTableTotal,
        waiterCalls,
        callWaiter,
        respondToWaiterCall,
        dismissWaiterCall,
        waiters,
        payments,
        recordPayment,
        toasts,
        dismissToast,
        playAudioChime,
        resetDemoData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
