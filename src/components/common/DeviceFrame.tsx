import React, { ReactNode } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface DeviceFrameProps {
  mode: 'mobile' | 'tablet' | 'desktop' | 'auto';
  children: ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ mode, children }) => {
  if (mode === 'auto') {
    return <>{children}</>;
  }

  if (mode === 'mobile') {
    return (
      <div className="py-8 px-4 flex flex-col items-center justify-center min-h-screen bg-slate-950/80">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Simulador Teléfono Móvil (Android / iPhone)</span>
        </div>
        <div className="w-full max-w-[410px] min-h-[820px] max-h-[90vh] bg-slate-950 rounded-[48px] border-[8px] border-slate-800 shadow-2xl overflow-y-auto relative ring-1 ring-white/10">
          {/* Dynamic Island / Speaker notch */}
          <div className="sticky top-0 z-50 pt-2.5 pb-2 bg-slate-950 flex justify-center">
            <div className="w-24 h-4 bg-slate-800 rounded-full" />
          </div>
          {children}
        </div>
      </div>
    );
  }

  if (mode === 'tablet') {
    return (
      <div className="py-8 px-4 flex flex-col items-center justify-center min-h-screen bg-slate-950/80">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <Tablet className="w-4 h-4 text-emerald-400" />
          <span>Simulador Tablet (Ideal para KDS Cocina / Mozo)</span>
        </div>
        <div className="w-full max-w-[920px] min-h-[700px] max-h-[90vh] bg-slate-950 rounded-[36px] border-[10px] border-slate-800 shadow-2xl overflow-y-auto ring-1 ring-white/10">
          {children}
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center min-h-screen bg-slate-950/80">
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
        <Monitor className="w-4 h-4 text-emerald-400" />
        <span>Simulador Monitor Terminal (Caja / Administración)</span>
      </div>
      <div className="w-full max-w-[1280px] min-h-[750px] max-h-[92vh] bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-y-auto ring-1 ring-white/10">
        {children}
      </div>
    </div>
  );
};
