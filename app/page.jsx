"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Header from '@/components/Header';
import HeroForm from '@/components/HeroForm';
import DesignPanel from '@/components/DesignPanel';
import PosterPreview from '@/components/PosterPreview';
import { LayoutTemplate, ChevronLeft, ChevronRight, CheckCircle2, X } from 'lucide-react';

/* ─── Template Style Presets ─── */
const STYLE_STACK_BOTTOM = {
  defaultNameStyle:  { left: 235, top: 1115, width: 440, height: 60, fontSize: 38, color: '#003B8F', fontWeight: 900, align: 'left' },
  defaultPhoneStyle: { left: 235, top: 1212, width: 440, height: 70, fontSize: 52, color: '#003B8F', fontWeight: 900, align: 'left' }
};
const STYLE_SIDE_BY_SIDE = {
  defaultNameStyle:  { left: 105, top: 1042, width: 360, height: 55, fontSize: 32, color: '#003B8F', fontWeight: 900, align: 'left' },
  defaultPhoneStyle: { left: 575, top: 1042, width: 375, height: 55, fontSize: 32, color: '#003B8F', fontWeight: 900, align: 'left' }
};
const STYLE_SIDE_BY_SIDE_ALT = {
  defaultNameStyle:  { left: 105, top: 1120, width: 360, height: 55, fontSize: 32, color: '#003B8F', fontWeight: 900, align: 'left' },
  defaultPhoneStyle: { left: 575, top: 1120, width: 375, height: 55, fontSize: 32, color: '#003B8F', fontWeight: 900, align: 'left' }
};

