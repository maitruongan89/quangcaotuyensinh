"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Move, Check } from 'lucide-react';

/* ─── Draggable Text Box (PHIÊN BẢN SIÊU SẠCH) ──────────────── */
const DraggableTextBox = ({
  value, boxStyle, setBoxStyle,
  posterScale, isSelected, onSelect, isExporting
}) => {
  const dragState = useRef({ type: 0 }); 
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
    if (isExporting) return;
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
      if (d.type === 1) {
        setBoxStyle(prev => ({
          ...prev,
          left: Math.max(0, Math.min(1080 - prev.width, d.origLeft + (mp.x - d.startX))),
          top:  Math.max(0, Math.min(1350 - prev.height, d.origTop  + (mp.y - d.startY))),
        }));
      } else if (d.type === 2) {
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

  // Chỉ hiện chấm nhỏ ở góc khi được chọn và KHÔNG xuất ảnh
  const showActiveState = isSelected && !isExporting;
  const handleSize = Math.max(10, 20 / posterScale); 

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        left: `${boxStyle.left}px`,
        top:  `${boxStyle.top}px`,
        width:  `${boxStyle.width}px`,
        height: `${boxStyle.height}px`,
        cursor: isExporting ? 'default' : 'move',
        border: showActiveState ? `1px dashed #3B82F6` : 'none',
        boxSizing: 'border-box',
        touchAction: 'none',
        zIndex: isSelected ? 50 : 10,
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
        textAlign: boxStyle.align,
      }}>{value}</div>

      {showActiveState && (
        <div
          onMouseDown={e => startDrag(e, 2)}
          onTouchStart={e => startDrag(e, 2)}
          style={{
            position: 'absolute', bottom: -handleSize / 2, right: -handleSize / 2,
            width: handleSize, height: handleSize,
            background: '#3B82F6', borderRadius: '50%',
            cursor: 'se-resize', zIndex: 60,
            border: '2px solid white',
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

  // Preload image to fix mobile blank export
  useEffect(() => {
    if (selectedTemplate?.image) {
      const img = new Image();
      img.src = selectedTemplate.image;
    }
  }, [selectedTemplate]);

  return (
    <div className="relative w-full h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shrink-0 z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isExporting ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {isExporting ? 'Đang xử lý...' : 'Live Preview'}
          </h4>
        </div>
        <button 
          onClick={handleDownload} 
          disabled={isExporting} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          XUẤT ẢNH PNG
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-100 relative overflow-hidden p-2 sm:p-6">
        {designMode && !selectedBox && !isExporting && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-[9px] font-bold shadow-2xl z-40 animate-in fade-in zoom-in duration-500">
            <Move className="w-3 h-3 text-blue-400" /> CHẠM VÀO CHỮ ĐỂ DI CHUYỂN
          </div>
        )}

        {selectedTemplate ? (
          <div style={{ width: scaledW, height: scaledH, position: 'relative' }}>
            <div style={{ 
              position: 'absolute', top: 0, left: 0, 
              width: 1080, height: 1350, 
              transform: `scale(${previewScale})`, 
              transformOrigin: 'top left', 
              background: '#fff',
              boxShadow: isExporting ? 'none' : '0 20px 50px -10px rgba(0,0,0,0.15)' 
            }}>
              <div 
                ref={posterRef} 
                data-canvas="true" 
                style={{ position: 'absolute', inset: 0, touchAction: 'none', backgroundColor: '#fff' }} 
                onClick={() => setSelectedBox(null)}
              >
                {/* Background Image - Cần crossOrigin để html-to-image không bị lỗi trên mobile */}
                <img 
                  src={selectedTemplate.image} 
                  crossOrigin="anonymous"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Poster Base" 
                />
                
                <DraggableTextBox 
                  value={teacherName || 'Họ tên giáo viên'} 
                  boxStyle={nameStyle} 
                  setBoxStyle={setNameStyle} 
                  posterScale={previewScale} 
                  isSelected={selectedBox === 'name'} 
                  onSelect={() => setSelectedBox('name')} 
                  isExporting={isExporting}
                />
                
                <DraggableTextBox 
                  value={phone ? formatPhoneNumber(phone) : 'Số điện thoại'} 
                  boxStyle={phoneStyle} 
                  setBoxStyle={setPhoneStyle} 
                  posterScale={previewScale} 
                  isSelected={selectedBox === 'phone'} 
                  onSelect={() => setSelectedBox('phone')} 
                  isExporting={isExporting}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">Đang tải mẫu...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterPreview;
