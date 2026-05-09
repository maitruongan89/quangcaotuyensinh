import React, { useState } from 'react';
import {
  ArrowLeft, Download, Loader2, User, Phone,
  AlignLeft, AlignCenter, AlignRight,
  ChevronDown, ChevronUp, RotateCcw, Move, Type,
} from 'lucide-react';

/* ─── Tiny helpers ──────────────────────────────────────────── */

const FONT_WEIGHTS = [400, 500, 600, 700, 800, 900];
const PRESET_COLORS = [
  '#003B8F', '#FFFFFF', '#FFD700', '#FF0000',
  '#1a1a1a', '#22c55e', '#f97316', '#a855f7',
];

function Slider({ label, value, min, max, step = 1, onChange, unit = '' }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min} max={max} step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="w-16 text-center text-xs font-bold border border-slate-200 rounded-lg px-1 py-0.5 bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          />
          {unit && <span className="text-[10px] text-slate-400 font-medium">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-blue-600 cursor-pointer"
      />
      <div className="flex justify-between text-[9px] text-slate-300 font-medium">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ColorRow({ value, onChange }) {
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Màu chữ</span>
      <div className="flex items-center gap-2 flex-wrap">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            title={c}
            className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
            style={{
              background: c,
              borderColor: value === c ? '#3B82F6' : 'rgba(0,0,0,0.12)',
              transform: value === c ? 'scale(1.2)' : undefined,
              boxShadow: value === c ? '0 0 0 2px #fff, 0 0 0 4px #3B82F6' : undefined,
            }}
          />
        ))}
        {/* Custom color */}
        <label className="relative w-6 h-6 rounded-full border-2 border-slate-300 overflow-hidden cursor-pointer hover:scale-110 transition-transform" title="Màu tùy chỉnh">
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-400">+</span>
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
        </label>
        <span className="text-[10px] font-mono text-slate-400 ml-1">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

function AlignRow({ value, onChange }) {
  const opts = [
    { v: 'left',   icon: <AlignLeft className="w-3.5 h-3.5" />,   label: 'Trái' },
    { v: 'center', icon: <AlignCenter className="w-3.5 h-3.5" />, label: 'Giữa' },
    { v: 'right',  icon: <AlignRight className="w-3.5 h-3.5" />,  label: 'Phải' },
  ];
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Căn lề</span>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {opts.map(o => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              value === o.v
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {o.icon} {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function WeightRow({ value, onChange }) {
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Độ đậm</span>
      <div className="flex gap-1 flex-wrap">
        {FONT_WEIGHTS.map(w => (
          <button
            key={w}
            onClick={() => onChange(w)}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all border ${
              value === w
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}
            style={{ fontWeight: w }}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Section card ──────────────────────────────────────────── */
function Section({ title, icon, accent = 'blue', style, setStyle, defaultStyle, labelX = 'Vị trí X', labelY = 'Vị trí Y' }) {
  const [open, setOpen] = useState(true);

  const accentClass = accent === 'blue' ? 'bg-blue-600' : 'bg-purple-600';
  const accentText = accent === 'blue' ? 'text-blue-600' : 'text-purple-600';
  const accentBorder = accent === 'blue' ? 'border-blue-200' : 'border-purple-200';
  const accentBg = accent === 'blue' ? 'bg-blue-50' : 'bg-purple-50';

  return (
    <div className={`rounded-2xl border ${accentBorder} ${accentBg} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-6 h-6 rounded-lg ${accentClass} flex items-center justify-center text-white`}>
            {icon}
          </div>
          <span className={`text-sm font-bold ${accentText}`}>{title}</span>
        </div>
        {open
          ? <ChevronUp className={`w-4 h-4 ${accentText} opacity-60`} />
          : <ChevronDown className={`w-4 h-4 ${accentText} opacity-60`} />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/60">
          {/* Position */}
          <div className="pt-3 grid grid-cols-2 gap-3">
            <Slider label={labelX} value={Math.round(style.left)} min={0} max={1000} onChange={v => setStyle(p => ({ ...p, left: v }))} unit="px" />
            <Slider label={labelY} value={Math.round(style.top)} min={0} max={1300} onChange={v => setStyle(p => ({ ...p, top: v }))} unit="px" />
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-3">
            <Slider label="Rộng" value={Math.round(style.width)} min={60} max={1080} onChange={v => setStyle(p => ({ ...p, width: v }))} unit="px" />
            <Slider label="Cao" value={Math.round(style.height)} min={20} max={400} onChange={v => setStyle(p => ({ ...p, height: v }))} unit="px" />
          </div>

          {/* Font size */}
          <Slider label="Cỡ chữ" value={style.fontSize} min={12} max={160} onChange={v => setStyle(p => ({ ...p, fontSize: v }))} unit="px" />

          {/* Color */}
          <ColorRow value={style.color} onChange={c => setStyle(p => ({ ...p, color: c }))} />

          {/* Weight */}
          <WeightRow value={style.fontWeight} onChange={w => setStyle(p => ({ ...p, fontWeight: w }))} />

          {/* Align */}
          <AlignRow value={style.align} onChange={a => setStyle(p => ({ ...p, align: a }))} />

          {/* Reset */}
          <button
            onClick={() => setStyle({ ...defaultStyle })}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Đặt lại mặc định
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Design Panel ─────────────────────────────────────── */
const DesignPanel = ({
  teacherName, setTeacherName,
  phone, setPhone,
  nameStyle, setNameStyle, defaultNameStyle,
  phoneStyle, setPhoneStyle, defaultPhoneStyle,
  onBack,
  onDownload,
  isExporting,
}) => {
  return (
    <div className="space-y-4">

      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Chỉnh thông tin
        </button>

        <button
          onClick={onDownload}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-60 shadow-md shadow-blue-500/20"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Xuất ảnh
        </button>
      </div>

      {/* Quick edit (mini) */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 space-y-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thông tin nhanh</p>
        <div className="grid grid-cols-1 gap-2.5">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              value={teacherName}
              onChange={e => setTeacherName(e.target.value)}
              placeholder="Tên giáo viên..."
              className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="Số điện thoại..."
              className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>
      </div>

      {/* Name section */}
      <Section
        title="Tên giáo viên"
        icon={<User className="w-3.5 h-3.5" />}
        accent="blue"
        style={nameStyle}
        setStyle={setNameStyle}
        defaultStyle={defaultNameStyle}
        labelX="Vị trí X"
        labelY="Vị trí Y"
      />

      {/* Phone section */}
      <Section
        title="Số điện thoại"
        icon={<Phone className="w-3.5 h-3.5" />}
        accent="purple"
        style={phoneStyle}
        setStyle={setPhoneStyle}
        defaultStyle={defaultPhoneStyle}
        labelX="Vị trí X"
        labelY="Vị trí Y"
      />

      {/* Tip */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200/60 rounded-xl">
        <Move className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
          Bạn cũng có thể <strong>kéo thả trực tiếp</strong> trên canvas bên phải để di chuyển văn bản.
        </p>
      </div>

    </div>
  );
};

export default DesignPanel;
