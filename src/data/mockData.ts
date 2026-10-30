import { MenuItem, Table, WaiterStaff, Order } from '../types/restaurant';

export const INITIAL_MENU: MenuItem[] = [
  // Entradas
  {
    id: 'ent-1',
    name: 'Empanadas Salteñas al Horno',
    category: 'entradas',
    description: 'Empanadas tradicionales de lomo cortado a cuchillo, papa, cebolla de verdeo y especias criollas. Servidas con gajos de limón y salsa criolla.',
    price: 3200,
    image: '/src/assets/images/empanadas_saltenas_1793394746443.jpg',
    available: true,
    preparationTimeMinutes: 10,
    tags: ['Especialidad', 'Casero'],
    customizations: [
      {
        name: 'Variedad',
        options: [
          { label: 'Carne a Cuchillo Picante', priceDelta: 0 },
          { label: 'Carne Suave', priceDelta: 0 },
          { label: 'Jamón y Queso Ahumado', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'ent-2',
    name: 'Provoleta Rústica al Oreganato',
    category: 'entradas',
    description: 'Queso provolone fundido a la chapa con mix de orégano serrano, ají molido y un toque de aceite de oliva extra virgen de Mendoza.',
    price: 7800,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 12,
    tags: ['Apto Celíaco'],
    customizations: [
      {
        name: 'Topping Opcional',
        options: [
          { label: 'Tradicional', priceDelta: 0 },
          { label: 'Con Tomates Secos y Rúcula', priceDelta: 950 },
          { label: 'Con Panceta Crocante', priceDelta: 1200 },
        ],
      },
    ],
  },
  {
    id: 'ent-3',
    name: 'Papas Rústicas con Cheddar y Verdeo',
    category: 'entradas',
    description: 'Papas doble cocción con cáscara, bañadas en queso cheddar fundido, verdeo fresco picado y panceta crocante.',
    price: 6900,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 15,
  },

  // Carnes
  {
    id: 'car-1',
    name: 'Bife de Chorizo Especial (450g)',
    category: 'carnes',
    description: 'Corte premium de novillo pampeano a las brasas, sellado a fuego vivo con chimichurri casero y papas cuña perfumadas al romero.',
    price: 18500,
    image: '/src/assets/images/bife_de_chorizo_1793394746037.jpg',
    available: true,
    preparationTimeMinutes: 20,
    tags: ['Recomendado del Chef', 'Sin TACC'],
    customizations: [
      {
        name: 'Punto de la carne',
        options: [
          { label: 'Jugoso (vuelta y vuelta)', priceDelta: 0 },
          { label: 'A Punto (rosado al centro)', priceDelta: 0 },
          { label: 'Cocido (bien dorado)', priceDelta: 0 },
        ],
      },
      {
        name: 'Guarnición',
        options: [
          { label: 'Papas Rústicas al Romero', priceDelta: 0 },
          { label: 'Puré de Papas Cremoso', priceDelta: 0 },
          { label: 'Mix de Hojas Verdes y Parmesano', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'car-2',
    name: 'Ojo de Bife con Manteca de Hierbas',
    category: 'carnes',
    description: 'Corte tierno y jugoso con corazón de grasa que otorga un sabor inigualable. Acompañado de batatas glaseadas y ensalada criolla.',
    price: 19800,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 22,
    customizations: [
      {
        name: 'Punto de Cocción',
        options: [
          { label: 'A Punto', priceDelta: 0 },
          { label: 'Jugoso', priceDelta: 0 },
          { label: 'Bien Cocido', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'car-3',
    name: 'Milanesa de Lomo a la Napolitana XL',
    category: 'principales',
    description: 'Generosa milanesa de lomo rebozada en pan rallado casero, salsa pomodoro, mozzarella derretida, jamón cocido y orégano. Para compartir.',
    price: 16400,
    image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 18,
    tags: ['Para Compartir'],
    customizations: [
      {
        name: 'Guarnición',
        options: [
          { label: 'Papas Fritas a Caballo (+2 huevos)', priceDelta: 1200 },
          { label: 'Papas Fritas Clásicas', priceDelta: 0 },
          { label: 'Ensalada Mixta', priceDelta: 0 },
        ],
      },
    ],
  },

  // Pastas
  {
    id: 'pas-1',
    name: 'Sorrentinos Caseros de Espinaca y Ricota',
    category: 'pastas',
    description: 'Pasta rellena artesanal elaborada en el día con ricota fresca de campo, espinacas salteadas y nuez moscada, con salsa pomodoro suave y queso parmesano rallado.',
    price: 13900,
    image: '/src/assets/images/sorrentinos_espinaca_1793394747653.jpg',
    available: true,
    preparationTimeMinutes: 16,
    tags: ['Vegetariano', 'Pasta Casera'],
    customizations: [
      {
        name: 'Elección de Salsa',
        options: [
          { label: 'Pomodoro con Albahaca Fresca', priceDelta: 0 },
          { label: 'Crema de Hongos de Pino', priceDelta: 1100 },
          { label: 'Salsa Rosa Clásica', priceDelta: 500 },
          { label: 'Bolognesa de Ternera', priceDelta: 900 },
        ],
      },
    ],
  },
  {
    id: 'pas-2',
    name: 'Tagliatelle al Huevo con Estofado de Lomo',
    category: 'pastas',
    description: 'Cintas al huevo caseras con cocción lenta de ternera en reducción de vino tinto y tomates maduros.',
    price: 14600,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281261?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 15,
  },

  // Pizzas
  {
    id: 'piz-1',
    name: 'Pizza Napoletana Margherita a la Piedra',
    category: 'pizzas',
    description: 'Masa de fermentación lenta (48h), salsa de tomate italiano San Marzano, mozzarella fior di latte, rodajas de tomate fresco, aceitunas verdes y orégano silvestre.',
    price: 12800,
    image: '/src/assets/images/pizza_napoletana_1793394747555.jpg',
    available: true,
    preparationTimeMinutes: 14,
    tags: ['Masa Madre'],
    customizations: [
      {
        name: 'Extras opcionales',
        options: [
          { label: 'Sin extras', priceDelta: 0 },
          { label: 'Agregar Jamón Crudo Serrano', priceDelta: 2400 },
          { label: 'Doble Muzzarella', priceDelta: 1500 },
        ],
      },
    ],
  },
  {
    id: 'piz-2',
    name: 'Fugazzeta Rellena con Mucha Cebolla',
    category: 'pizzas',
    description: 'Clásico porteño con 500g de mozzarella en el corazón de la masa, cubierta con abundante cebolla caramelizada, orégano y un toque de parmesano gratinado.',
    price: 14200,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 18,
  },

  // Ensaladas
  {
    id: 'ens-1',
    name: 'Ensalada César Premium',
    category: 'ensaladas',
    description: 'Corazones de lechuga capuchina crujiente, pechuga de pollo marinada a las brasas, crutones de pan de campo al ajo, escamas de queso sardo y aderezo césar suave.',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 10,
    tags: ['Saludable'],
    customizations: [
      {
        name: 'Proteína',
        options: [
          { label: 'Pollo Grillé a las Brasas', priceDelta: 0 },
          { label: 'Langostinos Salteados al Ajillo', priceDelta: 3100 },
          { label: 'Vegetariana (palta extra)', priceDelta: 600 },
        ],
      },
    ],
  },

  // Postres
  {
    id: 'pos-1',
    name: 'Flan Casero con Dulce de Leche y Crema',
    category: 'postres',
    description: 'Auténtico flan de 12 huevos con caramelo artesanal dorado, servido con generosa cucharada de dulce de leche colonial argentino y crema chantilly batida a mano.',
    price: 5400,
    image: '/src/assets/images/flan_dulce_de_leche_1793394747584.jpg',
    available: true,
    preparationTimeMinutes: 6,
    tags: ['El Más Pedido', 'Postre Patrio'],
    customizations: [
      {
        name: 'Acompañamiento',
        options: [
          { label: 'Mixto (Dulce de Leche + Crema)', priceDelta: 0 },
          { label: 'Solo Dulce de Leche Colonial', priceDelta: 0 },
          { label: 'Solo Crema Chantilly', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'pos-2',
    name: 'Tiramisú al Mascarpone y Café Espresso',
    category: 'postres',
    description: 'Vainillas embebidas en café espresso arábico y licor amaretto, intercaladas con crema suave de mascarpone y espolvoreadas con cacao amargo belga.',
    price: 6100,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 5,
  },

  // Bebidas
  {
    id: 'beb-1',
    name: 'Copa de Malbec Reserva Valle de Uco',
    category: 'bebidas',
    description: 'Vino tinto de altura con notas a frutos rojos maduros, violetas y roble francés. Servido a temperatura óptima de cava (16°C).',
    price: 4900,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 3,
  },
  {
    id: 'beb-2',
    name: 'Cerveza Patagonia Amber Lager (Pinta 500ml)',
    category: 'bebidas',
    description: 'Cerveza artesanal de color ámbar rojizo con sutil sabor a caramelo y lúpulo patagónico aromático.',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1608270119332-9cb525983842?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 3,
  },
  {
    id: 'beb-3',
    name: 'Limonada con Menta y Jengibre (Jarra 1L)',
    category: 'bebidas',
    description: 'Jugo natural de limones recién exprimidos, hojas de menta del huerto, láminas de jengibre y hielo picado.',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 5,
  },
  {
    id: 'beb-4',
    name: 'Agua Mineral Villavicencio (500ml)',
    category: 'bebidas',
    description: 'Agua de manantial natural de los Andes argentinos, con o sin gas.',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 2,
    customizations: [
      {
        name: 'Variante',
        options: [
          { label: 'Sin Gas', priceDelta: 0 },
          { label: 'Con Gas', priceDelta: 0 },
        ],
      },
    ],
  },
];

export const INITIAL_TABLES: Table[] = [
  { id: 1, number: 1, capacity: 2, zone: 'Salón Principal', status: 'libre' },
  { id: 2, number: 2, capacity: 4, zone: 'Salón Principal', status: 'libre' },
  { id: 3, number: 3, capacity: 4, zone: 'Salón Principal', status: 'ocupada', currentWaiterId: 'w-1', currentWaiterName: 'Martín Gómez', guestsCount: 3, openedAt: '13:10' },
  { id: 4, number: 4, capacity: 4, zone: 'Salón Principal', status: 'esperando_pedido', currentWaiterId: 'w-1', currentWaiterName: 'Martín Gómez', guestsCount: 2, openedAt: '13:25' },
  { id: 5, number: 5, capacity: 6, zone: 'Patio / Terraza', status: 'ocupada', currentWaiterId: 'w-2', currentWaiterName: 'Lucía Fernández', guestsCount: 5, openedAt: '12:50' },
  { id: 6, number: 6, capacity: 2, zone: 'Patio / Terraza', status: 'pendiente_pago', currentWaiterId: 'w-1', currentWaiterName: 'Martín Gómez', guestsCount: 2, openedAt: '12:30' },
  { id: 7, number: 7, capacity: 4, zone: 'Patio / Terraza', status: 'libre' },
  { id: 8, number: 8, capacity: 8, zone: 'Salón Principal', status: 'libre' },
  { id: 9, number: 9, capacity: 2, zone: 'Barra', status: 'ocupada', currentWaiterId: 'w-2', currentWaiterName: 'Lucía Fernández', guestsCount: 1, openedAt: '13:40' },
  { id: 10, number: 10, capacity: 2, zone: 'Barra', status: 'libre' },
];

export const INITIAL_WAITERS: WaiterStaff[] = [
  {
    id: 'w-1',
    name: 'Martín Gómez',
    shift: 'Almuerzo',
    assignedTables: [1, 2, 3, 4, 6],
    activeOrdersCount: 3,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'w-2',
    name: 'Lucía Fernández',
    shift: 'Almuerzo',
    assignedTables: [5, 7, 8, 9, 10],
    activeOrdersCount: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    tableNumber: 4,
    source: 'cliente_qr',
    createdAt: '13:28',
    timestamp: Date.now() - 14 * 60 * 1000, // 14 mins ago
    status: 'preparando',
    waiterName: 'Martín Gómez',
    total: 35600,
    items: [
      {
        id: 'item-1',
        menuItemId: 'car-1',
        name: 'Bife de Chorizo Especial (450g)',
        price: 18500,
        quantity: 1,
        selectedOptions: ['A Punto (rosado al centro)', 'Papas Rústicas al Romero'],
        notes: 'Sin chimichurri, traer salsa aparte por favor',
        status: 'preparando',
      },
      {
        id: 'item-2',
        menuItemId: 'pas-1',
        name: 'Sorrentinos Caseros de Espinaca y Ricota',
        price: 13900,
        quantity: 1,
        selectedOptions: ['Pomodoro con Albahaca Fresca'],
        notes: 'Queso rallado extra bien cargado',
        status: 'preparando',
      },
      {
        id: 'item-3',
        menuItemId: 'beb-1',
        name: 'Copa de Malbec Reserva Valle de Uco',
        price: 4900,
        quantity: 2,
        selectedOptions: [],
        status: 'listo',
      },
    ],
  },
  {
    id: 'ORD-1041',
    tableNumber: 3,
    source: 'mozo',
    createdAt: '13:15',
    timestamp: Date.now() - 25 * 60 * 1000, // 25 mins ago
    status: 'entregado',
    waiterName: 'Martín Gómez',
    total: 31800,
    items: [
      {
        id: 'item-4',
        menuItemId: 'ent-1',
        name: 'Empanadas Salteñas al Horno',
        price: 3200,
        quantity: 3,
        selectedOptions: ['Carne a Cuchillo Picante'],
        notes: '',
        status: 'entregado',
      },
      {
        id: 'item-5',
        menuItemId: 'piz-1',
        name: 'Pizza Napoletana Margherita a la Piedra',
        price: 12800,
        quantity: 1,
        selectedOptions: ['Doble Muzzarella'],
        notes: 'Bien cocida la masa',
        status: 'entregado',
      },
      {
        id: 'item-6',
        menuItemId: 'beb-3',
        name: 'Limonada con Menta y Jengibre (Jarra 1L)',
        price: 5200,
        quantity: 1,
        status: 'entregado',
      },
    ],
  },
  {
    id: 'ORD-1040',
    tableNumber: 6,
    source: 'cliente_qr',
    createdAt: '12:45',
    timestamp: Date.now() - 48 * 60 * 1000,
    status: 'entregado',
    waiterName: 'Martín Gómez',
    total: 39600,
    items: [
      {
        id: 'item-7',
        menuItemId: 'car-2',
        name: 'Ojo de Bife con Manteca de Hierbas',
        price: 19800,
        quantity: 1,
        selectedOptions: ['A Punto'],
        status: 'entregado',
      },
      {
        id: 'item-8',
        menuItemId: 'car-3',
        name: 'Milanesa de Lomo a la Napolitana XL',
        price: 16400,
        quantity: 1,
        selectedOptions: ['Papas Fritas Clásicas'],
        status: 'entregado',
      },
      {
        id: 'item-9',
        menuItemId: 'pos-1',
        name: 'Flan Casero con Dulce de Leche y Crema',
        price: 5400,
        quantity: 1,
        selectedOptions: ['Mixto (Dulce de Leche + Crema)'],
        status: 'entregado',
      },
    ],
  },
  {
    id: 'ORD-1043',
    tableNumber: 5,
    source: 'mozo',
    createdAt: '13:38',
    timestamp: Date.now() - 5 * 60 * 1000,
    status: 'pendiente',
    waiterName: 'Lucía Fernández',
    total: 24700,
    items: [
      {
        id: 'item-10',
        menuItemId: 'ent-2',
        name: 'Provoleta Rústica al Oreganato',
        price: 7800,
        quantity: 1,
        selectedOptions: ['Con Tomates Secos y Rúcula'],
        notes: 'Sacar rápido para empezar',
        status: 'pendiente',
      },
      {
        id: 'item-11',
        menuItemId: 'car-1',
        name: 'Bife de Chorizo Especial (450g)',
        price: 18500,
        quantity: 1,
        selectedOptions: ['Jugoso (vuelta y vuelta)', 'Puré de Papas Cremoso'],
        status: 'pendiente',
      },
    ],
  },
];
