import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CategoryType, MenuItem, Table } from '../../types/restaurant';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  UtensilsCrossed, 
  QrCode, 
  Settings, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Printer, 
  Search,
  Download,
  Building,
  UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    config, 
    updateConfig, 
    menu, 
    updateMenuItem, 
    toggleItemAvailability, 
    addMenuItem, 
    deleteMenuItem,
    tables, 
    orders, 
    payments, 
    waiters 
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'kpis' | 'menu' | 'mesas' | 'mozos' | 'config'>('kpis');

  // Menu editor states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCat, setMenuFilterCat] = useState<string>('todas');

  // QR Modal for table printing
  const [qrModalTable, setQrModalTable] = useState<Table | null>(null);

  // New Dish Form State
  const [newDishForm, setNewDishForm] = useState<Partial<MenuItem>>({
    name: '',
    category: 'principales',
    description: '',
    price: 15000,
    image: '/src/assets/images/bife_de_chorizo_1793394746037.jpg',
    available: true,
    preparationTimeMinutes: 15,
  });

  // Calculate KPIs
  const totalSalesFromPayments = payments.reduce((acc, p) => acc + p.total, 0);
  const estimatedDaySales = 482500 + totalSalesFromPayments;
  const almuerzoSales = Math.round(estimatedDaySales * 0.42);
  const cenaSales = estimatedDaySales - almuerzoSales;
  const occupiedCount = tables.filter((t) => t.status !== 'libre').length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'cobrado' && o.status !== 'entregado').length;

  // Top selling dishes (mock count + live)
  const topDishes = [
    { name: 'Bife de Chorizo Especial (450g)', category: 'Carnes', salesCount: 42, revenue: 777000 },
    { name: 'Empanadas Salteñas al Horno', category: 'Entradas', salesCount: 88, revenue: 281600 },
    { name: 'Sorrentinos Caseros de Espinaca', category: 'Pastas', salesCount: 36, revenue: 500400 },
    { name: 'Flan Casero con Dulce de Leche', category: 'Postres', salesCount: 51, revenue: 275400 },
    { name: 'Pizza Napoletana a la Piedra', category: 'Pizzas', salesCount: 29, revenue: 371200 },
  ];

  const handleSaveEditItem = () => {
    if (!editingItem) return;
    updateMenuItem(editingItem);
    setEditingItem(null);
  };

  const handleCreateNewDish = () => {
    if (!newDishForm.name) return;
    const item: MenuItem = {
      id: `dish-${Date.now()}`,
      name: newDishForm.name,
      category: newDishForm.category as CategoryType || 'principales',
      description: newDishForm.description || '',
      price: Number(newDishForm.price) || 10000,
      image: newDishForm.image || '/src/assets/images/bife_de_chorizo_1793394746037.jpg',
      available: true,
      preparationTimeMinutes: Number(newDishForm.preparationTimeMinutes) || 15,
    };
    addMenuItem(item);
    setIsAddingNewItem(false);
    setNewDishForm({
      name: '',
      category: 'principales',
      description: '',
      price: 15000,
      image: '/src/assets/images/bife_de_chorizo_1793394746037.jpg',
      available: true,
      preparationTimeMinutes: 15,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-[90vh]">
      {/* Admin Title & Tab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Módulo Gerencial & Administración
            </span>
            <span className="text-xs text-slate-400">· {config.restaurantName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Panel del Administrador</h1>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'kpis' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Métricas & Ventas
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'menu' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gestión del Menú ({menu.length})
          </button>
          <button
            onClick={() => setActiveTab('mesas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'mesas' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mesas & QR ({tables.length})
          </button>
          <button
            onClick={() => setActiveTab('mozos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'mozos' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipo Mozos ({waiters.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'config' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Restaurante
          </button>
        </div>
      </div>

      {/* TAB 1: KPIS & VENTAS */}
      {activeTab === 'kpis' && (
        <div className="mt-6 space-y-6">
          {/* 4 Primary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Ventas Totales Hoy</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ${estimatedDaySales.toLocaleString('es-AR')} <span className="text-xs font-normal text-slate-400">ARS</span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs mismo día semana pasada
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Ventas por Turno</span>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-sm font-bold text-white flex justify-between">
                <span>Almuerzo:</span>
                <span className="font-mono text-slate-300">${almuerzoSales.toLocaleString('es-AR')}</span>
              </div>
              <div className="text-sm font-bold text-white flex justify-between mt-1">
                <span>Cena (en curso):</span>
                <span className="font-mono text-emerald-400">${cenaSales.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Ocupación de Salón</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {occupiedCount} / {tables.length} <span className="text-xs font-normal text-slate-400">mesas</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {Math.round((occupiedCount / tables.length) * 100)}% de ocupación actual
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Tiempos de Cocina</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                14.2 <span className="text-xs font-normal text-slate-400">minutos promedio</span>
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
                -3.5 min de rotación gracias a comanda QR
              </span>
            </div>
          </div>

          {/* Top Selling Dishes Ranking */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              Platos Más Vendidos del Mes
            </h3>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Ranking</th>
                    <th className="py-3 px-4 font-semibold">Plato</th>
                    <th className="py-3 px-4 font-semibold">Categoría</th>
                    <th className="py-3 px-4 font-semibold text-center">Unidades Vendidas</th>
                    <th className="py-3 px-4 font-semibold text-right">Recaudación (ARS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {topDishes.map((dish, i) => (
                    <tr key={dish.name} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold font-mono text-emerald-400">
                        #{i + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {dish.name}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {dish.category}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-200">
                        {dish.salesCount} u.
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        ${dish.revenue.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTIÓN DEL MENÚ & PRECIOS */}
      {activeTab === 'menu' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar plato o categoría..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={menuFilterCat}
                onChange={(e) => setMenuFilterCat(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="todas">Todas las categorías</option>
                <option value="entradas">Entradas</option>
                <option value="carnes">Carnes</option>
                <option value="principales">Principales</option>
                <option value="pastas">Pastas</option>
                <option value="pizzas">Pizzas</option>
                <option value="ensaladas">Ensaladas</option>
                <option value="postres">Postres</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddingNewItem(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Plato</span>
            </button>
          </div>

          {/* Dishes Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Foto</th>
                    <th className="py-3 px-4 font-semibold">Nombre del Plato</th>
                    <th className="py-3 px-4 font-semibold">Categoría</th>
                    <th className="py-3 px-4 font-semibold text-right">Precio Actual</th>
                    <th className="py-3 px-4 font-semibold text-center">Estado</th>
                    <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {menu
                    .filter((m) => {
                      const matchCat = menuFilterCat === 'todas' || m.category === menuFilterCat;
                      const matchSearch = m.name.toLowerCase().includes(menuSearch.toLowerCase());
                      return matchCat && matchSearch;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-10 object-cover rounded-lg border border-slate-800"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {item.description}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 capitalize">
                          {item.category}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                          ${item.price.toLocaleString('es-AR')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                              item.available
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {item.available ? 'Disponible' : 'Pausado'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                            title="Editar plato y precio"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg"
                            title="Eliminar plato"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MESAS & GENERADOR DE QR */}
      {activeTab === 'mesas' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Mapa de Mesas y Códigos QR para Imprimir
            </h3>
            <span className="text-xs text-slate-400">
              Cada mesa posee su URL y QR único para detección automática
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.number}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-black text-white font-mono">
                      Mesa #{table.number}
                    </span>
                    <span className="text-xs text-slate-400">{table.zone}</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Capacidad: {table.capacity} comensales
                  </p>
                  <p className="text-xs text-emerald-400 mt-1">
                    Mozo actual: {table.currentWaiterName || 'Automático'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setQrModalTable(table)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Ver QR de Mesa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MOZOS */}
      {activeTab === 'mozos' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {waiters.map((w) => (
            <div
              key={w.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-start gap-4"
            >
              <img
                src={w.avatar}
                alt={w.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50"
              />
              <div className="flex-1">
                <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider">
                  Turno {w.shift}
                </span>
                <h4 className="text-lg font-bold text-white">{w.name}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mesas Asignadas: {w.assignedTables.map((t) => `Mesa ${t}`).join(', ')}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    En servicio activo
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: RESTAURANTE CONFIG */}
      {activeTab === 'config' && (
        <div className="mt-6 max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Configuración del Establecimiento</h3>
          <p className="text-xs text-slate-400">
            Personaliza el nombre, el valor del cubierto y el turno activo para adaptar Mesa Fácil a cualquier restaurante.
          </p>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">
              Nombre del Restaurante
            </label>
            <input
              type="text"
              value={config.restaurantName}
              onChange={(e) => updateConfig({ restaurantName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">
              Eslogan o Subtítulo
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => updateConfig({ tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">
              Servicio de Mesa / Cubierto por Persona (ARS)
            </label>
            <input
              type="number"
              value={config.coverFeePerPerson}
              onChange={(e) => updateConfig({ coverFeePerPerson: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">
              Turno en Operación
            </label>
            <div className="flex gap-2">
              {(['Almuerzo', 'Cena'] as const).map((shift) => (
                <button
                  key={shift}
                  type="button"
                  onClick={() => updateConfig({ currentShift: shift })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    config.currentShift === shift
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Dish Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-3">Editar Plato & Precio</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Precio (ARS)</label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descripción</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditItem}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {isAddingNewItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-3">Nuevo Plato al Menú</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nombre del Plato</label>
                <input
                  type="text"
                  placeholder="Ej: Ojo de Bife Madurado"
                  value={newDishForm.name}
                  onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Categoría</label>
                <select
                  value={newDishForm.category}
                  onChange={(e) => setNewDishForm({ ...newDishForm, category: e.target.value as CategoryType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="entradas">Entradas</option>
                  <option value="carnes">Carnes</option>
                  <option value="principales">Principales</option>
                  <option value="pastas">Pastas</option>
                  <option value="pizzas">Pizzas</option>
                  <option value="ensaladas">Ensaladas</option>
                  <option value="postres">Postres</option>
                  <option value="bebidas">Bebidas</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Precio en Pesos Argentinos (ARS)</label>
                <input
                  type="number"
                  value={newDishForm.price}
                  onChange={(e) => setNewDishForm({ ...newDishForm, price: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descripción</label>
                <textarea
                  placeholder="Ingredientes, preparación y detalles..."
                  value={newDishForm.description}
                  onChange={(e) => setNewDishForm({ ...newDishForm, description: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setIsAddingNewItem(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNewDish}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
              >
                Crear y Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal for Printing */}
      {qrModalTable && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-sm w-full rounded-3xl p-6 text-center shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {config.restaurantName}
            </span>
            <h3 className="text-2xl font-black mt-1">
              Mesa #{qrModalTable.number}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Escaneá para ver la carta digital y enviar tu comanda a cocina
            </p>

            {/* Stylized QR Card for physical table display */}
            <div className="my-5 p-4 border-2 border-slate-900 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-white p-3 border-2 border-slate-800 rounded-xl flex items-center justify-center">
                <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1.5 p-1 bg-white">
                  <div className="bg-slate-950 col-span-2 row-span-2 rounded" />
                  <div className="bg-emerald-600" />
                  <div className="bg-slate-950 col-span-2 row-span-2 rounded" />
                  <div className="bg-slate-950" />
                  <div className="bg-slate-950 col-span-2" />
                  <div className="bg-slate-950 col-span-2 row-span-2 rounded" />
                  <div className="bg-slate-950" />
                  <div className="bg-emerald-600 col-span-2" />
                  <div className="bg-slate-950" />
                  <div className="bg-slate-950 col-span-2" />
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold mt-2 text-slate-600">
                mesafacil.app/qr/m{qrModalTable.number}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir QR</span>
              </button>
              <button
                onClick={() => setQrModalTable(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
