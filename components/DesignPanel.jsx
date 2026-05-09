"use client";
import React from 'react';
import { ChevronLeft, Download, Type, Phone, RotateCcw, Palette, Layers, Sparkles } from 'lucide-react';

const DesignPanel = ({
  teacherName, setTeacherName,
  phone, setPhone,
  nameStyle, setNameStyle,
  defaultNameStyle,
  phoneStyle, setPhoneStyle,
  defaultPhoneStyle,
  onBack, onDownload,
  isExporting,
  showShadow, setShowShadow
}) => {

  const colors = [
    { name: 'Vàng Gold', value: '#FFFF00' },
    { name: 'Trắng', value: '#FFFFFF' },
    { name: 'Xanh lơ', value: '#00FFFF' },
    { name: 'Đỏ', value: '#FF0000' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full animate-in slide-in-from-left duration-500">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider">Quay lại</span>
        </button>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest">Thiết kế Poster</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide">
        {/* Tên Giáo Viên */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Type className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest">Tên Giáo Viên</h3>
          </div>
          <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
          <div className="flex flex-wrap gap-2 pt-1">
            {colors.map(c => (
              <button key={c.value} onClick={() => setNameStyle(prev => ({ ...prev, color: c.value }))} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${nameStyle.color === c.value ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'}`}>{c.name}</button>
            ))}
          </div>
        </div>

        {/* Số Điện Thoại */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest">Số điện thoại / Zalo</h3>
          </div>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" />
          <div className="flex flex-wrap gap-2 pt-1">
            {colors.map(c => (
              <button key={c.value} onClick={() => setPhoneStyle(prev => ({ ...prev, color: c.value }))} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${phoneStyle.color === c.value ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-400'}`}>{c.name}</button>
            ))}
          </div>
        </div>

        {/* Tùy chỉnh hiệu ứng */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest">Hiệu ứng chữ</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">Đổ bóng chữ</span>
                <span className="text-[10px] text-slate-400 font-bold">Giúp chữ nổi bật trên nền xanh</span>
             </div>
             <button 
                onClick={() => setShowShadow(!showShadow)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${showShadow ? 'bg-blue-600' : 'bg-slate-300'}`}
             >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showShadow ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
             </button>
          </div>
        </div>

        {/* Khôi phục vị trí */}
        <div className="pt-4">
          <button onClick={() => { setNameStyle(defaultNameStyle); setPhoneStyle(defaultPhoneStyle); }} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-colors">
            <RotateCcw className="w-4 h-4" /> KHÔI PHỤC VỊ TRÍ GỐC
          </button>
        </div>
      </div>

      <div className="p-5 bg-slate-50 border-t">
        <button onClick={onDownload} disabled={isExporting} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
          {isExporting ? <Layers className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />} XEM KẾT QUẢ & XUẤT ẢNH
        </button>
      </div>
    </div>
  );
};

export default DesignPanel;
