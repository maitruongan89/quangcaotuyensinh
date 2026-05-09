"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Move, X, Palette, Check, Type, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Sparkles, Layers } from 'lucide-react';

/* ─── Draggable Text Box ─────────────────────────────────── */
const DraggableTextBox = ({
  value, boxStyle, setBoxStyle,
  posterScale, isSelected, onSelect, isExporting, showShadow, useGradient
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

  const nudge = (dx, dy) => {
    setBoxStyle(prev => ({
      ...prev,
      left: Math.max(0, Math.min(1080 - prev.width, prev.left + dx)),
      top: Math.max(0, Math.min(1350 - prev.height, prev.top + dy))
    }));
  };

  const showActiveState = isSelected && !isExporting;
  const handleSize = Math.max(26, 52 / (posterScale || 1)); 

  const textGradientStyle = (useGradient && boxStyle.color !== '#000000') ? {
    background: `linear-gradient(to bottom, ${boxStyle.color} 20%, #FFFFFF 120%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: boxStyle.color 
  } : {
    color: boxStyle.color
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
        border: showActiveState ? `2px dashed #3B82F6` : 'none',
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
          fontWeight: boxStyle.fontWeight,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.1,
          filter: showShadow ? 'drop-shadow(0px 8px 15px rgba(0,0,0,0.95))' : 'none',
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
            border: '4px solid white',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
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
  const [useGradient, setUseGradient] = useState(true);
  
  const scaledW = Math.round(1080 * previewScale);
  const scaledH = Math.round(1350 * previewScale);

  const activeStyle = selectedBox === 'name' ? nameStyle : phoneStyle;
  const setActiveStyle = selectedBox === 'name' ? setNameStyle : setPhoneStyle;

  const colors = [
    { name: 'Vàng', value: '#FFFF00' },
    { name: 'Đỏ', value: '#FF0000' },
    { name: 'Xanh', value: '#003399' },
    { name: 'Xanh lá', value: '#00FF00' },
    { name: 'Cam', value: '#FF8800' },
    { name: 'Tím', value: '#8800FF' },
    { name: 'Hồng', value: '#FF00FF' },
    { name: 'Đen', value: '#000000' },
    { name: 'Trắng', value: '#FFFFFF' }
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
    <div className="relative w-full h-full flex flex-col bg-slate-100 overflow-hidden">
      {/* ─── POSTER ẨN (FIX CƠ CHẾ TẢI ẢNH) ─── */}
      <div style={{ position: 'fixed', left: '-10000px', top: 0, width: 1080, height: 1350, zIndex: -1000, overflow: 'visible' }}>
        <div ref={exportRef} style={{ position: 'relative', width: 1080, height: 1350, backgroundColor: '#fff', overflow: 'visible' }}>
          {selectedTemplate && (
            <img 
              src={`${selectedTemplate.image}?t=${Date.now()}`} 
              crossOrigin="anonymous" 
              style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }} 
              alt="Export Base" 
            />
          )}
          <DraggableTextBox value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} posterScale={1} isExporting={true} showShadow={showShadow} useGradient={useGradient} />
          <DraggableTextBox value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} posterScale={1} isExporting={true} showShadow={showShadow} useGradient={useGradient} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-2" style={{ touchAction: 'none' }}>
        {selectedTemplate ? (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* CANVAS THIẾT KẾ */}
            <div style={{ width: scaledW, height: scaledH, position: 'relative', touchAction: 'none', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1350, transform: `scale(${previewScale})`, transformOrigin: 'top left', background: '#fff', touchAction: 'none' }}>
                <div data-canvas="true" style={{ position: 'absolute', inset: 0, touchAction: 'none', backgroundColor: '#fff' }} onClick={() => setSelectedBox(null)}>
                  <img src={selectedTemplate.image} crossOrigin="anonymous" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} alt="Preview Base" />
                  <DraggableTextBox value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} setBoxStyle={setNameStyle} posterScale={previewScale} isSelected={selectedBox === 'name'} onSelect={() => setSelectedBox('name')} isExporting={isExporting} showShadow={showShadow} useGradient={useGradient} />
                  <DraggableTextBox value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} setBoxStyle={setPhoneStyle} posterScale={previewScale} isSelected={selectedBox === 'phone'} onSelect={() => setSelectedBox('phone')} isExporting={isExporting} showShadow={showShadow} useGradient={useGradient} />
                </div>
              </div>
            </div>

            {/* ─── SIDEBAR EDITOR VERSION 7.0 ─── */}
            {selectedBox && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2.5 bg-white/95 backdrop-blur-xl shadow-2xl rounded-[32px] border border-white/50 z-[200] w-[82px] items-center animate-in slide-in-from-right-8 duration-500">
                 {/* Bật/Tắt bóng */}
                 <button 
                   onClick={() => setShowShadow(!showShadow)}
                   className={`w-13 h-13 rounded-full flex flex-col items-center justify-center transition-all shadow-md ${showShadow ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                 >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[6px] font-black uppercase leading-none mt-1">BÓNG</span>
                 </button>

                 {/* Bật/Tắt Gradient */}
                 <button 
                   onClick={() => setUseGradient(!useGradient)}
                   className={`w-13 h-13 rounded-full flex flex-col items-center justify-center transition-all shadow-md mt-1 ${useGradient ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                 >
                    <Layers className="w-5 h-5" />
                    <span className="text-[6px] font-black uppercase leading-none mt-1">MÀU 3D</span>
                 </button>

                 <div className="w-full h-px bg-slate-100 my-1" />

                 {/* Màu (Tick siêu nhỏ) */}
                 <div className="grid grid-cols-2 gap-2">
                    {colors.map(c => (
                       <button 
                         key={c.value} 
                         onClick={() => setActiveStyle(prev => ({ ...prev, color: c.value }))}
                         className={`w-7 h-7 rounded-full border border-slate-200 shadow-sm flex items-center justify-center transition-transform active:scale-90`}
                         style={{ backgroundColor: c.value }}
                       >
                         {activeStyle.color === c.value && <div className={`w-1.5 h-1.5 rounded-full ${c.value === '#FFFF00' || c.value === '#FFFFFF' ? 'bg-blue-600' : 'bg-white'}`} />}
                       </button>
                    ))}
                 </div>

                 <div className="w-full h-px bg-slate-100 my-1" />

                 {/* Di chuyển */}
                 <div className="flex flex-col gap-1.5 w-full items-center">
                    <button onClick={() => nudge(0, -5)} className="w-full h-10 bg-slate-50 rounded-xl flex items-center justify-center active:bg-blue-100 border border-slate-100"><ChevronUp className="w-7 h-7 text-blue-600" /></button>
                    <div className="flex gap-1.5 w-full">
                       <button onClick={() => nudge(-5, 0)} className="w-full h-10 bg-slate-50 rounded-xl flex items-center justify-center active:bg-blue-100 border border-slate-100"><ChevronLeft className="w-7 h-7 text-blue-600" /></button>
                       <button onClick={() => nudge(5, 0)} className="w-full h-10 bg-slate-50 rounded-xl flex items-center justify-center active:bg-blue-100 border border-slate-100"><ChevronRight className="w-7 h-7 text-blue-600" /></button>
                    </div>
                    <button onClick={() => nudge(0, 5)} className="w-full h-10 bg-slate-50 rounded-xl flex items-center justify-center active:bg-blue-100 border border-slate-100"><ChevronDown className="w-7 h-7 text-blue-600" /></button>
                 </div>

                 <div className="w-full h-px bg-slate-100 my-1" />

                 {/* Cỡ chữ */}
                 <div className="flex gap-2 w-full">
                    <button onClick={() => setActiveStyle(prev => ({ ...prev, fontSize: prev.fontSize + 4 }))} className="w-full h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black active:scale-90 shadow-md">A+</button>
                    <button onClick={() => setActiveStyle(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 4) }))} className="w-full h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-black active:scale-90 border border-slate-100">A-</button>
                 </div>

                 <button onClick={() => setSelectedBox(null)} className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center active:bg-red-100 mt-2">
                    <X className="w-6 h-6" />
                 </button>
              </div>
            )}
          </div>
        ) : <p className="text-xs font-black text-slate-400 italic">INITIALIZING...</p>}
      </div>
    </div>
  );
};

export default PosterPreview;
