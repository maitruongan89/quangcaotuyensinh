"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Move, X, Palette, Check, Type } from 'lucide-react';

/* ─── Draggable Text Box ─────────────────────────────────── */
const DraggableTextBox = ({
  value, boxStyle, setBoxStyle,
  posterScale, isSelected, onSelect, isExporting, showShadow
}) => {
  const dragState = useRef({ type: 0 }); 
  const boxRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current && setBoxStyle && !dragState.current.type) {
      const width = textRef.current.offsetWidth + 20;
      if (width !== boxStyle.width) {
        setBoxStyle(prev => ({ ...prev, width: Math.min(1000, Math.max(60, width)) }));
      }
    }
  }, [value, boxStyle.fontSize, boxStyle.fontWeight, setBoxStyle]);

  const getCanvasCoords = (clientX, clientY) => {
    const canvas = boxRef.current?.closest('[data-canvas="true"]');
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = posterScale || 1;
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    };
  };

  const startDrag = (e, type) => {
    if (isExporting || !setBoxStyle) return;
    e.stopPropagation();
    onSelect?.();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const p = getCanvasCoords(clientX, clientY);
    dragState.current = { type, startX: p.x, startY: p.y, origLeft: boxStyle.left, origTop: boxStyle.top, origW: boxStyle.width, origH: boxStyle.height };

    const handleMove = (ev) => {
      if (dragState.current.type === 0) return;
      if (ev.cancelable) ev.preventDefault(); 
      const mX = ev.clientX || ev.touches?.[0]?.clientX;
      const mY = ev.clientY || ev.touches?.[0]?.clientY;
      const mp = getCanvasCoords(mX, mY);
      const d = dragState.current;
      if (d.type === 1) {
        setBoxStyle(prev => ({ ...prev, left: Math.max(0, Math.min(1080 - prev.width, d.origLeft + (mp.x - d.startX))), top: Math.max(0, Math.min(1350 - prev.height, d.origTop + (mp.y - d.startY))) }));
      } else if (d.type === 2) {
        const newWidth = Math.max(60, d.origW + (mp.x - d.startX));
        setBoxStyle(prev => ({ ...prev, width: newWidth, fontSize: Math.max(12, Math.min(200, Math.round(prev.fontSize * (newWidth / d.origW)))) }));
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

  const showActiveState = isSelected && !isExporting;
  const handleSize = Math.max(14, 28 / (posterScale || 1)); 

  const textGradientStyle = {
    background: boxStyle.color === '#FFFF00' 
      ? 'linear-gradient(to bottom, #FFFF00 20%, #FF9900 100%)' 
      : 'none',
    WebkitBackgroundClip: boxStyle.color === '#FFFF00' ? 'text' : 'unset',
    WebkitTextFillColor: boxStyle.color === '#FFFF00' ? 'transparent' : 'inherit',
  };

  const colors = [
    { name: 'Vàng', value: '#FFFF00' },
    { name: 'Trắng', value: '#FFFFFF' },
    { name: 'Xanh lơ', value: '#00FFFF' },
    { name: 'Đỏ', value: '#FF0000' },
    { name: 'ASEAN', value: '#003399' },
    { name: 'Đen', value: '#000000' }
  ];

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        left: `${boxStyle.left}px`,
        top:  `${boxStyle.top}px`,
        width: 'auto',
        minWidth: `${boxStyle.width}px`, 
        height: 'auto',
        cursor: isExporting ? 'default' : 'move',
        border: showActiveState ? `1.5px dashed #3B82F6` : 'none',
        boxSizing: 'border-box',
        touchAction: 'none',
        zIndex: isSelected ? 100 : 10,
        display: 'inline-block',
      }}
      onMouseDown={e => startDrag(e, 1)}
      onTouchStart={e => startDrag(e, 1)}
    >
      {/* ─── POPUP CHỈNH SỬA TẠI CHỖ (CHỈ HIỆN KHI CHỌN) ─── */}
      {showActiveState && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 -top-16 bg-white shadow-2xl rounded-2xl p-2 flex items-center gap-2 border border-slate-200 animate-in zoom-in slide-in-from-bottom-2"
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 px-1 border-r pr-2">
             {colors.map(c => (
               <button 
                 key={c.value} 
                 onClick={() => setBoxStyle(prev => ({ ...prev, color: c.value }))}
                 className={`w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center transition-transform active:scale-90`}
                 style={{ backgroundColor: c.value }}
               >
                 {boxStyle.color === c.value && <Check className={`w-4 h-4 ${c.value === '#FFFFFF' || c.value === '#FFFF00' ? 'text-blue-600' : 'text-white'}`} />}
               </button>
             ))}
          </div>
          <button 
            onClick={() => setBoxStyle(prev => ({ ...prev, fontSize: prev.fontSize + 2 }))}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <Type className="w-4 h-4 text-slate-600" />+
          </button>
          <button 
            onClick={() => setBoxStyle(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 2) }))}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <Type className="w-4 h-4 text-slate-600" />-
          </button>
        </div>
      )}

      <div 
        ref={textRef}
        style={{
          display: 'inline-block',
          padding: '0 5px',
          fontSize: `${boxStyle.fontSize}px`,
          color: boxStyle.color,
          fontWeight: boxStyle.fontWeight,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.1,
          filter: showShadow ? 'drop-shadow(0px 4px 6px rgba(0,0,0,0.6))' : 'none',
          ...textGradientStyle
        }}
      >
        {value}
      </div>

      {showActiveState && (
        <div
          onMouseDown={e => startDrag(e, 2)}
          onTouchStart={e => startDrag(e, 2)}
          style={{
            position: 'absolute', bottom: -handleSize / 3, right: -handleSize / 3,
            width: handleSize, height: handleSize,
            background: '#3B82F6', borderRadius: '50%',
            cursor: 'se-resize', zIndex: 60,
            border: '2.5px solid white',
          }}
        />
      )}
    </div>
  );
};

