import React, { useState } from 'react';
import { GOVERNORATES } from '../../data/mockData';
import { MapPin, CheckCircle2, Compass } from 'lucide-react';

interface SyriaMapProps {
  visitedGovIds: string[];
  onSelectGov?: (govId: string) => void;
}

export const SyriaMap: React.FC<SyriaMapProps> = ({ visitedGovIds, onSelectGov }) => {
  const [hoveredGov, setHoveredGov] = useState<string | null>(null);

  // Grid coordinates and layout representation for Syria's 14 governorates
  // Providing an engaging, authentic cartographic layout
  const govCoordinates: { id: string; name: string; x: number; y: number; code: string }[] = [
    { id: 'latakia', name: 'اللاذقية', x: 22, y: 38, code: 'LA' },
    { id: 'tartus', name: 'طرطوس', x: 22, y: 55, code: 'TA' },
    { id: 'idlib', name: 'إدلب', x: 34, y: 30, code: 'ID' },
    { id: 'aleppo', name: 'حلب', x: 44, y: 24, code: 'AL' },
    { id: 'hama', name: 'حماة', x: 35, y: 46, code: 'HM' },
    { id: 'homs', name: 'حمص', x: 40, y: 62, code: 'HO' },
    { id: 'raqqa', name: 'الرقة', x: 62, y: 32, code: 'RA' },
    { id: 'hasakah', name: 'الحسكة', x: 82, y: 18, code: 'HA' },
    { id: 'deir_ez_zor', name: 'دير الزور', x: 78, y: 50, code: 'DZ' },
    { id: 'rif_dimashq', name: 'ريف دمشق', x: 30, y: 78, code: 'RD' },
    { id: 'damascus', name: 'دمشق', x: 33, y: 74, code: 'DM' },
    { id: 'quneitra', name: 'القنيطرة', x: 20, y: 86, code: 'QU' },
    { id: 'daraa', name: 'درعا', x: 28, y: 92, code: 'DA' },
    { id: 'suwayda', name: 'السويداء', x: 40, y: 92, code: 'SW' },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Map visual surface */}
      <div className="relative w-full aspect-16/10 sm:aspect-16/9 bg-[#0A2E36] rounded-2xl border border-[#1C4F5B] overflow-hidden p-4 sm:p-6 flex flex-col justify-between">
        {/* Topographic pattern overlay */}
        <div className="absolute inset-0 contour-pattern-dark opacity-30 pointer-events-none" />

        {/* Header inside map */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#7CFFCB]" />
            <span className="font-cairo font-bold text-sm text-[#F4EFE6]">
              خريطة الجمهورية العربية السورية (سجل الإنجازات)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D9603B]" />
              محافظة تمت زيارتها ({visitedGovIds.length} / 14)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#123F49] border border-[#1C4F5B]" />
              في انتظار استكشافها
            </span>
          </div>
        </div>

        {/* Interactive Governorates Nodes on Syria territory outline */}
        <div className="relative z-10 w-full h-full min-h-[220px]">
          {/* Subtle connecting lines between neighbouring regions */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 33 74 L 30 78 L 40 62 L 35 46 L 44 24 L 62 32 L 82 18 L 78 50 L 40 62 L 22 55 L 22 38 L 34 30 L 44 24 M 33 74 L 28 92 L 40 92 M 30 78 L 20 86"
              stroke="#7CFFCB"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
            />
          </svg>

          {govCoordinates.map(gov => {
            const isVisited = visitedGovIds.includes(gov.id);
            const isHovered = hoveredGov === gov.id;

            return (
              <button
                key={gov.id}
                type="button"
                onMouseEnter={() => setHoveredGov(gov.id)}
                onMouseLeave={() => setHoveredGov(null)}
                onClick={() => onSelectGov && onSelectGov(gov.id)}
                style={{ top: `${gov.y}%`, left: `${gov.x}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isVisited
                    ? 'bg-[#D9603B] text-white shadow-lg ring-2 ring-[#D9603B]/50 hover:scale-110'
                    : 'bg-[#123F49] text-gray-300 border border-[#1C4F5B] hover:border-[#7CFFCB] hover:text-[#7CFFCB]'
                }`}
                title={gov.name}
              >
                {isVisited ? (
                  <CheckCircle2 className="w-3.5 h-3.5 fill-white/20" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#7CFFCB]" />
                )}
                <span>{gov.name}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info strip inside map */}
        <div className="relative z-10 pt-2 border-t border-[#1C4F5B] flex items-center justify-between text-[11px] text-gray-400">
          <span>
            {hoveredGov
              ? `المحافظة المحددة: ${GOVERNORATES.find(g => g.id === hoveredGov)?.nameAr}`
              : 'مرر أو اضغط على أي محافظة لاستعراض الرحلات المتوفرة'}
          </span>
          <span className="text-[#7CFFCB]">
            نسبة استكشافك لسوريا: {Math.round((visitedGovIds.length / 14) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
