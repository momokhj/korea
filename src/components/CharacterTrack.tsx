import React from 'react';
import { Flag } from 'lucide-react';
import { MascotCharacterSvg } from './SymbolArtwork';

interface CharacterTrackProps {
  currentStep: number;
  totalSteps: number;
  celebrating?: boolean;
  label?: string;
}

export const CharacterTrack: React.FC<CharacterTrackProps> = ({
  currentStep,
  totalSteps,
  celebrating = false,
  label = '호랑이 친구 이동 길',
}) => {
  const safeTotal = Math.max(1, totalSteps);
  const clamped = Math.min(safeTotal, Math.max(0, currentStep));
  const percent = Math.round((clamped / safeTotal) * 100);

  return (
    <section
      aria-label={label}
      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-[#0047A0] tabular-nums">
          {clamped} / {safeTotal} 걸음 도착
        </span>
      </div>

      <div className="relative h-14 flex items-center px-3">
        {/* Track background */}
        <div
          className="relative w-full h-3.5 bg-slate-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={safeTotal}
          aria-label={`${safeTotal}걸음 중 ${clamped}걸음 이동`}
        >
          <div
            className="h-full bg-[#0047A0] transition-transform duration-300 ease-out origin-left"
            style={{ transform: `scaleX(${clamped / safeTotal})` }}
          />
        </div>

        {/* Step dots */}
        <div className="absolute inset-x-3 flex justify-between items-center pointer-events-none">
          {Array.from({ length: safeTotal + 1 }).map((_, idx) => {
            const passed = idx <= clamped;
            return (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full border ${
                  passed
                    ? 'bg-amber-400 border-amber-600'
                    : 'bg-white border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {/* Walking Mascot */}
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-300 ease-out pointer-events-none"
          style={{ left: `calc(${percent}% * 0.92 + 4%)` }}
        >
          <div className={celebrating ? 'animate-pop-celebrate' : ''}>
            <MascotCharacterSvg celebrating={celebrating} className="w-12 h-12 drop-shadow-sm" />
          </div>
        </div>

        {/* Finish Flag */}
        <div
          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-[#CD2E3A]"
          aria-hidden="true"
        >
          <Flag className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};
