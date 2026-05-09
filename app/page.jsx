"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Header from '@/components/Header';
import HeroForm from '@/components/HeroForm';
import DesignPanel from '@/components/DesignPanel';
import PosterPreview, { DEFAULT_NAME_STYLE, DEFAULT_PHONE_STYLE } from '@/components/PosterPreview';

/* ─── All 27 templates ─────────────────────────────────────── */
const DEFAULT_TEACHER_BOX = { left: 180, top: 1100, width: 420, height: 60, fontSize: 36, color: '#003B8F', fontWeight: 900, align: 'center' };
const DEFAULT_PHONE_BOX   = { left: 180, top: 1210, width: 420, height: 70, fontSize: 48, color: '#003B8F', fontWeight: 900, align: 'center' };

const templates = [
  { id: 'mau-1', name: 'Mẫu 1',  image: '/templates/mau-1.png' },
  { id: 'mau-2', name: 'Mẫu 2',  image: '/templates/mau-2.png' },
  { id: 'c1',  name: 'Mẫu 3',  image: '/templates/ChatGPT Image 22_30_06 8 thg 5, 2026 (1).png' },
  { id: 'c2',  name: 'Mẫu 4',  image: '/templates/ChatGPT Image 22_35_50 8 thg 5, 2026 (1).png' },
  { id: 'c3',  name: 'Mẫu 5',  image: '/templates/ChatGPT Image 22_35_50 8 thg 5, 2026 (2).png' },
  { id: 'c4',  name: 'Mẫu 6',  image: '/templates/ChatGPT Image 22_35_51 8 thg 5, 2026 (3).png' },
  { id: 'c5',  name: 'Mẫu 7',  image: '/templates/ChatGPT Image 22_35_51 8 thg 5, 2026 (4).png' },
  { id: 'c6',  name: 'Mẫu 8',  image: '/templates/ChatGPT Image 22_47_15 8 thg 5, 2026 (1).png' },
  { id: 'c7',  name: 'Mẫu 9',  image: '/templates/ChatGPT Image 22_47_20 8 thg 5, 2026 (2).png' },
  { id: 'c8',  name: 'Mẫu 10', image: '/templates/ChatGPT Image 22_47_21 8 thg 5, 2026 (3).png' },
  { id: 'c9',  name: 'Mẫu 11', image: '/templates/ChatGPT Image 22_47_21 8 thg 5, 2026 (4).png' },
  { id: 'c10', name: 'Mẫu 12', image: '/templates/ChatGPT Image 22_47_49 8 thg 5, 2026.png' },
  { id: 'c11', name: 'Mẫu 13', image: '/templates/ChatGPT Image 22_48_04 8 thg 5, 2026.png' },
  { id: 'c12', name: 'Mẫu 14', image: '/templates/ChatGPT Image 22_58_53 8 thg 5, 2026 (1).png' },
  { id: 'c13', name: 'Mẫu 15', image: '/templates/ChatGPT Image 22_58_53 8 thg 5, 2026 (2).png' },
  { id: 'c14', name: 'Mẫu 16', image: '/templates/ChatGPT Image 22_58_53 8 thg 5, 2026 (3).png' },
  { id: 'c15', name: 'Mẫu 17', image: '/templates/ChatGPT Image 22_58_54 8 thg 5, 2026 (4).png' },
  { id: 'c16', name: 'Mẫu 18', image: '/templates/ChatGPT Image 23_11_43 8 thg 5, 2026 (1).png' },
  { id: 'c17', name: 'Mẫu 19', image: '/templates/ChatGPT Image 23_11_43 8 thg 5, 2026 (2).png' },
  { id: 'c18', name: 'Mẫu 20', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (3).png' },
  { id: 'c19', name: 'Mẫu 21', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (4).png' },
  { id: 'c20', name: 'Mẫu 22', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (5).png' },
  { id: 'c21', name: 'Mẫu 23', image: '/templates/ChatGPT Image 23_11_44 8 thg 5, 2026 (6).png' },
  { id: 'c22', name: 'Mẫu 24', image: '/templates/ChatGPT Image 23_19_32 8 thg 5, 2026 (1).png' },
  { id: 'c23', name: 'Mẫu 25', image: '/templates/ChatGPT Image 23_19_32 8 thg 5, 2026 (2).png' },
  { id: 'c24', name: 'Mẫu 26', image: '/templates/ChatGPT Image 23_19_32 8 thg 5, 2026 (3).png' },
  { id: 'c25', name: 'Mẫu 27', image: '/templates/ChatGPT Image 23_19_33 8 thg 5, 2026 (4).png' },
].map(t => ({ ...t, teacherBox: DEFAULT_TEACHER_BOX, phoneBox: DEFAULT_PHONE_BOX }));

export default function PosterGenerator() {
  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.4);
  const [designMode, setDesignMode] = useState(false);

  const [nameStyle, setNameStyle] = useState({ ...DEFAULT_NAME_STYLE });
  const [phoneStyle, setPhoneStyle] = useState({ ...DEFAULT_PHONE_STYLE });

  const posterRef = useRef(null);
  const containerRef = useRef(null);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setNameStyle({ ...DEFAULT_NAME_STYLE });
    setPhoneStyle({ ...DEFAULT_PHONE_STYLE });
  };

  /* ── Scale calculation: account for template strip height (~90px) and toolbar (~48px) ── */
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const h = containerRef.current.offsetHeight;
        const w = containerRef.current.offsetWidth;
        // Reserve: toolbar ~48px, strip ~82px, padding 16px
        const availH = h - 48 - 82 - 16;
        const availW = w - 24;
        const scale = Math.min(availH / 1350, availW / 1080);
        setPreviewScale(Math.max(0.1, scale));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const formatPhoneNumber = (val) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
    }
    return cleaned;
  };

  const handleStartDesign = () => {
    if (!teacherName.trim() || !phone.trim()) {
      alert("Vui lòng nhập đầy đủ tên giáo viên và số điện thoại.");
      return;
    }
    setDesignMode(true);
  };

  const handleDownload = async () => {
    if (!teacherName.trim() || !phone.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setIsExporting(true);
    setTimeout(async () => {
      try {
        if (!posterRef.current) return;
        const dataUrl = await toPng(posterRef.current, {
          width: 1080,
          height: 1350,
          pixelRatio: 2,
        });
        const link = document.createElement('a');
        link.download = `poster-${teacherName.toLowerCase().replace(/\s+/g, '-')}-${phone}.png`;
        link.href = dataUrl;
        link.click();
        alert("✅ Đã tải poster thành công!");
      } catch (err) {
        alert('Có lỗi khi xuất ảnh. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-dots pt-20 pb-6 px-4 sm:px-6">
      <Header />

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-80 -left-20 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

          {/* ── Left Column: Form only ── */}
          <div className="xl:col-span-4 order-2 xl:order-1 pb-20 xl:pb-0">
            {designMode ? (
              <div className="animate-in slide-in-from-left-4 duration-300">
                <DesignPanel
                  teacherName={teacherName}
                  setTeacherName={setTeacherName}
                  phone={phone}
                  setPhone={setPhone}
                  nameStyle={nameStyle}
                  setNameStyle={setNameStyle}
                  defaultNameStyle={DEFAULT_NAME_STYLE}
                  phoneStyle={phoneStyle}
                  setPhoneStyle={setPhoneStyle}
                  defaultPhoneStyle={DEFAULT_PHONE_STYLE}
                  onBack={() => setDesignMode(false)}
                  onDownload={handleDownload}
                  isExporting={isExporting}
                />
              </div>
            ) : (
              <div className="animate-in slide-in-from-left-4 duration-300">
                <HeroForm
                  teacherName={teacherName}
                  setTeacherName={setTeacherName}
                  phone={phone}
                  setPhone={setPhone}
                  onStart={handleStartDesign}
                  isExporting={isExporting}
                />
              </div>
            )}
          </div>

          {/* ── Right Column: Canvas + Template Strip ── */}
          <div
            ref={containerRef}
            className="xl:col-span-8 order-1 xl:order-2 xl:sticky xl:top-22 h-[600px] xl:h-[calc(100vh-7rem)] rounded-2xl overflow-hidden shadow-canvas bg-[#F1F5F9] bg-canvas-pattern border border-slate-200/80 flex flex-col"
          >
            <PosterPreview
              posterRef={posterRef}
              previewScale={previewScale}
              selectedTemplate={selectedTemplate}
              teacherName={teacherName}
              phone={phone}
              formatPhoneNumber={formatPhoneNumber}
              isExporting={isExporting}
              handleDownload={handleDownload}
              nameStyle={nameStyle}
              setNameStyle={setNameStyle}
              phoneStyle={phoneStyle}
              setPhoneStyle={setPhoneStyle}
              designMode={designMode}
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
