"use client";
import React, { useState, useRef, useCallback } from 'react';
import { Eye, Download, Loader2, LayoutTemplate, ZoomIn, Move, X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const DEFAULT_NAME_STYLE = {
  left: 180, top: 1100, width: 420, height: 60,
  fontSize: 36, color: '#003B8F', fontWeight: 900, align: 'center',
};
export const DEFAULT_PHONE_STYLE = {
  left: 180, top: 1210, width: 420, height: 70,
  fontSize: 48, color: '#003B8F', fontWeight: 900, align: 'center',
};

const DRAG_NONE = 0, DRAG_MOVE = 1, DRAG_RESIZE = 2;
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

/* ─── Draggable Text Box ─────────────────────────────────── */
const DraggableTextBox = ({
  label, value, boxStyle, setBoxStyle,
  posterScale, isSelected, onSelect, alwaysVisible,
  accentColor = '#3B82F6',
}) => {
  const dragState = useRef({ type: DRAG_NONE });
  const boxRef = useRef(null);

  const toCanvas = (clientX, clientY) => {
    const rect = boxRef.current?.closest('[data-canvas="true"]')?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left) / posterScale,
      y: (clientY - rect.top) / posterScale,
    };
  };

  const onStart = (clientX, clientY, type) => {
    onSelect();
    const p = toCanvas(clientX, clientY);
    if (type === DRAG_MOVE) {
      dragState.current = { type: DRAG_MOVE, startX: p.x, startY: p.y, origLeft: boxStyle.left, origTop: boxStyle.top };
    } else {
      dragState.current = { type: DRAG_RESIZE, startX: p.x, startY: p.y, origW: boxStyle.width, origH: boxStyle.height };
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  const onMove = useCallback((e) => {
    const d = dragState.current;
    if (d.type === DRAG_NONE) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const p = toCanvas(clientX, clientY);

    if (d.type === DRAG_MOVE) {
      setBoxStyle(prev => ({
        ...prev,
        left: clamp(d.origLeft + (p.x - d.startX), 0, 1080 - prev.width),
        top:  clamp(d.origTop  + (p.y - d.startY), 0, 1350 - prev.height),
      }));
    } else if (d.type === DRAG_RESIZE) {
      setBoxStyle(prev => ({
        ...prev,
        width:  clamp(d.origW + (p.x - d.startX), 60, 1080 - prev.left),
        height: clamp(d.origH + (p.y - d.startY), 20, 400),
      }));
    }
  }, [posterScale]);

  const onTouchMove = (e) => {
    if (dragState.current.type !== DRAG_NONE) {
      e.preventDefault(); // Prevent scrolling while dragging
      onMove(e);
    }
  };

  const onEnd = useCallback(() => {
    dragState.current.type = DRAG_NONE;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onEnd);
  }, []);

  const showBorder = isSelected || alwaysVisible;
  const borderW = Math.max(1.5, 2.5 / posterScale);
  const handleSize = Math.max(10, 18 / posterScale); // Bigger handle for touch
  const labelFontSize = Math.max(8, 10 / posterScale);
  const labelPad = Math.max(1, 3 / posterScale);

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        left: `${boxStyle.left}px`,
        top:  `${boxStyle.top}px`,
        width:  `${boxStyle.width}px`,
        height: `${boxStyle.height}px`,
        cursor: 'move',
        border: showBorder ? `${borderW}px ${isSelected ? 'solid' : 'dashed'} ${accentColor}` : 'none',
        borderRadius: Math.max(2, 4 / posterScale),
        boxSizing: 'border-box',
        userSelect: 'none',
        touchAction: 'none', // Prevent default touch behavior
      }}
      onMouseDown={e => { e.stopPropagation(); onStart(e.clientX, e.clientY, DRAG_MOVE); }}
      onTouchStart={e => { e.stopPropagation(); onStart(e.touches[0].clientX, e.touches[0].clientY, DRAG_MOVE); }}
      onClick={e => { e.stopPropagation(); onSelect(); }}
    >
      <div style={{
        width: '100%', height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: boxStyle.align === 'center' ? 'center' : boxStyle.align === 'right' ? 'flex-end' : 'flex-start',
        fontSize: `${boxStyle.fontSize}px`,
        color: boxStyle.color,
        fontWeight: boxStyle.fontWeight,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textShadow: boxStyle.shadow || 'none',
        pointerEvents: 'none',
      }}>
        {value}
      </div>

      {showBorder && (
        <div style={{
          position: 'absolute',
          top: -labelFontSize * 1.7,
          left: 0,
          fontSize: `${labelFontSize}px`,
          fontWeight: 700,
          color: '#fff',
          background: accentColor,
          padding: `${labelPad}px ${labelPad * 2.5}px`,
          borderRadius: `${Math.max(2, 3 / posterScale)}px`,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          lineHeight: 1.5,
        }}>
          {label}
        </div>
      )}

      {isSelected && (
        <div
          onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onStart(e.clientX, e.clientY, DRAG_RESIZE); }}
          onTouchStart={e => { e.stopPropagation(); e.preventDefault(); onStart(e.touches[0].clientX, e.touches[0].clientY, DRAG_RESIZE); }}
          style={{
            position: 'absolute', bottom: -handleSize / 2, right: -handleSize / 2,
            width: handleSize, height: handleSize,
            background: accentColor, borderRadius: Math.max(2, 4 / posterScale),
            cursor: 'se-resize', zIndex: 10,
            border: `${Math.max(1, 2 / posterScale)}px solid white`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      )}
    </div>
  );
};

