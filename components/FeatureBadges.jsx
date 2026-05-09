import React from 'react';
import { Zap, Smartphone, Maximize2, ShieldCheck } from 'lucide-react';

const FeatureBadges = () => {
  const badges = [
    { icon: <Zap className="w-3.5 h-3.5" />, text: "Realtime Preview" },
    { icon: <Smartphone className="w-3.5 h-3.5" />, text: "Mobile Optimized" },
    { icon: <Maximize2 className="w-3.5 h-3.5" />, text: "1080×1350 Output" },
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: "Không đăng nhập" },
  ];

  return (
    <div className="flex flex-wrap gap-2.5 pt-2">
      {badges.map((badge, idx) => (
        <div 
          key={idx}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md border border-slate-200/80 shadow-sm"
        >
          <span className="text-blue-600">{badge.icon}</span>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default FeatureBadges;
