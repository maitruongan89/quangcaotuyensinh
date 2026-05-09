"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
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

  // Use a more robust coordinate system
  const getCanvasCoords = (clientX, clientY) => {
    const canvas = boxRef.current?.closest('[data-canvas="true"]');
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / posterScale,
      y: (clientY - rect.top) / posterScale,
    };
  };

  const startDrag = (e, type) => {
    e.stopPropagation();
    onSelect();
    
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const p = getCanvasCoords(clientX, clientY);

    if (type === DRAG_MOVE) {
      dragState.current = { type: DRAG_MOVE, startX: p.x, startY: p.y, origLeft: boxStyle.left, origTop: boxStyle.top };
    } else {
      dragState.current = { type: DRAG_RESIZE, startX: p.x, startY: p.y, origW: boxStyle.width, origH: boxStyle.height };
    }

    const handleMove = (ev) => {
      if (dragState.current.type === DRAG_NONE) return;
      if (ev.type === 'touchmove') ev.preventDefault(); // Prevent scroll
      
      const mX = ev.clientX || ev.touches?.[0]?.clientX;
      const mY = ev.clientY || ev.touches?.[0]?.clientY;
      const mp = getCanvasCoords(mX, mY);
      
      const d = dragState.current;
      if (d.type === DRAG_MOVE) {
        setBoxStyle(prev => ({
          ...prev,
          left: clamp(d.origLeft + (mp.x - d.startX), 0, 1080 - prev.width),
          top:  clamp(d.origTop  + (mp.y - d.startY), 0, 1350 - prev.height),
        }));
      } else if (d.type === DRAG_RESIZE) {
        setBoxStyle(prev => ({
          ...prev,
          width:  clamp(d.origW + (mp.x - d.startX), 60, 1080 - prev.left),
          height: clamp(d.origH + (mp.y - d.startY), 20, 400),
        }));
      }
    };

    const handleEnd = () => {
      dragState.current.type = DRAG_NONE;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  };

  const showBorder = isSelected || alwaysVisible;
  const borderW = Math.max(1.5, 2.5 / posterScale);
  const handleSize = Math.max(12, 24 / posterScale); // Even bigger for mobile
  const labelFontSize = Math.max(8, 10 / posterScale);

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
        touchAction: 'none',
      }}
      onMouseDown={e => startDrag(e, DRAG_MOVE)}
      onTouchStart={e => startDrag(e, DRAG_MOVE)}
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
        pointerEvents: 'none',
      }}>
        {value}
      </div>

      {showBorder && (
        <div style={{
          position: 'absolute', top: -labelFontSize * 1.8, left: 0,
          fontSize: `${labelFontSize}px`, fontWeight: 700, color: '#fff',
          background: accentColor, padding: '2px 6px', borderRadius: '4px',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          {label}
        </div>
      )}

      {isSelected && (
        <div
          onMouseDown={e => startDrag(e, DRAG_RESIZE)}
          onTouchStart={e => startDrag(e, DRAG_RESIZE)}
          style={{
            position: 'absolute', bottom: -handleSize / 2, right: -handleSize / 2,
            width: handleSize, height: handleSize,
            background: accentColor, borderRadius: '50%',
            cursor: 'se-resize', zIndex: 10,
            border: '2px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        />
      )}
    </div>
  );
};

/* ─── Template Preview Modal ─────────────────────────────── */
const TemplatePreviewModal = ({ template, templates, onClose, onSelect, selectedTemplate }) => {
  const [current, setCurrent] = useState(templates.findIndex(t => t.id === template.id));
  const tpl = templates[current];
  const isSelected = selectedTemplate?.id === tpl.id;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-sm w-full animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-black text-slate-900">{tpl.name}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="relative bg-slate-100 flex items-center justify-center min-h-[400px]">
          <img src={tpl.image} alt={tpl.name} className="w-full object-contain max-h-[500px]" />
          <button onClick={() => setCurrent(i => (i - 1 + templates.length) % templates.length)} className="absolute left-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center"><ChevronLeft /></button>
          <button onClick={() => setCurrent(i => (i + 1) % templates.length)} className="absolute right-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center"><ChevronRight /></button>
        </div>
        <div className="p-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 border rounded-xl font-bold">Đóng</button>
          <button onClick={() => { onSelect(tpl); onClose(); }} className={`flex-1 py-3 rounded-xl font-bold text-white ${isSelected ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            {isSelected ? 'Đang dùng' : 'Chọn mẫu'}
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
  return (
    <>
      <div className="border-t border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 p-2">
          <button onClick={() => stripRef.current?.scrollBy({ left: -200, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
          <div ref={stripRef} className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {templates.map((tpl) => {
              const isActive = selectedTemplate?.id === tpl.id;
              return (
                <div key={tpl.id} className="shrink-0 flex flex-col items-center gap-1">
                  <div className={`relative rounded-lg overflow-hidden w-[60px] h-[75px] transition-all ${isActive ? 'ring-2 ring-blue-600' : 'hover:ring-2 hover:ring-slate-300'}`} onClick={() => onSelect(tpl)}>
                    <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover" />
                    <button onClick={e => { e.stopPropagation(); setPreviewTpl(tpl); }} className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] font-bold py-1">XEM</button>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => stripRef.current?.scrollBy({ left: 200, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm"><ChevronRight className="w-4 h-4" /></button>
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
  const scaledW = Math.round(1080 * previewScale);
  const scaledH = Math.round(1350 * previewScale);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b z-10">
        <h4 className="text-[10px] font-black uppercase text-slate-400">Canvas</h4>
        <button onClick={handleDownload} disabled={isExporting} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-600/30">
          {isExporting ? 'Đang xuất...' : 'Xuất ảnh'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#F1F5F9] relative overflow-hidden min-h-[400px]">
        {selectedTemplate ? (
          <div style={{ width: scaledW, height: scaledH, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1350, transform: `scale(${previewScale})`, transformOrigin: 'top left', background: '#fff' }}>
              <div ref={posterRef} data-canvas="true" style={{ position: 'absolute', inset: 0, touchAction: 'none' }} onClick={() => setSelectedBox(null)}>
                <img src={selectedTemplate.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} alt="Poster" />
                <DraggableTextBox label="Tên giáo viên" value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} setBoxStyle={setNameStyle} posterScale={previewScale} isSelected={selectedBox === 'name'} alwaysVisible={designMode} onSelect={() => setSelectedBox('name')} accentColor="#3B82F6" />
                <DraggableTextBox label="Số điện thoại" value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} setBoxStyle={setPhoneStyle} posterScale={previewScale} isSelected={selectedBox === 'phone'} alwaysVisible={designMode} onSelect={() => setSelectedBox('phone')} accentColor="#9333ea" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm font-bold">Chưa chọn mẫu</p>
        )}
      </div>

      {templates && onSelectTemplate && <TemplateStrip templates={templates} selectedTemplate={selectedTemplate} onSelect={onSelectTemplate} />}
    </div>
  );
};

export default PosterPreview;
