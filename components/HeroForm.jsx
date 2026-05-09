import React from 'react';
import { User, Phone, ArrowRight, Loader2, Play } from 'lucide-react';
import FeatureBadges from './FeatureBadges';

const HeroForm = ({ teacherName, setTeacherName, phone, setPhone, onStart, isExporting }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h2 className="text-3xl lg:text-[2.5rem] font-black tracking-tight text-slate-900 leading-[1.15]">
          Tạo poster tuyển sinh <br className="hidden lg:block"/>
          <span className="text-blue-600">
            chỉ trong vài giây.
          </span>
        </h2>
        <p className="text-slate-500 font-medium text-base max-w-md leading-relaxed">
          Nhập thông tin giáo viên, chọn mẫu, kéo thả văn bản rồi xuất ảnh chuẩn <strong>1080×1350px</strong> tối ưu quảng cáo.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-card border border-slate-200/60 space-y-6">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Họ tên giáo viên</label>
            <div className="relative group">
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Ví dụ: Thầy Trần Anh"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-focus-ring transition-all outline-none font-semibold text-slate-900 text-base placeholder:text-slate-400 placeholder:font-medium"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Số điện thoại / Zalo</label>
            <div className="relative group">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="Nhập số điện thoại liên hệ"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-focus-ring transition-all outline-none font-semibold text-slate-900 text-base placeholder:text-slate-400 placeholder:font-medium"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onStart}
            disabled={isExporting}
            className={`flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Bắt đầu thiết kế <ArrowRight className="w-4 h-4" /></>}
          </button>
          <button className="px-6 py-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
            <Play className="w-4 h-4" />
            <span>Hướng dẫn</span>
          </button>
        </div>
      </div>

      <FeatureBadges />
    </div>
  );
};

export default HeroForm;
