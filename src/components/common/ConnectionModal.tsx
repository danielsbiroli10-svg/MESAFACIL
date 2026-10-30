import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export const ConnectionModal: React.FC = () => {
  const { isOnline, setIsOnline } = useRestaurant();

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-rose-500/50 max-w-md w-full rounded-3xl p-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <WifiOff className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
          Fallo de Red Local
        </span>
        <h3 className="text-xl font-bold text-white mt-1">
          Conexión Perdida con el Servidor
        </h3>
        
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          No se ha podido sincronizar con el sistema central del restaurante. Los pedidos en curso se guardan de forma segura en la memoria de este dispositivo (Modo Offline Seguro) y se enviarán al reconectar.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Reintentando conexión automática cada 5 segundos...</span>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setIsOnline(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Restablecer Conexión (Reintentar Ahora)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
