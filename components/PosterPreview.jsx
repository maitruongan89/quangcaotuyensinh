"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Move } from 'lucide-react';

/* ─── Draggable Text Box (PHIÊN BẢN CHỮ GRADIENT CAO CẤP) ────── */
const DraggableTextBox = ({
  value, boxStyle, setBoxStyle,
  posterScale, isSelected, onSelect, isExporting
}) => {
  const dragState = useRef({ type: 0 }); 
  const boxRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current && !dragState.current.type) {
      const width = textRef.current.offsetWidth + 20;
      if (width !== boxStyle.width) {
        setBoxStyle(prev => ({ ...prev, width: Math.min(1000, Math.max(60, width)) }));
      }
    }
  }, [value, boxStyle.fontSize, boxStyle.fontWeight]);

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
    if (isExporting) return;
    e.stopPropagation();
    onSelect();
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
  const handleSize = Math.max(14, 28 / posterScale); 

  // Tạo hiệu ứng Gradient cho chữ
  const textGradientStyle = {
    background: boxStyle.color === '#FFFFFF' 
      ? 'linear-gradient(to bottom, #FFFFFF 30%, #E2E8F0 100%)' // Trắng bạc
      : boxStyle.color === '#FFFF00'
        ? 'linear-gradient(to bottom, #FFFF00 30%, #FFA500 100%)' // Vàng cam Gold
        : 'none',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: isExporting ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none', // Đổ bóng khi xuất ảnh
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
        border: showActiveState ? `1.5px dashed #3B82F6` : 'none',
        boxSizing: 'border-box',
        touchAction: 'none',
        zIndex: isSelected ? 50 : 10,
        display: 'inline-block',
      }}
      onMouseDown={e => startDrag(e, 1)}
      onTouchStart={e => startDrag(e, 1)}
    >
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
          filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.4))', // Đổ bóng cho chữ nổi bật trên nền xanh
          ...(boxStyle.color === '#FFFFFF' || boxStyle.color === '#FFFF00' ? textGradientStyle : {})
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
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
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
  const scaledH = Math.round(1350 * posterScale || 1350 * previewScale);

  return (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shrink-0 z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isExporting ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {isExporting ? 'Đang xuất file...' : 'Xem trước'}
          </h4>
        </div>
        <button onClick={handleDownload} disabled={isExporting} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} XUẤT ẢNH PNG
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-100 relative overflow-hidden" style={{ touchAction: 'none' }}>
        {designMode && !selectedBox && !isExporting && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-slate-900/90 text-white rounded-full text-[9px] font-bold shadow-2xl z-40">KÉO CHỮ ĐỂ DI CHUYỂN</div>
        )}
        {selectedTemplate ? (
          <div style={{ width: scaledW, height: Math.round(1350 * previewScale), position: 'relative', touchAction: 'none' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 1350, transform: `scale(${previewScale})`, transformOrigin: 'top left', background: '#fff', touchAction: 'none' }}>
              <div ref={posterRef} data-canvas="true" style={{ position: 'absolute', inset: 0, touchAction: 'none', backgroundColor: '#fff', overflow: 'visible' }} onClick={() => setSelectedBox(null)}>
                <img src={selectedTemplate.image} crossOrigin="anonymous" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="Poster Base" />
                <DraggableTextBox value={teacherName || 'Tên giáo viên'} boxStyle={nameStyle} setBoxStyle={setNameStyle} posterScale={previewScale} isSelected={selectedBox === 'name'} onSelect={() => setSelectedBox('name')} isExporting={isExporting} />
                <DraggableTextBox value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} boxStyle={phoneStyle} setBoxStyle={setPhoneStyle} posterScale={previewScale} isSelected={selectedBox === 'phone'} onSelect={() => setSelectedBox('phone')} isExporting={isExporting} />
              </div>
            </div>
          </div>
        ) : <p className="text-xs font-bold text-slate-400">Đang tải...</p>}
      </div>
    </div>
  );
};

export default PosterPreview;
