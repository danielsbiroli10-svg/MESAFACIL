/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { HeaderNav } from './components/HeaderNav';
import { ClientDigitalMenu } from './components/client/ClientDigitalMenu';
import { WaiterPanel } from './components/waiter/WaiterPanel';
import { KitchenKDS } from './components/kitchen/KitchenKDS';
import { CashierPanel } from './components/cashier/CashierPanel';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/common/ToastContainer';
import { ConnectionModal } from './components/common/ConnectionModal';
import { DeviceFrame } from './components/common/DeviceFrame';

const MainAppContent: React.FC = () => {
  const { activeRole, config } = useRestaurant();
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop' | 'auto'>('auto');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <HeaderNav deviceMode={deviceMode} setDeviceMode={setDeviceMode} />

      {/* Viewport Frame (Auto or Simulated Smartphone/Tablet/Monitor) */}
      <div className="flex-1">
        <DeviceFrame mode={deviceMode}>
          {activeRole === 'cliente' && <ClientDigitalMenu />}
          {activeRole === 'mozo' && <WaiterPanel />}
          {activeRole === 'cocina' && <KitchenKDS />}
          {activeRole === 'caja' && <CashierPanel />}
          {activeRole === 'admin' && <AdminDashboard />}
        </DeviceFrame>
      </div>

      {/* Global Notifications and Modal Overlays */}
      <ToastContainer />
      <ConnectionModal />

      {/* Quiet Corporate Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 {config.restaurantName} · Desarrollado con <strong>Mesa Fácil</strong> Sistema Gastronómico
          </span>
          <span className="text-[11px] text-slate-500">
            Optimizando tiempos de atención en salón, comandas y cobros en Argentina
          </span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainAppContent />
    </RestaurantProvider>
  );
}
