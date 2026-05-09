import React from 'react';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-[100] bg-white/85 backdrop-blur-lg border-b border-slate-200/50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer">
          {/* Logo từ Google Drive — sử dụng img thẳng vì Next Image cần domain config */}
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/d/10R5u1fCnxoIfpUNrlOQodfftNieAXrdR"
              alt="ASEAN Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback icon nếu logo không load được
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1d4ed8,#6366f1);border-radius:10px;">
                    <span style="color:white;font-size:18px;font-weight:900;">A</span>
                  </div>`;
              }}
            />
          </div>

          <div className="flex flex-col leading-none">
            <h1 className="text-[13px] font-black tracking-tight text-slate-900 leading-tight">
              TRƯỜNG TCN TH ASEAN
            </h1>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-tight mt-0.5">
              Poster Tuyển Sinh
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex items-center gap-5">
            <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Tính năng</a>
            <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Thư viện</a>
          </nav>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200/50">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Free Tool</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
