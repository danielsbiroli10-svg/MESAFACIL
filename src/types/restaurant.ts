export type CategoryType = 
  | 'entradas' 
  | 'principales' 
  | 'pastas' 
  | 'carnes' 
  | 'pizzas' 
  | 'ensaladas' 
  | 'postres' 
  | 'bebidas';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  price: number; // In ARS
  image: string;
  available: boolean;
  preparationTimeMinutes: number;
  tags?: string[];
  customizations?: {
    name: string;
    options: { label: string; priceDelta: number }[];
  }[];
}

export type TableStatus = 'libre' | 'ocupada' | 'esperando_pedido' | 'pendiente_pago';

export interface Table {
  id: number;
  number: number;
  capacity: number;
  zone: 'Salón Principal' | 'Patio / Terraza' | 'Barra';
  status: TableStatus;
  currentWaiterId?: string;
  currentWaiterName?: string;
  guestsCount?: number;
  openedAt?: string;
}

export type OrderItemStatus = 'pendiente' | 'preparando' | 'listo' | 'entregado';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: string[];
  notes?: string;
  status: OrderItemStatus;
}

export type OrderSource = 'cliente_qr' | 'mozo';
export type OrderState = 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cobrado';

export interface Order {
  id: string;
  tableNumber: number;
  source: OrderSource;
  createdAt: string; // ISO or HH:mm
  timestamp: number; // ms
  items: OrderItem[];
  total: number;
  status: OrderState;
  waiterName?: string;
  isPaid?: boolean;
}

export interface WaiterCall {
  id: string;
  tableNumber: number;
  time: string;
  timestamp: number;
  status: 'esperando' | 'en_camino' | 'atendido';
  type: 'mozo' | 'cuenta';
}

export interface WaiterStaff {
  id: string;
  name: string;
  shift: 'Almuerzo' | 'Cena';
  assignedTables: number[];
  activeOrdersCount: number;
  avatar: string;
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'mercadopago';

export interface PaymentRecord {
  id: string;
  orderId: string;
  tableNumber: number;
  total: number;
  tip: number;
  method: PaymentMethod;
  splitCount: number;
  splitAmount: number;
  createdAt: string;
  status: 'confirmado' | 'procesando' | 'fallido';
  referenceId?: string;
}
