"use client";
import React from 'react';
import { ChevronLeft, Type, Phone, RotateCcw, Sparkles, Check } from 'lucide-react';

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
    { name: 'Vàng Gold', value: '#FFFF00', bg: 'bg-[#FFFF00]' },
    { name: 'Trắng', value: '#FFFFFF', bg: 'bg-white border-slate-200' },
    { name: 'Xanh lơ', value: '#00FFFF', bg: 'bg-[#00FFFF]' },
    { name: 'Đỏ rực', value: '#FF0000', bg: 'bg-[#FF0000]' },
    { name: 'Xanh ASEAN', value: '#003399', bg: 'bg-[#003399]' },
    { name: 'Đen', value: '#000000', bg: 'bg-black' }
  ];

  const ColorPicker = ({ label, currentStyle, setStyle }) => (
    <div className="space-y-3">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{label}</span>
      <div className="flex flex-wrap gap-3">
        {colors.map(c => {
          const isActive = currentStyle.color === c.value;
          return (
            <button
              key={c.value}
              onClick={() => setStyle(prev => ({ ...prev, color: c.value }))}
              className={`group relative w-10 h-10 rounded-full transition-all flex items-center justify-center ${c.bg} ${isActive ? 'ring-4 ring-blue-500 ring-offset-2 scale-110 shadow-lg' : 'hover:scale-110 border border-slate-100 shadow-sm'}`}
              title={c.name}
            >
              {isActive && <Check className={`w-5 h-5 ${c.value === '#FFFFFF' || c.value === '#FFFF00' ? 'text-blue-600' : 'text-white'}`} />}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-bold">
                {c.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full animate-in slide-in-from-left duration-500">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider">Quay lại</span>
        </button>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest tracking-tighter">Bảng điều khiển</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide">
        {/* Tên Giáo Viên */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shadow-sm">
              <Type className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest">Tên Giáo Viên</h3>
          </div>
          <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner" />
          <ColorPicker label="Màu chữ tên" currentStyle={nameStyle} setStyle={setNameStyle} />
        </div>

        {/* Số Điện Thoại */}
        <div className="space-y-5 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shadow-sm">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest">Số điện thoại / Zalo</h3>
          </div>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all shadow-inner" />
          <ColorPicker label="Màu chữ SĐT" currentStyle={phoneStyle} setStyle={setPhoneStyle} />
        </div>

        {/* Hiệu ứng */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest">Hiệu ứng chuyên nghiệp</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer" onClick={() => setShowShadow(!showShadow)}>
             <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">Đổ bóng chữ nghệ thuật</span>
                <span className="text-[10px] text-slate-400 font-bold">Giúp chữ nổi khối 3D trên ảnh</span>
             </div>
             <button className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${showShadow ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showShadow ? 'translate-x-6' : 'translate-x-0'} shadow-md`} />
             </button>
          </div>
        </div>

        <button onClick={() => { setNameStyle(defaultNameStyle); setPhoneStyle(defaultPhoneStyle); }} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 border-2 border-slate-200/50">
          <RotateCcw className="w-4 h-4" /> KHÔI PHỤC VỊ TRÍ MẶC ĐỊNH
        </button>
      </div>

      <div className="p-5 bg-white border-t border-slate-100">
        <button onClick={onDownload} disabled={isExporting} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
          <Sparkles className="w-6 h-6" /> {isExporting ? 'ĐANG XỬ LÝ...' : 'XEM KẾT QUẢ & TẢI ẢNH'}
        </button>
      </div>
    </div>
  );
};

export default DesignPanel;