/* ─── Main PosterPreview ─────────────────────────────────── */
const PosterPreview = ({
  exportRef, previewScale, selectedTemplate,
  teacherName, phone, formatPhoneNumber,
  isExporting, handleDownload,
  nameStyle, setNameStyle,
  phoneStyle, setPhoneStyle,
  designMode, showShadow
}) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const scaledW = Math.round(1080 * previewScale);
  const scaledH = Math.round(1350 * previewScale);

  return (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden">
      {/* ─── POSTER ẨN (FIXED ĐỂ CHỐNG MẤT GÓC) ─── */}
      <div style={{ position: 'fixed', left: '-5000px', top: 0, width: 1080, height: 1350, zIndex: -100, overflow: 'visible' }}>
        <div ref={exportRef} style={{ position: 'relative', width: 1080, height: 1350, backgroundColor: '#fff', overflow: 'visible' }}>
          <img src={selectedTemplate?.image} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'fill' }} alt="Export Base" />
          <DraggableTextBox value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} posterScale={1} isExporting={true} showShadow={showShadow} />
          <DraggableTextBox value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} posterScale={1} isExporting={true} showShadow={showShadow} />
        </div>
      </div>

      {/* ─── UI XEM TRƯỚC ─── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shrink-0 z-30">
        <div className="flex items-center gap-2 text-slate-800">
          <div className={`w-2 h-2 rounded-full ${isExporting ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
          <h4 className="text-[10px] font-black uppercase tracking-widest">
             {isExporting ? 'Đang tạo bản xem trước...' : 'Thiết kế Poster'}
          </h4>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-100 relative overflow-hidden" style={{ touchAction: 'none' }}>
        {selectedTemplate ? (
          <div style={{ width: scaledW, height: scaledH, position: 'relative', touchAction: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1350, transform: `scale(${previewScale})`, transformOrigin: 'top left', background: '#fff', touchAction: 'none' }}>
              <div data-canvas="true" style={{ position: 'absolute', inset: 0, touchAction: 'none', backgroundColor: '#fff' }} onClick={() => setSelectedBox(null)}>
                <img src={selectedTemplate.image} crossOrigin="anonymous" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} alt="Preview Base" />
                <DraggableTextBox value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} setBoxStyle={setNameStyle} posterScale={previewScale} isSelected={selectedBox === 'name'} onSelect={() => setSelectedBox('name')} isExporting={isExporting} showShadow={showShadow} />
                <DraggableTextBox value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} setBoxStyle={setPhoneStyle} posterScale={previewScale} isSelected={selectedBox === 'phone'} onSelect={() => setSelectedBox('phone')} isExporting={isExporting} showShadow={showShadow} />
              </div>
            </div>
          </div>
        ) : <p className="text-xs font-bold text-slate-400 font-mono">LOADING TEMPLATE...</p>}
      </div>
    </div>
  );
};

export default PosterPreview;
