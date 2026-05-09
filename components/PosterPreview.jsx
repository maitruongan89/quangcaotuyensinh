"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Move } from 'lucide-react';

/* ─── Draggable Text Box ─────────────────────────────────── */
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
    // Quan trọng: Phải bù trừ cả cuộn trang (scrollX, scrollY) nếu có
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
      
      // Ngăn chặn trình duyệt xử lý vuốt ngang/dọc (Back/Scroll)
      if (ev.cancelable) ev.preventDefault(); 
      
      const mX = ev.clientX || ev.touches?.[0]?.clientX;
      const mY = ev.clientY || ev.touches?.[0]?.clientY;
      const mp = getCanvasCoords(mX, mY);
      
      const d = dragState.current;
      if (d.type === 1) { // Kéo di chuyển
        setBoxStyle(prev => ({
          ...prev,
          left: Math.max(0, Math.min(1080 - prev.width, d.origLeft + (mp.x - d.startX))),
          top:  Math.max(0, Math.min(1350 - prev.height, d.origTop  + (mp.y - d.startY))),
        }));
      } else if (d.type === 2) { // Thay đổi kích thước
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

  const showActiveState = isSelected && !isExporting;
  const handleSize = Math.max(12, 24 / posterScale); 

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
        border: showActiveState ? `1.5px dashed #3B82F6` : 'none',
        boxSizing: 'border-box',
        touchAction: 'none', // Cực kỳ quan trọng để kéo ngang trên mobile
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
        fontFamily: 'inherit',
        lineHeight: 1.2,
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
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
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
  
  // Kích thước preview hiển thị
  const scaledW = Math.round(1080 * previewScale);
  const scaledH = Math.round(1350 * previewScale);

  return (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shrink-0 z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isExporting ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {isExporting ? 'Đang xuất file...' : 'Xem trước'}
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

      <div 
        className="flex-1 flex items-center justify-center bg-slate-100 relative overflow-hidden"
        style={{ touchAction: 'none' }} // Ngăn cuộn toàn vùng canvas
      >
        {designMode && !selectedBox && !isExporting && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-slate-900/90 text-white rounded-full text-[9px] font-bold shadow-2xl z-40">
             KÉO CHỮ ĐỂ DI CHUYỂN (NGANG/DỌC)
          </div>
        )}

        {selectedTemplate ? (
          <div 
            style={{ 
              width: scaledW, 
              height: scaledH, 
              position: 'relative',
              touchAction: 'none'
            }}
          >
            {/* Wrapper chuẩn 1080x1350 được scale để hiển thị */}
            <div style={{ 
              position: 'absolute', top: 0, left: 0, 
              width: 1080, height: 1350, 
              transform: `scale(${previewScale})`, 
              transformOrigin: 'top left', 
              background: '#fff',
              touchAction: 'none'
            }}>
              <div 
                ref={posterRef} 
                data-canvas="true" 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  touchAction: 'none', 
                  backgroundColor: '#fff',
                  // Đảm bảo không bị clip khi xuất
                  overflow: 'visible' 
                }} 
                onClick={() => setSelectedBox(null)}
              >
                <img 
                  src={selectedTemplate.image} 
                  crossOrigin="anonymous"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Poster Base" 
                />
                
                <DraggableTextBox 
                  value={teacherName || 'Tên giáo viên'} 
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
          <p className="text-xs font-bold text-slate-400">Đang tải...</p>
        )}
      </div>
    </div>
  );
};

export default PosterPreview;
