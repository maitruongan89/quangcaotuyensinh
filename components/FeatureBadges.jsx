import React from 'react';
import { Zap, Smartphone, Image as ImageIcon, ShieldCheck } from 'lucide-react';

const FeatureBadges = () => {
  const features = [
    { icon: Smartphone, text: 'MOBILE OPTIMIZED' },
    { icon: ImageIcon, text: '1080×1350 OUTPUT' },
    { icon: ShieldCheck, text: 'KHÔNG ĐĂNG NHẬP' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
      {features.map((f, i) => (
        <div 
          key={i}
          className="flex items-center gap-2 px-3 py-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-blue-100/50 shadow-sm transition-all hover:shadow-md"
        >
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <f.icon className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-[10px] font-black text-slate-600 tracking-tight leading-none">
            {f.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeatureBadges;