const templates = [
  { id: 'mau-1', name: 'Mẫu 1',  image: '/templates/mau-1.png', ...STYLE_STACK_BOTTOM },
  { id: 'mau-2', name: 'Mẫu 2',  image: '/templates/mau-2.png', ...STYLE_STACK_BOTTOM },
  { id: 'c1',  name: 'Mẫu 3',  image: '/templates/ChatGPT Image 22_30_06 8 thg 5, 2026 (1).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c2',  name: 'Mẫu 4',  image: '/templates/ChatGPT Image 22_35_50 8 thg 5, 2026 (1).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c3',  name: 'Mẫu 5',  image: '/templates/ChatGPT Image 22_35_50 8 thg 5, 2026 (2).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c4',  name: 'Mẫu 6',  image: '/templates/ChatGPT Image 22_35_51 8 thg 5, 2026 (3).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c5',  name: 'Mẫu 7',  image: '/templates/ChatGPT Image 22_35_51 8 thg 5, 2026 (4).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c6',  name: 'Mẫu 8',  image: '/templates/ChatGPT Image 22_47_15 8 thg 5, 2026 (1).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c7',  name: 'Mẫu 9',  image: '/templates/ChatGPT Image 22_47_20 8 thg 5, 2026 (2).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c8',  name: 'Mẫu 10', image: '/templates/ChatGPT Image 22_47_21 8 thg 5, 2026 (3).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c9',  name: 'Mẫu 11', image: '/templates/ChatGPT Image 22_47_21 8 thg 5, 2026 (4).png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c10', name: 'Mẫu 12', image: '/templates/ChatGPT Image 22_47_49 8 thg 5, 2026.png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c11', name: 'Mẫu 13', image: '/templates/ChatGPT Image 22_48_04 8 thg 5, 2026.png', ...STYLE_SIDE_BY_SIDE },
  { id: 'c12', name: 'Mẫu 14', image: '/templates/ChatGPT Image 22_58_53 8 thg 5, 2026 (1).png', ...STYLE_STACK_BOTTOM },
  { id: 'c13', name: 'Mẫu 15', image: '/templates/ChatGPT Image 22_58_53 8 thg 5, 2026 (2).png', ...STYLE_STACK_BOTTOM },
  { id: 'c14', name: 'Mẫu 16', image: '/templates/ChatGPT Image 22_58_53 8 thg 5, 2026 (3).png', ...STYLE_STACK_BOTTOM },
  { id: 'c15', name: 'Mẫu 17', image: '/templates/ChatGPT Image 22_58_54 8 thg 5, 2026 (4).png', ...STYLE_STACK_BOTTOM },
  { id: 'c16', name: 'Mẫu 18', image: '/templates/ChatGPT Image 23_11_43 8 thg 5, 2026 (1).png', ...STYLE_STACK_BOTTOM },
  { id: 'c17', name: 'Mẫu 19', image: '/templates/ChatGPT Image 23_11_43 8 thg 5, 2026 (2).png', ...STYLE_STACK_BOTTOM },
  { id: 'c18', name: 'Mẫu 20', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (3).png', ...STYLE_STACK_BOTTOM },
  { id: 'c19', name: 'Mẫu 21', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (4).png', ...STYLE_STACK_BOTTOM },
  { id: 'c20', name: 'Mẫu 22', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (5).png', ...STYLE_STACK_BOTTOM },
  { id: 'c21', name: 'Mẫu 24', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (6).png', ...STYLE_STACK_BOTTOM },
  { id: 'c22', name: 'Mẫu 25', image: '/templates/ChatGPT Image 23_19_32 8 thg 5, 2026 (1).png', ...STYLE_SIDE_BY_SIDE_ALT },
  { id: 'c23', name: 'Mẫu 26', image: '/templates/ChatGPT Image 23_19_32 8 thg 5, 2026 (2).png', ...STYLE_SIDE_BY_SIDE_ALT },
  { id: 'c24', name: 'Mẫu 26', image: '/templates/ChatGPT Image 23_19_32 8 thg 5, 2026 (3).png', ...STYLE_SIDE_BY_SIDE_ALT },
  { id: 'c25', name: 'Mẫu 27', image: '/templates/ChatGPT Image 23_19_33 8 thg 5, 2026 (4).png', ...STYLE_SIDE_BY_SIDE_ALT },
];

/* ─── Template Preview Modal ─── */
const TemplatePreviewModal = ({ template, templates, onClose, onSelect, selectedTemplate }) => {
  const [current, setCurrent] = useState(templates.findIndex(t => t.id === template.id));
  const tpl = templates[current];
  const isSelected = selectedTemplate?.id === tpl.id;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-sm w-full animate-in zoom-in-95">
        <div className="flex items-center justify-between px-4 py-3 border-b"><h3 className="text-sm font-black">{tpl.name}</h3><button onClick={onClose} className="p-1 text-slate-400"><X /></button></div>
        <div className="relative bg-slate-100 flex items-center justify-center min-h-[400px]">
          <img src={tpl.image} alt={tpl.name} className="w-full object-contain max-h-[500px]" />
          <button onClick={() => setCurrent(i => (i - 1 + templates.length) % templates.length)} className="absolute left-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center"><ChevronLeft /></button>
          <button onClick={() => setCurrent(i => (i + 1) % templates.length)} className="absolute right-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center"><ChevronRight /></button>
        </div>
        <div className="p-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 border rounded-xl font-bold">Đóng</button>
          <button onClick={() => { onSelect(tpl); onClose(); }} className={`flex-1 py-3 rounded-xl font-bold text-white ${isSelected ? 'bg-emerald-600' : 'bg-blue-600'}`}>{isSelected ? 'Đang dùng' : 'Chọn mẫu'}</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Global Template Strip ─── */
const TemplateStrip = ({ templates, selectedTemplate, onSelect }) => {
  const [previewTpl, setPreviewTpl] = useState(null);
  const stripRef = useRef(null);
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Thư viện mẫu thiết kế</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-200">{templates.length} mẫu</span>
      </div>
      <div className="flex items-center gap-2 p-3">
        <button onClick={() => stripRef.current?.scrollBy({ left: -240, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm text-slate-400 hover:text-blue-600"><ChevronLeft className="w-4 h-4" /></button>
        <div ref={stripRef} className="flex-1 flex gap-3 overflow-x-auto scrollbar-hide py-1">
          {templates.map((tpl) => {
            const isActive = selectedTemplate?.id === tpl.id;
            return (
              <div key={tpl.id} className="shrink-0 flex flex-col items-center gap-1.5">
                <div className={`relative rounded-xl overflow-hidden w-[75px] h-[95px] cursor-pointer transition-all ${isActive ? 'ring-4 ring-blue-600 ring-offset-2' : 'hover:ring-2 hover:ring-slate-300'}`} onClick={() => onSelect(tpl)}>
                  <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); setPreviewTpl(tpl); }} className="bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg shadow-xl">XEM</button>
                  </div>
                  {isActive && <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5"><CheckCircle2 className="w-3 h-3 text-white fill-white" /></div>}
                  <button onClick={e => { e.stopPropagation(); setPreviewTpl(tpl); }} className="lg:hidden absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-black py-1">XEM</button>
                </div>
                <span className={`text-[10px] font-bold truncate w-[75px] text-center ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{tpl.name}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => stripRef.current?.scrollBy({ left: 240, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm text-slate-400 hover:text-blue-600"><ChevronRight className="w-4 h-4" /></button>
      </div>
      {previewTpl && <TemplatePreviewModal template={previewTpl} templates={templates} onClose={() => setPreviewTpl(null)} onSelect={onSelect} selectedTemplate={selectedTemplate} />}
    </div>
  );
};

export default function PosterGenerator() {
  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.4);
  const [designMode, setDesignMode] = useState(false);
  const [nameStyle, setNameStyle] = useState({ ...templates[0].defaultNameStyle });
  const [phoneStyle, setPhoneStyle] = useState({ ...templates[0].defaultPhoneStyle });

  const posterRef = useRef(null);
  const containerRef = useRef(null);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setNameStyle({ ...tpl.defaultNameStyle });
    setPhoneStyle({ ...tpl.defaultPhoneStyle });
  };

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const h = containerRef.current.offsetHeight;
        const w = containerRef.current.offsetWidth;
        const availH = h - 60; 
        const availW = w - 32;
        const scale = Math.min(availH / 1350, availW / 1080);
        setPreviewScale(Math.max(0.1, scale));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [designMode]);

  const formatPhoneNumber = (val) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length >= 10) return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
    return cleaned;
  };

  const handleStartDesign = () => {
    if (!teacherName.trim() || !phone.trim()) { alert("Vui lòng nhập đầy đủ tên và số điện thoại."); return; }
    setDesignMode(true);
  };

  const handleDownload = async () => {
    if (!teacherName.trim() || !phone.trim()) { alert("Vui lòng nhập đầy đủ thông tin."); return; }
    setIsExporting(true);
    
    // Đợi 200ms để đảm bảo UI đã ẩn hết các khung chọn trước khi chụp
    setTimeout(async () => {
      try {
        if (!posterRef.current) return;
        // Xuất ảnh chất lượng cao 2x pixelRatio
        const dataUrl = await toPng(posterRef.current, { 
          width: 1080, 
          height: 1350, 
          pixelRatio: 2,
          cacheBust: true,
          style: {
            transform: 'none',
            transformOrigin: 'top left'
          }
        });
        const link = document.createElement('a');
        link.download = `poster-${teacherName.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) { 
        alert('Lỗi xuất ảnh. Hãy thử tải lại trang và thử lại.'); 
        console.error(err);
      } finally { 
        setIsExporting(false); 
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-dots pt-20 pb-12 px-4 sm:px-6">
      <Header />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-white to-slate-50" />
      
      <div className="max-w-[1500px] mx-auto">
        {/* Version Badge */}
        <div className="mb-4 flex justify-center">
          <span className="px-4 py-1.5 bg-blue-700 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-xl">
            Version 4.0 - Mai Trường An
          </span>
        </div>

        {/* Global Template Library */}
        <TemplateStrip templates={templates} selectedTemplate={selectedTemplate} onSelect={handleSelectTemplate} />

        <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form */}
          <div className="w-full xl:col-span-4" style={{ order: designMode ? -1 : 0 }}>
            {designMode ? (
              <DesignPanel teacherName={teacherName} setTeacherName={setTeacherName} phone={phone} setPhone={setPhone} nameStyle={nameStyle} setNameStyle={setNameStyle} defaultNameStyle={selectedTemplate.defaultNameStyle} phoneStyle={phoneStyle} setPhoneStyle={setPhoneStyle} defaultPhoneStyle={selectedTemplate.defaultPhoneStyle} onBack={() => setDesignMode(false)} onDownload={handleDownload} isExporting={isExporting} />
            ) : (
              <HeroForm teacherName={teacherName} setTeacherName={setTeacherName} phone={phone} setPhone={setPhone} onStart={handleStartDesign} isExporting={isExporting} />
            )}
          </div>

          {/* Right Column: Canvas Container */}
          <div
            ref={containerRef}
            className={`w-full xl:col-span-8 rounded-2xl overflow-hidden shadow-canvas bg-white border border-slate-200 flex flex-col ${designMode ? 'h-[520px] sm:h-[650px] xl:h-[calc(100vh-10rem)]' : 'h-[400px] sm:h-[500px]'}`}
          >
            <PosterPreview posterRef={posterRef} previewScale={previewScale} selectedTemplate={selectedTemplate} teacherName={teacherName} phone={phone} formatPhoneNumber={formatPhoneNumber} isExporting={isExporting} handleDownload={handleDownload} nameStyle={nameStyle} setNameStyle={setNameStyle} phoneStyle={phoneStyle} setPhoneStyle={setPhoneStyle} designMode={designMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
