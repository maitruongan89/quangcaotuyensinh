import React from 'react';
import { Palette, CheckCircle2 } from 'lucide-react';

const TemplateSelector = ({ templates, selectedTemplate, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600" />
          Mẫu thiết kế
        </h3>
        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100/80 px-2 py-0.5 rounded-md">
          {templates.length} Mẫu
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {templates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`group relative aspect-[1080/1350] rounded-xl overflow-hidden transition-all duration-300 ease-out bg-slate-100 ${
                isSelected 
                  ? 'ring-2 ring-blue-600 ring-offset-2 scale-[0.98]' 
                  : 'hover:ring-2 hover:ring-slate-300 hover:ring-offset-1 hover:-translate-y-0.5'
              }`}
            >
              <img 
                src={template.image} 
                alt={template.name} 
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isSelected ? 'scale-100' : 'group-hover:scale-105'
                }`}
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 bg-blue-900/10 transition-opacity duration-300 ${
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />

              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-blue-600 bg-white rounded-full shadow-sm animate-in zoom-in duration-200">
                  <CheckCircle2 className="w-5 h-5 fill-white" />
                </div>
              )}

              {/* Name Label */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                <p className="text-[10px] font-bold text-white leading-tight truncate">{template.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
