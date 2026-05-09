"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Move } from 'lucide-react';

/* ─── Draggable Text Box ─────────────────────────────────── */
const DraggableTextBox = ({
  label, value, boxStyle, setBoxStyle,
  posterScale, isSelected, onSelect, alwaysVisible,
  accentColor = '#3B82F6',
}) => {
  const dragState = useRef({ type: 0 }); // 0: None, 1: Move, 2: Resize
  const boxRef = useRef(null);

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

    dragState.current = { 
      type, 
      startX: p.x, startY: p.y, 
      origLeft: boxStyle.left, origTop: boxStyle.top,
      origW: boxStyle.width, origH: boxStyle.height 
    };

    const handleMove = (ev) => {
      if (dragState.current.type === 0) return;
      if (ev.type === 'touchmove') ev.preventDefault(); 
      
      const mX = ev.clientX || ev.touches?.[0]?.clientX;
      const mY = ev.clientY || ev.touches?.[0]?.clientY;
      const mp = getCanvasCoords(mX, mY);
      
      const d = dragState.current;
      if (d.type === 1) { // Move
        setBoxStyle(prev => ({
          ...prev,
          left: Math.max(0, Math.min(1080 - prev.width, d.origLeft + (mp.x - d.startX))),
          top:  Math.max(0, Math.min(1350 - prev.height, d.origTop  + (mp.y - d.startY))),
        }));
      } else if (d.type === 2) { // Resize
        setBoxStyle(prev => ({
          ...prev,
          width:  Math.max(60, Math.min(1080 - prev.left, d.origW + (mp.x - d.startX))),
          height: Math.max(20, d.origH + (mp.y - d.startY)),
        }));
      }
    };

    const handleEnd = () => {
      dragState.current.type = 0;
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
  const handleSize = Math.max(14, 28 / posterScale); 
  const labelFontSize = Math.max(9, 11 / posterScale);

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
        border: showBorder ? `${Math.max(1, 2/posterScale)}px ${isSelected ? 'solid' : 'dashed'} ${accentColor}` : 'none',
        borderRadius: '4px',
        boxSizing: 'border-box',
        touchAction: 'none',
      }}
      onMouseDown={e => startDrag(e, 1)}
      onTouchStart={e => startDrag(e, 1)}
    >
      <div style={{
        width: '100%', height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: boxStyle.align === 'center' ? 'center' : boxStyle.align === 'right' ? 'flex-end' : 'flex-start',
        fontSize: `${boxStyle.fontSize}px`,
        color: boxStyle.color,
        fontWeight: boxStyle.fontWeight,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>{value}</div>

      {showBorder && (
        <div style={{
          position: 'absolute', top: -labelFontSize * 1.8, left: 0,
          fontSize: `${labelFontSize}px`, fontWeight: 700, color: '#fff',
          background: accentColor, padding: '2px 8px', borderRadius: '4px',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>{label}</div>
      )}

      {isSelected && (
        <div
          onMouseDown={e => startDrag(e, 2)}
          onTouchStart={e => startDrag(e, 2)}
          style={{
            position: 'absolute', bottom: -handleSize / 2, right: -handleSize / 2,
            width: handleSize, height: handleSize,
            background: accentColor, borderRadius: '50%',
            cursor: 'se-resize', zIndex: 10,
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        />
      )}
    </div>
  );
};

/* ─── Main PosterPreview ─────────────────────────────────── */
const PosterPreview = ({
  posterRef, previewScale, selectedTemplate,
  teacherName, phone, formatPhoneNumber,
  isExporting, handleDownload,
  nameStyle, setNameStyle,
  phoneStyle, setPhoneStyle,
  designMode
}) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const scaledW = Math.round(1080 * previewScale);
  const scaledH = Math.round(1350 * previewScale);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Xem trước trực tiếp</h4>
        </div>
        <button onClick={handleDownload} disabled={isExporting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          XUẤT ẢNH
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
        {designMode && !selectedBox && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black shadow-2xl z-20 animate-bounce">
            <Move className="w-3 h-3" /> VUỐT ĐỂ DI CHUYỂN
          </div>
        )}

        {selectedTemplate ? (
          <div style={{ width: scaledW, height: scaledH, position: 'relative', transition: 'all 0.3s ease-out' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1350, transform: `scale(${previewScale})`, transformOrigin: 'top left', background: '#fff', boxShadow: '0 30px 100px -20px rgba(0,0,0,0.2)' }}>
              <div ref={posterRef} data-canvas="true" style={{ position: 'absolute', inset: 0, touchAction: 'none' }} onClick={() => setSelectedBox(null)}>
                <img src={selectedTemplate.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="Poster" />
                <DraggableTextBox label="Tên giáo viên" value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} setBoxStyle={setNameStyle} posterScale={previewScale} isSelected={selectedBox === 'name'} alwaysVisible={designMode} onSelect={() => setSelectedBox('name')} accentColor="#3B82F6" />
                <DraggableTextBox label="Số điện thoại" value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} setBoxStyle={setPhoneStyle} posterScale={previewScale} isSelected={selectedBox === 'phone'} alwaysVisible={designMode} onSelect={() => setSelectedBox('phone')} accentColor="#9333ea" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-300 text-sm font-black italic">Hãy chọn một mẫu thiết kế ở trên</p>
        )}
      </div>
    </div>
  );
};

export default PosterPreview;
