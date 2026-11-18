import React, { useState } from 'react';

interface SymbolArtworkProps {
  artworkId: string;
  label: string;
  customPhotoUrl?: string;
  className?: string;
}

export const SymbolArtwork: React.FC<SymbolArtworkProps> = ({
  artworkId,
  label,
  customPhotoUrl,
  className = 'w-28 h-28',
}) => {
  const [imgError, setImgError] = useState(false);

  if (customPhotoUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center ${className}`}>
        <img
          src={customPhotoUrl}
          alt={label}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} aria-hidden="true">
      {renderSvg(artworkId)}
    </div>
  );
};

function renderSvg(id: string): React.ReactNode {
  switch (id) {
    case 'taegeukgi':
      return (
        <svg viewBox="0 0 120 84" className="w-full h-full drop-shadow-sm">
          <rect x="4" y="4" width="112" height="76" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          {/* Taegeuk */}
          <g transform="translate(60 42) rotate(-34)">
            <path d="M-18,0 A18,18 0 0,1 18,0 A9,9 0 0,1 0,0 A9,9 0 0,0 -18,0 Z" fill="#CD2E3A" />
            <path d="M18,0 A18,18 0 0,1 -18,0 A9,9 0 0,1 0,0 A9,9 0 0,0 18,0 Z" fill="#0047A0" />
          </g>
          {/* Geon (top-left) */}
          <g transform="translate(24 20) rotate(-34)" fill="#0F172A">
            <rect x="-8" y="-6" width="16" height="2.6" />
            <rect x="-8" y="-1.3" width="16" height="2.6" />
            <rect x="-8" y="3.4" width="16" height="2.6" />
          </g>
          {/* Gon (bottom-right) */}
          <g transform="translate(96 64) rotate(-34)" fill="#0F172A">
            <rect x="-8" y="-6" width="7" height="2.6" /><rect x="1" y="-6" width="7" height="2.6" />
            <rect x="-8" y="-1.3" width="7" height="2.6" /><rect x="1" y="-1.3" width="7" height="2.6" />
            <rect x="-8" y="3.4" width="7" height="2.6" /><rect x="1" y="3.4" width="7" height="2.6" />
          </g>
          {/* Gam (top-right) */}
          <g transform="translate(96 20) rotate(34)" fill="#0F172A">
            <rect x="-8" y="-6" width="7" height="2.6" /><rect x="1" y="-6" width="7" height="2.6" />
            <rect x="-8" y="-1.3" width="16" height="2.6" />
            <rect x="-8" y="3.4" width="7" height="2.6" /><rect x="1" y="3.4" width="7" height="2.6" />
          </g>
          {/* Ri (bottom-left) */}
          <g transform="translate(24 64) rotate(34)" fill="#0F172A">
            <rect x="-8" y="-6" width="16" height="2.6" />
            <rect x="-8" y="-1.3" width="7" height="2.6" /><rect x="1" y="-1.3" width="7" height="2.6" />
            <rect x="-8" y="3.4" width="16" height="2.6" />
          </g>
        </svg>
      );

    case 'mugunghwa':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 86 L50 65" stroke="#15803D" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="38" cy="76" rx="10" ry="5" transform="rotate(-25 38 76)" fill="#22C55E" />
          <ellipse cx="62" cy="76" rx="10" ry="5" transform="rotate(25 62 76)" fill="#22C55E" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="50"
              cy="28"
              rx="15"
              ry="20"
              fill="#FBCFE8"
              stroke="#EC4899"
              strokeWidth="2"
              transform={`rotate(${deg} 50 48)`}
            />
          ))}
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={`c-${deg}`}
              cx="50"
              cy="40"
              rx="6"
              ry="10"
              fill="#BE185D"
              transform={`rotate(${deg} 50 48)`}
            />
          ))}
          <circle cx="50" cy="48" r="7" fill="#FACC15" />
        </svg>
      );

    case 'hanbok':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Chima (Skirt) */}
          <path d="M30 42 L70 42 L84 88 Q50 94 16 88 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="2.5" />
          <path d="M36 44 L28 88 M50 44 L50 90 M64 44 L72 88" stroke="#FDA4AF" strokeWidth="1.5" opacity="0.7" />
          {/* Jeogori (Jacket) */}
          <path d="M22 24 L38 18 L50 28 L62 18 L78 24 L86 44 L70 48 L66 36 L66 44 L34 44 L34 36 L30 48 L14 44 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
          {/* Dongjeong collar */}
          <path d="M38 18 L50 30 L62 18" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          {/* Goreum ribbon */}
          <path d="M48 34 L38 56 M50 34 L58 58" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="49" cy="34" r="3.5" fill="#0284C7" />
        </svg>
      );

    case 'aegukga':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="10" y="16" width="80" height="68" rx="12" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="3" />
          {/* Musical staff */}
          <line x1="20" y1="36" x2="80" y2="36" stroke="#93C5FD" strokeWidth="2" />
          <line x1="20" y1="48" x2="80" y2="48" stroke="#93C5FD" strokeWidth="2" />
          <line x1="20" y1="60" x2="80" y2="60" stroke="#93C5FD" strokeWidth="2" />
          {/* Music notes */}
          <circle cx="34" cy="58" r="7" fill="#0047A0" />
          <rect x="39" y="28" width="4" height="30" fill="#0047A0" />
          <circle cx="62" cy="50" r="7" fill="#CD2E3A" />
          <rect x="67" y="22" width="4" height="28" fill="#CD2E3A" />
          <path d="M39 28 L71 22 L71 29 L39 35 Z" fill="#0047A0" />
        </svg>
      );

    case 'hangeul':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="10" y="10" width="80" height="80" rx="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
          <text x="22" y="48" fontSize="28" fontWeight="800" fill="#0047A0">가</text>
          <text x="54" y="48" fontSize="28" fontWeight="800" fill="#CD2E3A">나</text>
          <text x="22" y="80" fontSize="28" fontWeight="800" fill="#059669">다</text>
          <text x="54" y="80" fontSize="28" fontWeight="800" fill="#7C3AED">라</text>
        </svg>
      );

    case 'seollal':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Tteokguk Bowl */}
          <path d="M16 54 Q50 50 84 54 L76 82 Q50 90 24 82 Z" fill="#FFFFFF" stroke="#0047A0" strokeWidth="3" />
          <ellipse cx="50" cy="54" rx="34" ry="10" fill="#FEF9C3" stroke="#0047A0" strokeWidth="2.5" />
          {/* Rice cakes */}
          <ellipse cx="38" cy="53" rx="8" ry="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <ellipse cx="54" cy="56" rx="8" ry="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <ellipse cx="62" cy="51" rx="7" ry="3.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Lucky pouch */}
          <path d="M36 36 Q50 42 64 36 L68 20 Q50 24 32 20 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <circle cx="50" cy="28" r="6" fill="#FACC15" />
        </svg>
      );

    case 'chuseok':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#1E293B" />
          <circle cx="50" cy="36" r="20" fill="#FDE047" />
          <circle cx="58" cy="30" r="3" fill="#FACC15" />
          {/* Songpyeon */}
          <path d="M24 72 Q36 58 48 72 Q36 80 24 72 Z" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M52 72 Q64 58 76 72 Q64 80 52 72 Z" fill="#4ADE80" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M38 80 Q50 66 62 80 Q50 88 38 80 Z" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );

    case 'kimchi':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="68" rx="36" ry="18" fill="#FFFFFF" stroke="#64748B" strokeWidth="3" />
          <path d="M24 62 Q36 32 52 46 Q66 30 76 62 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
          <path d="M34 58 Q46 38 56 54" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M52 56 Q62 42 68 58" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'bibimbap':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="52" r="38" fill="#1E293B" stroke="#475569" strokeWidth="3" />
          <circle cx="50" cy="52" r="31" fill="#F8FAFC" />
          <path d="M50 52 L50 23 A29 29 0 0,1 75 37 Z" fill="#22C55E" />
          <path d="M50 52 L75 37 A29 29 0 0,1 75 67 Z" fill="#F97316" />
          <path d="M50 52 L25 37 A29 29 0 0,1 50 23 Z" fill="#A16207" />
          <path d="M50 52 L25 67 A29 29 0 0,1 25 37 Z" fill="#DC2626" />
          <circle cx="50" cy="52" r="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="50" cy="52" r="6" fill="#FACC15" />
        </svg>
      );

    case 'hanok':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Giwa Roof */}
          <path d="M10 46 Q50 20 90 46 L80 54 Q50 40 20 54 Z" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
          {/* Walls */}
          <rect x="24" y="52" width="52" height="32" fill="#FEF3C7" stroke="#92400E" strokeWidth="2.5" />
          {/* Wooden pillars & door */}
          <rect x="42" y="56" width="16" height="28" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <line x1="50" y1="56" x2="50" y2="84" stroke="#78350F" strokeWidth="2" />
          <rect x="18" y="84" width="64" height="6" rx="2" fill="#94A3B8" />
        </svg>
      );

    case 'tiger':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="24" cy="28" r="11" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="76" cy="28" r="11" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="50" cy="54" r="32" fill="#FBBF24" stroke="#B45309" strokeWidth="3" />
          <ellipse cx="50" cy="64" rx="16" ry="12" fill="#FEF3C7" />
          {/* Stripes */}
          <path d="M44 26 L50 36 L56 26 M20 50 L30 52 M80 50 L70 52" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Eyes & nose */}
          <circle cx="38" cy="48" r="4" fill="#0F172A" />
          <circle cx="62" cy="48" r="4" fill="#0F172A" />
          <polygon points="45,58 55,58 50,64" fill="#EC4899" />
          <path d="M43 68 Q50 74 57 68" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'taegeuk':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          <g transform="translate(50 50) rotate(-30)">
            <path d="M-32,0 A32,32 0 0,1 32,0 A16,16 0 0,1 0,0 A16,16 0 0,0 -32,0 Z" fill="#CD2E3A" />
            <path d="M32,0 A32,32 0 0,1 -32,0 A16,16 0 0,1 0,0 A16,16 0 0,0 32,0 Z" fill="#0047A0" />
          </g>
        </svg>
      );

    case 'trigrams':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="8" y="8" width="84" height="84" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          {/* Top-left */}
          <g fill="#0F172A">
            <rect x="18" y="20" width="24" height="4" /><rect x="18" y="28" width="24" height="4" /><rect x="18" y="36" width="24" height="4" />
            {/* Top-right */}
            <rect x="58" y="20" width="10" height="4" /><rect x="72" y="20" width="10" height="4" />
            <rect x="58" y="28" width="24" height="4" />
            <rect x="58" y="36" width="10" height="4" /><rect x="72" y="36" width="10" height="4" />
            {/* Bottom-left */}
            <rect x="18" y="60" width="24" height="4" />
            <rect x="18" y="68" width="10" height="4" /><rect x="32" y="68" width="10" height="4" />
            <rect x="18" y="76" width="24" height="4" />
            {/* Bottom-right */}
            <rect x="58" y="60" width="10" height="4" /><rect x="72" y="60" width="10" height="4" />
            <rect x="58" y="68" width="10" height="4" /><rect x="72" y="68" width="10" height="4" />
            <rect x="58" y="76" width="10" height="4" /><rect x="72" y="76" width="10" height="4" />
          </g>
        </svg>
      );

    case 'gwanghwamun':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10 38 Q50 18 90 38 L84 44 L16 44 Z" fill="#1E293B" />
          <path d="M18 24 Q50 12 82 24 L76 30 L24 30 Z" fill="#334155" />
          <rect x="26" y="28" width="48" height="14" fill="#B91C1C" />
          <rect x="16" y="44" width="68" height="38" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
          {/* Three arches */}
          <path d="M24 82 L24 62 A6,6 0 0,1 36 62 L36 82 Z" fill="#334155" />
          <path d="M43 82 L43 58 A7,7 0 0,1 57 58 L57 82 Z" fill="#0F172A" />
          <path d="M64 82 L64 62 A6,6 0 0,1 76 62 L76 82 Z" fill="#334155" />
        </svg>
      );

    case 'dokdo':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="8" y="10" width="84" height="80" rx="12" fill="#DBEAFE" />
          {/* Sea */}
          <path d="M8 66 Q30 60 50 66 T92 66 L92 90 L8 90 Z" fill="#0284C7" />
          {/* Dongdo & Seodo */}
          <polygon points="18,68 34,34 48,68" fill="#78716C" stroke="#44403C" strokeWidth="2" />
          <polygon points="52,68 68,40 82,68" fill="#57534E" stroke="#44403C" strokeWidth="2" />
          {/* South Korean Taegeukgi on Dokdo */}
          <line x1="62" y1="44" x2="62" y2="15" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="62" y="15" width="24" height="16" rx="1" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
          <g transform="translate(74 23) rotate(-34)">
            <path d="M-4,0 A4,4 0 0,1 4,0 A2,2 0 0,1 0,0 A2,2 0 0,0 -4,0 Z" fill="#CD2E3A" />
            <path d="M4,0 A4,4 0 0,1 -4,0 A2,2 0 0,1 0,0 A2,2 0 0,0 4,0 Z" fill="#0047A0" />
          </g>
          {/* Four Trigrams (건곤감리) */}
          <g stroke="#0F172A" strokeWidth="0.9" strokeLinecap="butt">
            <line x1="64.5" y1="18.2" x2="67.5" y2="16.4" />
            <line x1="65.1" y1="19.1" x2="68.1" y2="17.3" />
            <line x1="65.7" y1="20" x2="68.7" y2="18.2" />

            <line x1="80.5" y1="16.4" x2="83.5" y2="18.2" />
            <line x1="79.9" y1="17.3" x2="82.9" y2="19.1" />
            <line x1="79.3" y1="18.2" x2="82.3" y2="20" />

            <line x1="64.5" y1="27.8" x2="67.5" y2="29.6" />
            <line x1="65.1" y1="26.9" x2="68.1" y2="28.7" />
            <line x1="65.7" y1="26" x2="68.7" y2="27.8" />

            <line x1="80.5" y1="29.6" x2="83.5" y2="27.8" />
            <line x1="79.9" y1="28.7" x2="82.9" y2="26.9" />
            <line x1="79.3" y1="27.8" x2="82.3" y2="26" />
          </g>
        </svg>
      );

    case 'patriotism':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 84 C20 66 12 46 12 32 C12 18 24 12 36 16 C43 18 48 24 50 28 C52 24 57 18 64 16 C76 12 88 18 88 32 C88 46 80 66 50 84 Z"
            fill="#FFE4E6"
            stroke="#E11D48"
            strokeWidth="3.5"
          />
          <g transform="translate(50 47) rotate(-30)">
            <path d="M-16,0 A16,16 0 0,1 16,0 A8,8 0 0,1 0,0 A8,8 0 0,0 -16,0 Z" fill="#CD2E3A" />
            <path d="M16,0 A16,16 0 0,1 -16,0 A8,8 0 0,1 0,0 A8,8 0 0,0 16,0 Z" fill="#0047A0" />
          </g>
        </svg>
      );

    // Distractor Artworks
    case 'sun':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="22" fill="#FACC15" stroke="#EA580C" strokeWidth="3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line key={deg} x1="50" y1="14" x2="50" y2="22" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" transform={`rotate(${deg} 50 50)`} />
          ))}
        </svg>
      );

    case 'sunflower':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="50" y1="88" x2="50" y2="56" stroke="#16A34A" strokeWidth="5" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse key={deg} cx="50" cy="22" rx="6" ry="14" fill="#FACC15" transform={`rotate(${deg} 50 44)`} />
          ))}
          <circle cx="50" cy="44" r="14" fill="#78350F" />
        </svg>
      );

    case 'tshirt':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M26 20 L38 16 Q50 24 62 16 L74 20 L88 38 L74 48 L68 40 L68 82 L32 82 L32 40 L26 48 L12 38 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
        </svg>
      );

    case 'birthday':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="22" y="48" width="56" height="32" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
          <path d="M22 58 Q36 66 50 58 T78 58" fill="none" stroke="#F43F5E" strokeWidth="4" />
          <rect x="47" y="26" width="6" height="22" fill="#3B82F6" />
          <ellipse cx="50" cy="20" rx="5" ry="7" fill="#F97316" />
        </svg>
      );

    case 'numbers':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="12" y="12" width="76" height="76" rx="14" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="3" />
          <text x="24" y="48" fontSize="26" fontWeight="800" fill="#4338CA">1</text>
          <text x="58" y="48" fontSize="26" fontWeight="800" fill="#4338CA">2</text>
          <text x="24" y="78" fontSize="26" fontWeight="800" fill="#4338CA">3</text>
          <text x="58" y="78" fontSize="26" fontWeight="800" fill="#4338CA">4</text>
        </svg>
      );

    case 'tree_star':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="44" y="72" width="12" height="16" fill="#78350F" />
          <polygon points="50,18 22,72 78,72" fill="#16A34A" stroke="#14532D" strokeWidth="2.5" />
          <circle cx="50" cy="18" r="7" fill="#FACC15" />
          <circle cx="44" cy="48" r="4" fill="#EF4444" />
          <circle cx="58" cy="60" r="4" fill="#3B82F6" />
        </svg>
      );

    case 'children_balloon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="38" cy="36" rx="18" ry="22" fill="#F43F5E" />
          <ellipse cx="64" cy="42" rx="16" ry="20" fill="#3B82F6" />
          <path d="M38 58 Q34 74 42 86 M64 62 Q68 74 58 86" stroke="#64748B" strokeWidth="2.5" fill="none" />
        </svg>
      );

    case 'sprout':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M22 82 L78 82" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 80 L50 44" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="36" cy="44" rx="14" ry="8" transform="rotate(-20 36 44)" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
          <ellipse cx="64" cy="44" rx="14" ry="8" transform="rotate(20 64 44)" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
        </svg>
      );

    case 'pumpkin':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="46" y="18" width="8" height="14" rx="2" fill="#15803D" />
          <ellipse cx="50" cy="56" rx="34" ry="26" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
          <polygon points="34,48 42,48 38,40" fill="#1E293B" />
          <polygon points="58,48 66,48 62,40" fill="#1E293B" />
          <path d="M34 62 Q50 74 66 62" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'pizza':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,16 18,80 82,80" fill="#FDE047" stroke="#D97706" strokeWidth="3" />
          <path d="M16 76 Q50 86 84 76" stroke="#D97706" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="46" r="5" fill="#DC2626" />
          <circle cx="40" cy="64" r="5" fill="#DC2626" />
          <circle cx="62" cy="62" r="5" fill="#DC2626" />
        </svg>
      );

    case 'burger':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M20 46 Q50 18 80 46 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <rect x="18" y="48" width="64" height="8" rx="4" fill="#22C55E" />
          <rect x="18" y="56" width="64" height="12" rx="4" fill="#78350F" />
          <rect x="20" y="68" width="60" height="12" rx="5" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
        </svg>
      );

    case 'spaghetti':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="66" rx="34" ry="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
          <path d="M26 58 Q40 34 50 56 T74 58" fill="none" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" />
          <circle cx="46" cy="52" r="8" fill="#DC2626" />
          <circle cx="58" cy="54" r="7" fill="#DC2626" />
        </svg>
      );

    case 'sushi':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="20" y="48" width="60" height="24" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
          <path d="M20 50 Q50 30 80 50 Z" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
          <rect x="44" y="40" width="12" height="32" fill="#1E293B" />
        </svg>
      );

    case 'tent':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,22 14,80 86,80" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <polygon points="50,48 38,80 62,80" fill="#0F172A" />
        </svg>
      );

    case 'igloo':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M16 74 A34,34 0 0,1 84 74 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
          <path d="M40 74 L40 54 A10,10 0 0,1 60 54 L60 74 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
        </svg>
      );

    case 'koala':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="24" cy="40" r="14" fill="#94A3B8" />
          <circle cx="76" cy="40" r="14" fill="#94A3B8" />
          <circle cx="50" cy="52" r="26" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <ellipse cx="50" cy="58" rx="6" ry="10" fill="#1E293B" />
          <circle cx="38" cy="48" r="3.5" fill="#0F172A" />
          <circle cx="62" cy="48" r="3.5" fill="#0F172A" />
        </svg>
      );

    case 'penguin':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="54" rx="26" ry="34" fill="#1E293B" />
          <ellipse cx="50" cy="60" rx="18" ry="24" fill="#FFFFFF" />
          <circle cx="42" cy="40" r="3.5" fill="#FFFFFF" />
          <circle cx="58" cy="40" r="3.5" fill="#FFFFFF" />
          <polygon points="44,48 56,48 50,56" fill="#F97316" />
        </svg>
      );

    case 'star_shape':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,14 61,38 88,41 68,59 73,86 50,73 27,86 32,59 12,41 39,38" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
        </svg>
      );

    case 'heart_shape':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 84 C20 66 14 46 14 34 C14 20 26 14 36 18 C43 20 48 26 50 30 C52 26 57 20 64 18 C74 14 86 20 86 34 C86 46 80 66 50 84 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="3" />
        </svg>
      );

    case 'square_shape':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="20" y="20" width="60" height="60" rx="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
        </svg>
      );

    case 'wave_pattern':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M12 40 Q30 22 50 40 T88 40" fill="none" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
          <path d="M12 62 Q30 44 50 62 T88 62" fill="none" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'flower_pattern':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <circle key={deg} cx="50" cy="28" r="12" fill="#A855F7" transform={`rotate(${deg} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="12" fill="#FACC15" />
        </svg>
      );

    case 'cloud_pattern':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M26 68 H74 A14,14 0 0,0 74 42 A18,18 0 0,0 38 36 A14,14 0 0,0 26 68 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="3" />
        </svg>
      );

    case 'eiffel':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,12 42,56 30,86 42,86 46,72 54,72 58,86 70,86 58,56" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
        </svg>
      );

    case 'liberty':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="34" y="64" width="32" height="24" fill="#94A3B8" />
          <path d="M40 64 L44 34 L56 34 L60 64 Z" fill="#10B981" />
          <circle cx="50" cy="26" r="8" fill="#10B981" />
          <line x1="62" y1="38" x2="72" y2="18" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
          <circle cx="72" cy="16" r="4" fill="#FACC15" />
        </svg>
      );

    case 'pyramid':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,18 14,80 86,80" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <line x1="50" y1="18" x2="62" y2="80" stroke="#D97706" strokeWidth="2" />
        </svg>
      );

    case 'desert':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="8" y="12" width="84" height="76" rx="12" fill="#FEF3C7" />
          <path d="M8 70 Q32 54 58 68 T92 64 L92 88 L8 88 Z" fill="#F59E0B" />
          <rect x="64" y="34" width="8" height="32" rx="4" fill="#16A34A" />
        </svg>
      );

    case 'glacier':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="8" y="12" width="84" height="76" rx="12" fill="#E0F2FE" />
          <polygon points="20,76 38,34 56,56 72,28 84,76" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
        </svg>
      );

    case 'volcano':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="18,82 38,40 62,40 82,82" fill="#57534E" />
          <path d="M38 40 L50 54 L62 40 Z" fill="#EF4444" />
          <circle cx="50" cy="24" r="10" fill="#CBD5E1" />
        </svg>
      );

    case 'prank':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="34" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          <path d="M32 42 L40 46 L32 50" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="62" cy="44" r="4" fill="#0F172A" />
          <path d="M36 64 Q50 72 64 64" stroke="#0F172A" strokeWidth="3" fill="none" />
          <path d="M48 68 L48 78 A4,4 0 0,0 56 78 L56 68 Z" fill="#F43F5E" />
        </svg>
      );

    case 'trash':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="28" y="34" width="44" height="48" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
          <rect x="22" y="24" width="56" height="10" rx="3" fill="#64748B" />
          <line x1="42" y1="44" x2="42" y2="72" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="44" x2="58" y2="72" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'forget':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="54" r="32" fill="#E2E8F0" stroke="#64748B" strokeWidth="3" />
          <line x1="34" y1="48" x2="44" y2="48" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <line x1="56" y1="48" x2="66" y2="48" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <text x="58" y="28" fontSize="18" fontWeight="800" fill="#475569">Zzz</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="36" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
        </svg>
      );
  }
}

