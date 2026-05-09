"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Header from '@/components/Header';
import HeroForm from '@/components/HeroForm';
import DesignPanel from '@/components/DesignPanel';
import PosterPreview from '@/components/PosterPreview';
import { LayoutTemplate, ChevronLeft, ChevronRight, CheckCircle2, X } from 'lucide-react';

/* ─── Template Style Presets ─── */
const DEFAULT_TEXT_COLOR = '#FFFF00'; 

const STYLE_STACK_BOTTOM = {
  defaultNameStyle:  { left: 235, top: 1115, width: 440, height: 60, fontSize: 38, color: DEFAULT_TEXT_COLOR, fontWeight: 900, align: 'left' },
  defaultPhoneStyle: { left: 235, top: 1212, width: 440, height: 70, fontSize: 52, color: DEFAULT_TEXT_COLOR, fontWeight: 900, align: 'left' }
};
const STYLE_SIDE_BY_SIDE = {
  defaultNameStyle:  { left: 105, top: 1042, width: 360, height: 55, fontSize: 32, color: DEFAULT_TEXT_COLOR, fontWeight: 900, align: 'left' },
  defaultPhoneStyle: { left: 575, top: 1042, width: 375, height: 55, fontSize: 32, color: DEFAULT_TEXT_COLOR, fontWeight: 900, align: 'left' }
};
const STYLE_SIDE_BY_SIDE_ALT = {
  defaultNameStyle:  { left: 105, top: 1120, width: 360, height: 55, fontSize: 32, color: DEFAULT_TEXT_COLOR, fontWeight: 900, align: 'left' },
  defaultPhoneStyle: { left: 575, top: 1120, width: 375, height: 55, fontSize: 32, color: DEFAULT_TEXT_COLOR, fontWeight: 900, align: 'left' }
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

export default function PosterGenerator() {
  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.4);
  const [designMode, setDesignMode] = useState(false);
  const [nameStyle, setNameStyle] = useState({ ...templates[0].defaultNameStyle });
  const [phoneStyle, setPhoneStyle] = useState({ ...templates[0].defaultPhoneStyle });

  const exportRef = useRef(null); 
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
    if (!teacherName.trim() || !phone.trim()) { alert("Vui lòng nhập đầy đủ thông tin."); return; }
    setDesignMode(true);
  };

  const handleDownload = async () => {
    if (!teacherName.trim() || !phone.trim()) { alert("Vui lòng nhập đầy đủ thông tin."); return; }
    setIsExporting(true);
    setTimeout(async () => {
      try {
        if (!exportRef.current) return;
        const dataUrl = await toPng(exportRef.current, { width: 1080, height: 1350, pixelRatio: 2, cacheBust: true });
        const link = document.createElement('a');
        link.download = `poster-${teacherName.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) { alert('Lỗi xuất ảnh. Hãy thử lại.'); } finally { setIsExporting(false); }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-dots pt-20 pb-12 px-4 sm:px-6">
      <Header />
      <div className="max-w-[1500px] mx-auto">
        <div className="mb-4 flex justify-center">
          <span className="px-4 py-1.5 bg-blue-800 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-xl border-2 border-white/20">
            Version - Mai Trường An - 0905012131
          </span>
        </div>

        <TemplateStrip templates={templates} selectedTemplate={selectedTemplate} onSelect={handleSelectTemplate} />

        <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 items-start">
          <div className="w-full xl:col-span-4" style={{ order: designMode ? -1 : 0 }}>
            {designMode ? (
              <DesignPanel teacherName={teacherName} setTeacherName={setTeacherName} phone={phone} setPhone={setPhone} nameStyle={nameStyle} setNameStyle={setNameStyle} defaultNameStyle={selectedTemplate.defaultNameStyle} phoneStyle={phoneStyle} setPhoneStyle={setPhoneStyle} defaultPhoneStyle={selectedTemplate.defaultPhoneStyle} onBack={() => setDesignMode(false)} onDownload={handleDownload} isExporting={isExporting} />
            ) : (
              <HeroForm teacherName={teacherName} setTeacherName={setTeacherName} phone={phone} setPhone={setPhone} onStart={handleStartDesign} isExporting={isExporting} />
            )}
          </div>
          <div ref={containerRef} className={`w-full xl:col-span-8 rounded-2xl overflow-hidden shadow-canvas bg-white border border-slate-200 flex flex-col ${designMode ? 'h-[520px] sm:h-[650px] xl:h-[calc(100vh-10rem)]' : 'h-[400px] sm:h-[500px]'}`}>
            <PosterPreview exportRef={exportRef} previewScale={previewScale} selectedTemplate={selectedTemplate} teacherName={teacherName} phone={phone} formatPhoneNumber={formatPhoneNumber} isExporting={isExporting} handleDownload={handleDownload} nameStyle={nameStyle} setNameStyle={setNameStyle} phoneStyle={phoneStyle} setPhoneStyle={setPhoneStyle} designMode={designMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

const TemplateStrip = ({ templates, selectedTemplate, onSelect }) => {
  const stripRef = useRef(null);
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Thư viện mẫu thiết kế</h3>
        </div>
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
                  {isActive && <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5"><CheckCircle2 className="w-3 h-3 text-white fill-white" /></div>}
                </div>
                <span className={`text-[10px] font-bold truncate w-[75px] text-center ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{tpl.name}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => stripRef.current?.scrollBy({ left: 240, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm text-slate-400 hover:text-blue-600"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