/* ─── Template Preview Modal ─────────────────────────────── */
const TemplatePreviewModal = ({ template, templates, onClose, onSelect, selectedTemplate }) => {
  const [current, setCurrent] = useState(templates.findIndex(t => t.id === template.id));

  const prev = () => setCurrent(i => (i - 1 + templates.length) % templates.length);
  const next = () => setCurrent(i => (i + 1) % templates.length);

  const tpl = templates[current];
  const isSelected = selectedTemplate?.id === tpl.id;

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-sm w-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-medium">Xem trước mẫu</p>
            <h3 className="text-sm font-black text-slate-900">{tpl.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">{current + 1} / {templates.length}</span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative bg-slate-100 flex items-center justify-center" style={{ minHeight: 380 }}>
          <img src={tpl.image} alt={tpl.name} className="w-full object-contain" style={{ maxHeight: 460 }} />
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div className="flex justify-center gap-1 py-2 px-4 flex-wrap">
          {templates.map((t, i) => (
            <button key={t.id} onClick={() => setCurrent(i)} className={`rounded-full transition-all ${i === current ? 'w-4 h-1.5 bg-blue-600' : 'w-1.5 h-1.5 bg-slate-300'}`} />
          ))}
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold">Đóng</button>
          <button onClick={() => { onSelect(tpl); onClose(); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
            {isSelected ? <><CheckCircle2 className="w-4 h-4" /> Đang dùng</> : <>Chọn mẫu</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Template Strip ─────────────────────────────────────── */
const TemplateStrip = ({ templates, selectedTemplate, onSelect }) => {
  const [previewTpl, setPreviewTpl] = useState(null);
  const stripRef = useRef(null);
  const scrollLeft  = () => stripRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => stripRef.current?.scrollBy({ left:  200, behavior: 'smooth' });

  return (
    <>
      <div className="border-t border-slate-200/60 bg-white/70 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex items-center gap-1 shrink-0">
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{templates.length}</span>
          </div>
          <button onClick={scrollLeft} className="shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <div ref={stripRef} className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {templates.map((tpl) => {
              const isActive = selectedTemplate?.id === tpl.id;
              return (
                <div key={tpl.id} className="shrink-0 flex flex-col items-center gap-1">
                  <div className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${isActive ? 'ring-2 ring-blue-600 ring-offset-1' : 'hover:ring-2 hover:ring-slate-300'}`} style={{ width: 52, height: 65 }} onClick={() => onSelect(tpl)}>
                    <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover" />
                    {isActive && <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-px"><CheckCircle2 className="w-2.5 h-2.5 text-white fill-white" /></div>}
                    <div className="absolute inset-0 bg-black/50 opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={e => { e.stopPropagation(); setPreviewTpl(tpl); }} className="bg-white text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow hover:bg-blue-600 hover:text-white transition-colors">Xem</button>
                    </div>
                    {/* Mobile touch button for preview */}
                    <button onClick={e => { e.stopPropagation(); setPreviewTpl(tpl); }} className="lg:hidden absolute bottom-0 inset-x-0 bg-black/40 text-white text-[8px] font-bold py-0.5">XEM</button>
                  </div>
                  <span className="text-[9px] font-medium text-slate-500 truncate w-[52px] text-center">{tpl.name}</span>
                </div>
              );
            })}
          </div>
          <button onClick={scrollRight} className="shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      {previewTpl && <TemplatePreviewModal template={previewTpl} templates={templates} onClose={() => setPreviewTpl(null)} onSelect={onSelect} selectedTemplate={selectedTemplate} />}
    </>
  );
};

/* ─── Main PosterPreview ─────────────────────────────────── */
const PosterPreview = ({
  posterRef, previewScale, selectedTemplate,
  teacherName, phone, formatPhoneNumber,
  isExporting, handleDownload,
  nameStyle, setNameStyle,
  phoneStyle, setPhoneStyle,
  designMode,
  templates, onSelectTemplate,
}) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const canvasRef = useRef(null);

  const onCanvasClick = (e) => {
    if (e.target === canvasRef.current) setSelectedBox(null);
  };

  const scaledW = Math.round(1080 * previewScale);
  const scaledH = Math.round(1350 * previewScale);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/70 backdrop-blur-md border-b border-slate-200/60 z-10 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200/60 shadow-sm">
            <LayoutTemplate className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide truncate max-w-[110px]">{selectedTemplate?.name || "Chọn mẫu"}</span>
          </div>
          {designMode && <span className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 rounded-lg uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />Thiết kế</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 bg-white rounded-lg border border-slate-200/60 shadow-sm"><ZoomIn className="w-3 h-3 text-slate-400" /><span className="text-[10px] font-bold text-slate-500">{Math.round(previewScale * 100)}%</span></div>
          <button onClick={handleDownload} disabled={isExporting} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-blue-600/20">{isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}Xuất ảnh</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden relative min-h-[400px]">
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/85 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm z-10"><div className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></div><span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Live Canvas</span></div>
        
        {designMode && !selectedBox && <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200/60 rounded-full z-10"><Move className="w-2.5 h-2.5 text-blue-500" /><span className="text-[9px] font-bold text-blue-600">Vuốt để di chuyển</span></div>}

        {selectedTemplate ? (
          <div style={{ width: scaledW, height: scaledH, position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1350, transform: `scale(${previewScale})`, transformOrigin: 'top left', boxShadow: '0 20px 60px -15px rgba(0,0,0,0.18)', border: '1px solid #e2e8f0' }}>
              <div ref={el => { canvasRef.current = el; if (typeof posterRef === 'function') posterRef(el); else if (posterRef) posterRef.current = el; }} data-canvas="true" style={{ position: 'absolute', inset: 0, width: 1080, height: 1350, background: '#fff', overflow: 'hidden', touchAction: 'none' }} onClick={onCanvasClick}>
                <img src={selectedTemplate.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="Poster Background" crossOrigin="anonymous" />
                <DraggableTextBox label="Tên giáo viên" value={teacherName || 'Giáo viên hướng dẫn'} boxStyle={nameStyle} setBoxStyle={setNameStyle} posterScale={previewScale} isSelected={selectedBox === 'name'} alwaysVisible={designMode} onSelect={() => setSelectedBox('name')} accentColor="#3B82F6" />
                <DraggableTextBox label="Số điện thoại" value={phone ? formatPhoneNumber(phone) : 'Số điện thoại / Zalo'} boxStyle={phoneStyle} setBoxStyle={setPhoneStyle} posterScale={previewScale} isSelected={selectedBox === 'phone'} alwaysVisible={designMode} onSelect={() => setSelectedBox('phone')} accentColor="#9333ea" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400"><Eye className="w-14 h-14 stroke-1" /><p className="text-base font-bold">Chưa chọn mẫu thiết kế</p></div>
        )}
      </div>

      {templates && onSelectTemplate && <TemplateStrip templates={templates} selectedTemplate={selectedTemplate} onSelect={onSelectTemplate} />}
    </div>
  );
};

export default PosterPreview;
