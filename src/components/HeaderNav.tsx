import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  QrCode, 
  UserCheck, 
  ChefHat, 
  CreditCard, 
  BarChart3, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Tablet, 
  Monitor,
  RotateCcw
} from 'lucide-react';

interface HeaderNavProps {
  deviceMode: 'mobile' | 'tablet' | 'desktop' | 'auto';
  setDeviceMode: (mode: 'mobile' | 'tablet' | 'desktop' | 'auto') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ deviceMode, setDeviceMode }) => {
  const { 
    activeRole, 
    setActiveRole, 
    clientTableNumber, 
    setClientTableNumber, 
    tables,
    isOnline, 
    setIsOnline,
    resetDemoData,
    waiterCalls,
    orders
  } = useRestaurant();

  const pendingCallsCount = waiterCalls.filter(c => c.status === 'esperando').length;
  const kitchenPendingOrders = orders.filter(o => o.status === 'pendiente' || o.status === 'preparando').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1, 2, 3 Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold text-slate-950 text-lg">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Mesa Fácil
          </span>
          <span className="hidden sm:inline-block text-[11px] font-medium uppercase tracking-wider text-emerald-400/90 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
            Gourmet POS
          </span>
        </div>

        {/* Zone 2: Navigation Links (5 Main Screens) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveRole('cliente')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeRole === 'cliente'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Carta QR Cliente
          </button>

          <button
            onClick={() => setActiveRole('mozo')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeRole === 'mozo'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Panel Mozos
            {pendingCallsCount > 0 && (
              <span className="w-4 h-4 bg-amber-500 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center">
                {pendingCallsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveRole('cocina')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeRole === 'cocina'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            Cocina KDS
            {kitchenPendingOrders > 0 && (
              <span className="w-4 h-4 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center">
                {kitchenPendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveRole('caja')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeRole === 'caja'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Caja & Cobros
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeRole === 'admin'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Administración
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick connection toggle button */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            title={isOnline ? 'Simular corte de conexión' : 'Restablecer conexión'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              isOnline
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sin Conexión</span>
              </>
            )}
          </button>

          {/* Reset Demo State button */}
          <button
            onClick={resetDemoData}
            title="Reiniciar datos de demostración"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-bar for Mobile Navigation tabs & Simulation Controls */}
      <div className="bg-slate-900/60 border-t border-slate-800/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Mobile Role Switcher (Visible on small screens) */}
          <div className="flex lg:hidden overflow-x-auto gap-1 py-0.5 no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setActiveRole('cliente')}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                activeRole === 'cliente' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Carta QR
            </button>
            <button
              onClick={() => setActiveRole('mozo')}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                activeRole === 'mozo' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Mozos {pendingCallsCount > 0 && `(${pendingCallsCount})`}
            </button>
            <button
              onClick={() => setActiveRole('cocina')}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                activeRole === 'cocina' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Cocina {kitchenPendingOrders > 0 && `(${kitchenPendingOrders})`}
            </button>
            <button
              onClick={() => setActiveRole('caja')}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                activeRole === 'caja' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Caja
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                activeRole === 'admin' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Contextual Table Switcher (when in client mode) */}
          {activeRole === 'cliente' && (
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400">Simular escaneo de mesa:</span>
              <select
                value={clientTableNumber}
                onChange={(e) => setClientTableNumber(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-emerald-400 font-semibold rounded-md px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
              >
                {tables.map((tbl) => (
                  <option key={tbl.number} value={tbl.number}>
                    Mesa #{tbl.number} ({tbl.zone} · {tbl.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Device Preview Mode Selector */}
          <div className="hidden sm:flex items-center gap-1.5 ml-auto text-slate-400">
            <span className="text-[11px] mr-1">Vista Previa:</span>
            <button
              onClick={() => setDeviceMode('auto')}
              className={`p-1.5 rounded hover:text-white transition-colors ${deviceMode === 'auto' ? 'bg-slate-800 text-emerald-400' : ''}`}
              title="Ajuste automático a la pantalla"
            >
              <span className="text-[11px] font-medium px-1">Auto</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded hover:text-white transition-colors ${deviceMode === 'mobile' ? 'bg-slate-800 text-emerald-400' : ''}`}
              title="Simulador Celular (Android / iPhone)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded hover:text-white transition-colors ${deviceMode === 'tablet' ? 'bg-slate-800 text-emerald-400' : ''}`}
              title="Simulador Tablet (Ideal Cocina / Mozos)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded hover:text-white transition-colors ${deviceMode === 'desktop' ? 'bg-slate-800 text-emerald-400' : ''}`}
              title="Simulador Monitor (Ideal Caja / Admin)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
