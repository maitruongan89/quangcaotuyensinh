"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Move, X, Palette, Check, Type, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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
  const handleSize = Math.max(28, 56 / (posterScale || 1)); 

  const textGradientStyle = {
    background: boxStyle.color === '#FFFF00' 
      ? 'linear-gradient(to bottom, #FFFF00 20%, #FF9900 100%)' 
      : 'none',
    WebkitBackgroundClip: boxStyle.color === '#FFFF00' ? 'text' : 'unset',
    WebkitTextFillColor: boxStyle.color === '#FFFF00' ? 'transparent' : 'inherit',
  };

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
        border: showActiveState ? `3px dashed #3B82F6` : 'none',
        boxSizing: 'border-box',
        touchAction: 'none',
        zIndex: isSelected ? 100 : 10,
        display: 'inline-block',
      }}
      onMouseDown={e => startDrag(e, 1)}
      onTouchStart={e => startDrag(e, 1)}
    >
      <div 
        ref={textRef}
        style={{
          display: 'inline-block',
          padding: '0 10px',
          fontSize: `${boxStyle.fontSize}px`,
          color: boxStyle.color,
          fontWeight: boxStyle.fontWeight,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.1,
          filter: showShadow ? 'drop-shadow(0px 6px 12px rgba(0,0,0,0.8))' : 'none',
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
            position: 'absolute', bottom: -handleSize / 2, right: -handleSize / 2,
            width: handleSize, height: handleSize,
            background: '#3B82F6', borderRadius: '50%',
            cursor: 'se-resize', zIndex: 60,
            border: '6px solid white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
           <div className="w-1/2 h-1/2 border-r-4 border-b-4 border-white rotate-45 transform translate-x-[-1px] translate-y-[-1px]" />
        </div>
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
  designMode, showShadow, setShowShadow
}) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const scaledW = Math.round(1080 * previewScale);
  const scaledH = Math.round(1350 * previewScale);

  const activeStyle = selectedBox === 'name' ? nameStyle : phoneStyle;
  const setActiveStyle = selectedBox === 'name' ? setNameStyle : setPhoneStyle;

  const colors = [
    { name: 'Vàng', value: '#FFFF00' },
    { name: 'Đỏ', value: '#FF0000' },
    { name: 'Xanh ASEAN', value: '#003399' },
    { name: 'Xanh lá', value: '#00FF00' },
    { name: 'Cam', value: '#FF8800' },
    { name: 'Đen', value: '#000000' }
  ];

  const nudge = (dx, dy) => {
    if (!selectedBox) return;
    setActiveStyle(prev => ({
      ...prev,
      left: Math.max(0, Math.min(1080 - prev.width, prev.left + dx)),
      top: Math.max(0, Math.min(1350 - prev.height, prev.top + dy))
    }));
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ─── POSTER ẨN (CHỐNG MẤT GÓC) ─── */}
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
          <h4 className="text-[10px] font-black uppercase tracking-widest italic">
             {isExporting ? 'Đang chuẩn bị...' : 'Bố cục chuyên nghiệp'}
          </h4>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ touchAction: 'none' }}>
        {selectedTemplate ? (
          <div className="relative flex items-center justify-center w-full h-full p-4">
            {/* CANVAS THIẾT KẾ */}
            <div style={{ width: scaledW, height: scaledH, position: 'relative', touchAction: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1350, transform: `scale(${previewScale})`, transformOrigin: 'top left', background: '#fff', touchAction: 'none' }}>
                <div data-canvas="true" style={{ position: 'absolute', inset: 0, touchAction: 'none', backgroundColor: '#fff' }} onClick={() => setSelectedBox(null)}>
                  <img src={selectedTemplate.image} crossOrigin="anonymous" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} alt="Preview Base" />
                  <DraggableTextBox value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} setBoxStyle={setNameStyle} posterScale={previewScale} isSelected={selectedBox === 'name'} onSelect={() => setSelectedBox('name')} isExporting={isExporting} showShadow={showShadow} />
                  <DraggableTextBox value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} setBoxStyle={setPhoneStyle} posterScale={previewScale} isSelected={selectedBox === 'phone'} onSelect={() => setSelectedBox('phone')} isExporting={isExporting} showShadow={showShadow} />
                </div>
              </div>
            </div>

            {/* ─── MENU ĐIỀU KHIỂN NẰM BÊN PHẢI (FIXED SIDEBAR) ─── */}
            {selectedBox && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-3 bg-white/90 backdrop-blur-xl shadow-2xl rounded-[32px] border-2 border-blue-500 animate-in slide-in-from-right duration-500 z-[200] max-w-[85px]">
                 {/* Bật/Tắt bóng */}
                 <button 
                   onClick={() => setShowShadow(!showShadow)}
                   className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-lg ${showShadow ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                 >
                    <Sparkles className="w-6 h-6" />
                    <span className="text-[7px] font-black uppercase tracking-tighter leading-none">Bóng</span>
                 </button>

                 <div className="w-full h-px bg-slate-200 my-1" />

                 {/* Màu sắc dọc */}
                 <div className="flex flex-col gap-2 items-center">
                    {colors.map(c => (
                       <button 
                         key={c.value} 
                         onClick={() => setActiveStyle(prev => ({ ...prev, color: c.value }))}
                         className={`w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-transform active:scale-90`}
                         style={{ backgroundColor: c.value }}
                       >
                         {activeStyle.color === c.value && <Check className={`w-6 h-6 ${c.value === '#FFFF00' || c.value === '#00FF00' ? 'text-blue-600' : 'text-white'}`} />}
                       </button>
                    ))}
                 </div>

                 <div className="w-full h-px bg-slate-200 my-1" />

                 {/* Điều hướng 4 chiều */}
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => nudge(0, -5)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shadow-sm active:bg-blue-100"><ChevronUp className="w-6 h-6 text-blue-600" /></button>
                    <button onClick={() => nudge(0, 5)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shadow-sm active:bg-blue-100"><ChevronDown className="w-6 h-6 text-blue-600" /></button>
                    <button onClick={() => nudge(-5, 0)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shadow-sm active:bg-blue-100"><ChevronLeft className="w-6 h-6 text-blue-600" /></button>
                    <button onClick={() => nudge(5, 0)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shadow-sm active:bg-blue-100"><ChevronRight className="w-6 h-6 text-blue-600" /></button>
                 </div>

                 <div className="w-full h-px bg-slate-200 my-1" />

                 <div className="flex flex-col gap-2">
                    <button onClick={() => setActiveStyle(prev => ({ ...prev, fontSize: prev.fontSize + 4 }))} className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black active:scale-90 shadow-lg text-lg">A+</button>
                    <button onClick={() => setActiveStyle(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 4) }))} className="w-12 h-12 bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center font-black active:scale-90 text-lg">A-</button>
                 </div>

                 <button onClick={() => setSelectedBox(null)} className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center active:bg-red-100 mt-2">
                    <X className="w-6 h-6" />
                 </button>
              </div>
            )}
          </div>
        ) : <p className="text-xs font-bold text-slate-400 font-mono tracking-tighter">PREPARING CANVAS...</p>}
      </div>
    </div>
  );
};

export default PosterPreview;