export const MascotCharacterSvg: React.FC<{ celebrating?: boolean; className?: string }> = ({
  celebrating = false,
  className = 'w-12 h-12',
}) => (
  <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
    {/* Friendly Korean Tiger Mascot "호랑이 친구" */}
    <circle cx="20" cy="20" r="9" fill="#F59E0B" stroke="#92400E" strokeWidth="2.5" />
    <circle cx="60" cy="20" r="9" fill="#F59E0B" stroke="#92400E" strokeWidth="2.5" />
    <circle cx="40" cy="40" r="24" fill="#FBBF24" stroke="#92400E" strokeWidth="2.5" />
    <ellipse cx="40" cy="48" rx="12" ry="9" fill="#FEF3C7" />
    <path d="M35 19 L40 27 L45 19" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {celebrating ? (
      <>
        <path d="M27 36 Q31 31 35 36" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M45 36 Q49 31 53 36" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="31" cy="36" r="3" fill="#0F172A" />
        <circle cx="49" cy="36" r="3" fill="#0F172A" />
      </>
    )}
    <polygon points="36,44 44,44 40,49" fill="#E11D48" />
    <path d="M34 52 Q40 57 46 52" stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    {/* Little Taegeuk scarf */}
    <path d="M26 61 Q40 68 54 61 L50 72 L30 72 Z" fill="#0047A0" />
    <circle cx="40" cy="66" r="3.5" fill="#CD2E3A" />
  </svg>
);
