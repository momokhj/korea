import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Eraser,
  HelpCircle,
  PaintBucket,
  PenTool,
  Printer,
  RotateCcw,
  Undo2,
} from 'lucide-react';
import { playSoundEffect, speakKorean } from '../utils/audio';

interface ColoringModeProps {
  soundEnabled: boolean;
  ttsEnabled: boolean;
  onExitToMenu: () => void;
}

type ColoringTemplateId = 'taegeukgi' | 'mugunghwa' | 'hanbok' | 'hanok' | 'tiger';
type ToolMode = 'paint' | 'pen' | 'eraser';

interface ColorSwatch {
  hex: string;
  name: string;
}

const PALETTE: ColorSwatch[] = [
  { hex: '#CD2E3A', name: '태극 빨강' },
  { hex: '#0047A0', name: '태극 파랑' },
  { hex: '#0F172A', name: '검정' },
  { hex: '#FFFFFF', name: '하양' },
  { hex: '#FACC15', name: '노랑' },
  { hex: '#F9A8D4', name: '연분홍' },
  { hex: '#DB2777', name: '진분홍' },
  { hex: '#16A34A', name: '초록' },
  { hex: '#38BDF8', name: '하늘' },
  { hex: '#B45309', name: '갈색' },
];

const TEMPLATES: {
  id: ColoringTemplateId;
  title: string;
  guide: string;
  defaultHint: string;
}[] = [
  {
    id: 'taegeukgi',
    title: '태극기',
    guide: '바탕은 하양, 태극 위쪽은 빨강, 아래쪽은 파랑, 네 모서리 막대는 검정으로 칠해 보세요.',
    defaultHint: '위: 빨강 · 아래: 파랑 · 막대: 검정',
  },
  {
    id: 'mugunghwa',
    title: '무궁화',
    guide: '다섯 장의 꽃잎은 연분홍, 꽃 가운데는 진분홍과 노랑, 잎은 초록으로 칠해 보세요.',
    defaultHint: '꽃잎: 연분홍 · 중심: 진분홍/노랑 · 잎: 초록',
  },
  {
    id: 'hanbok',
    title: '한복',
    guide: '저고리와 치마를 내가 좋아하는 곱고 밝은 색으로 칠해 보세요.',
    defaultHint: '저고리: 노랑/하늘 · 고름: 파랑 · 치마: 분홍/빨강',
  },
  {
    id: 'hanok',
    title: '한옥',
    guide: '기와지붕은 검정이나 진한 회색, 벽은 연한 노랑, 문은 갈색으로 칠해 보세요.',
    defaultHint: '지붕: 검정 · 벽: 노랑/하양 · 기둥/문: 갈색',
  },
  {
    id: 'tiger',
    title: '호랑이',
    guide: '씩씩한 호랑이 얼굴은 노랑, 줄무늬는 검정, 스카프는 파랑과 빨강으로 칠해 보세요.',
    defaultHint: '얼굴: 노랑 · 줄무늬: 검정 · 스카프: 파랑/빨강',
  },
];

export const ColoringMode: React.FC<ColoringModeProps> = ({
  soundEnabled,
  ttsEnabled,
  onExitToMenu,
}) => {
  const [templateId, setTemplateId] = useState<ColoringTemplateId>('taegeukgi');
  const [tool, setTool] = useState<ToolMode>('paint');
  const [selectedColor, setSelectedColor] = useState<string>('#CD2E3A');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Paint-fill region colors & undo history
  const [regionColors, setRegionColors] = useState<Record<string, string>>({});
  const [paintHistory, setPaintHistory] = useState<Record<string, string>[]>([]);

  // Pen overlay canvas & undo snapshots
  const penCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [penHistory, setPenHistory] = useState<ImageData[]>([]);
  const [actionOrder, setActionOrder] = useState<('paint' | 'pen')[]>([]);

  const activeTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  const clearPenCanvas = () => {
    const canvas = penCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSelectTemplate = (id: ColoringTemplateId) => {
    setTemplateId(id);
    setRegionColors({});
    setPaintHistory([]);
    setPenHistory([]);
    setActionOrder([]);
    clearPenCanvas();
    const t = TEMPLATES.find((item) => item.id === id);
    if (t && ttsEnabled) {
      speakKorean(`${t.title} 색칠하기를 시작해요.`, true);
    }
  };

  const handleResetAll = () => {
    setRegionColors({});
    setPaintHistory([]);
    setPenHistory([]);
    setActionOrder([]);
    clearPenCanvas();
    playSoundEffect('flip', soundEnabled);
  };

  const handleRegionPaint = (regionId: string) => {
    if (tool !== 'paint') return;
    setPaintHistory((prev) => [...prev.slice(-24), { ...regionColors }]);
    setActionOrder((prev) => [...prev.slice(-24), 'paint']);
    setRegionColors((prev) => ({
      ...prev,
      [regionId]: selectedColor,
    }));
    playSoundEffect('flip', soundEnabled);
  };

  const getRegionFill = (regionId: string, fallback = '#FFFFFF') => {
    return regionColors[regionId] ?? fallback;
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = penCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePenDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === 'paint') return;
    const canvas = penCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setPenHistory((prev) => [...prev.slice(-24), snapshot]);
    setActionOrder((prev) => [...prev.slice(-24), 'pen']);

    const pt = getCanvasPoint(e);
    isDrawingRef.current = true;
    lastPointRef.current = pt;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = brushSize * 1.6;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x + 0.1, pt.y + 0.1);
    ctx.stroke();
    ctx.restore();
  };

  const handlePenMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || tool === 'paint') return;
    const canvas = penCanvasRef.current;
    const last = lastPointRef.current;
    if (!canvas || !last) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCanvasPoint(e);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = brushSize * 1.6;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();
    lastPointRef.current = pt;
  };

  const handlePenUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleUndo = () => {
    if (actionOrder.length === 0) return;
    const lastType = actionOrder[actionOrder.length - 1];
    setActionOrder((prev) => prev.slice(0, -1));

    if (lastType === 'paint' && paintHistory.length > 0) {
      const previous = paintHistory[paintHistory.length - 1];
      setPaintHistory((prev) => prev.slice(0, -1));
      setRegionColors(previous);
    } else if (lastType === 'pen' && penHistory.length > 0) {
      const canvas = penCanvasRef.current;
      const snapshot = penHistory[penHistory.length - 1];
      setPenHistory((prev) => prev.slice(0, -1));
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.putImageData(snapshot, 0, 0);
      }
    }
    playSoundEffect('flip', soundEnabled);
  };

  const handlePrint = () => {
    playSoundEffect('correct', soundEnabled);
    if (ttsEnabled) {
      speakKorean(`${activeTemplate.title} 완성 그림을 인쇄합니다.`, true);
    }
    window.print();
  };

  const handleDownloadPng = () => {
    const svgEl = svgRef.current;
    const penCanvas = penCanvasRef.current;
    if (!svgEl || !penCanvas) return;

    const out = document.createElement('canvas');
    out.width = 1200;
    out.height = 900;
    const ctx = out.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, out.width, out.height);

    const cloned = svgEl.cloneNode(true) as SVGSVGElement;
    cloned.setAttribute('width', '1200');
    cloned.setAttribute('height', '900');
    const svgStr = new XMLSerializer().serializeToString(cloned);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, out.width, out.height);
      ctx.drawImage(penCanvas, 0, 0, out.width, out.height);
      URL.revokeObjectURL(url);
      const pngUrl = out.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${activeTemplate.title}_색칠작품.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      playSoundEffect('correct', soundEnabled);
    };
    img.src = url;
  };

  useEffect(() => {
    // Keep canvas clean on mount
    clearPenCanvas();
  }, []);

  const renderColoringSvg = () => {
    const interactiveProps = (id: string) => ({
      onClick: () => handleRegionPaint(id),
      className: tool === 'paint' ? 'cursor-pointer hover:opacity-90 transition-opacity' : '',
    });

    switch (templateId) {
      case 'taegeukgi':
        return (
          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full select-none">
            {/* Flag Base */}
            <rect
              x="60"
              y="60"
              width="680"
              height="480"
              rx="16"
              fill={getRegionFill('flag-bg')}
              stroke="#0F172A"
              strokeWidth="6"
              {...interactiveProps('flag-bg')}
            />
            {/* Taegeuk Top & Bottom */}
            <g transform="translate(400 300) rotate(-34)">
              <path
                d="M-110,0 A110,110 0 0,1 110,0 A55,55 0 0,1 0,0 A55,55 0 0,0 -110,0 Z"
                fill={getRegionFill('taegeuk-top')}
                stroke="#0F172A"
                strokeWidth="5"
                {...interactiveProps('taegeuk-top')}
              />
              <path
                d="M110,0 A110,110 0 0,1 -110,0 A55,55 0 0,1 0,0 A55,55 0 0,0 110,0 Z"
                fill={getRegionFill('taegeuk-bottom')}
                stroke="#0F172A"
                strokeWidth="5"
                {...interactiveProps('taegeuk-bottom')}
              />
            </g>
            {/* Geon (top-left) */}
            <g transform="translate(185 165) rotate(-34)" {...interactiveProps('trig-geon')}>
              <rect x="-56" y="-42" width="112" height="84" fill="transparent" />
              <rect x="-48" y="-34" width="96" height="16" fill={getRegionFill('trig-geon')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="-8" width="96" height="16" fill={getRegionFill('trig-geon')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="18" width="96" height="16" fill={getRegionFill('trig-geon')} stroke="#0F172A" strokeWidth="4" />
            </g>
            {/* Gon (bottom-right) */}
            <g transform="translate(615 435) rotate(-34)" {...interactiveProps('trig-gon')}>
              <rect x="-56" y="-42" width="112" height="84" fill="transparent" />
              <rect x="-48" y="-34" width="42" height="16" fill={getRegionFill('trig-gon')} stroke="#0F172A" strokeWidth="4" />
              <rect x="6" y="-34" width="42" height="16" fill={getRegionFill('trig-gon')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="-8" width="42" height="16" fill={getRegionFill('trig-gon')} stroke="#0F172A" strokeWidth="4" />
              <rect x="6" y="-8" width="42" height="16" fill={getRegionFill('trig-gon')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="18" width="42" height="16" fill={getRegionFill('trig-gon')} stroke="#0F172A" strokeWidth="4" />
              <rect x="6" y="18" width="42" height="16" fill={getRegionFill('trig-gon')} stroke="#0F172A" strokeWidth="4" />
            </g>
            {/* Gam (top-right) */}
            <g transform="translate(615 165) rotate(34)" {...interactiveProps('trig-gam')}>
              <rect x="-56" y="-42" width="112" height="84" fill="transparent" />
              <rect x="-48" y="-34" width="42" height="16" fill={getRegionFill('trig-gam')} stroke="#0F172A" strokeWidth="4" />
              <rect x="6" y="-34" width="42" height="16" fill={getRegionFill('trig-gam')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="-8" width="96" height="16" fill={getRegionFill('trig-gam')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="18" width="42" height="16" fill={getRegionFill('trig-gam')} stroke="#0F172A" strokeWidth="4" />
              <rect x="6" y="18" width="42" height="16" fill={getRegionFill('trig-gam')} stroke="#0F172A" strokeWidth="4" />
            </g>
            {/* Ri (bottom-left) */}
            <g transform="translate(185 435) rotate(34)" {...interactiveProps('trig-ri')}>
              <rect x="-56" y="-42" width="112" height="84" fill="transparent" />
              <rect x="-48" y="-34" width="96" height="16" fill={getRegionFill('trig-ri')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="-8" width="42" height="16" fill={getRegionFill('trig-ri')} stroke="#0F172A" strokeWidth="4" />
              <rect x="6" y="-8" width="42" height="16" fill={getRegionFill('trig-ri')} stroke="#0F172A" strokeWidth="4" />
              <rect x="-48" y="18" width="96" height="16" fill={getRegionFill('trig-ri')} stroke="#0F172A" strokeWidth="4" />
            </g>
          </svg>
        );

      case 'mugunghwa':
        return (
          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full select-none">
            <rect x="0" y="0" width="800" height="600" fill="#FFFFFF" />
            {/* Stem */}
            <rect
              x="388"
              y="340"
              width="24"
              height="210"
              rx="12"
              fill={getRegionFill('stem')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('stem')}
            />
            {/* Leaves */}
            <ellipse
              cx="310"
              cy="460"
              rx="75"
              ry="34"
              transform="rotate(-24 310 460)"
              fill={getRegionFill('leaf-left')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('leaf-left')}
            />
            <ellipse
              cx="490"
              cy="450"
              rx="75"
              ry="34"
              transform="rotate(24 490 450)"
              fill={getRegionFill('leaf-right')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('leaf-right')}
            />
            {/* 5 Petals */}
            {[0, 72, 144, 216, 288].map((deg, idx) => (
              <ellipse
                key={deg}
                cx="400"
                cy="148"
                rx="82"
                ry="112"
                transform={`rotate(${deg} 400 265)`}
                fill={getRegionFill(`petal-${idx}`)}
                stroke="#0F172A"
                strokeWidth="5"
                {...interactiveProps(`petal-${idx}`)}
              />
            ))}
            {/* Inner Crimson Center */}
            <circle
              cx="400"
              cy="265"
              r="58"
              fill={getRegionFill('center-ring')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('center-ring')}
            />
            <circle
              cx="400"
              cy="265"
              r="26"
              fill={getRegionFill('stamen')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('stamen')}
            />
          </svg>
        );

      case 'hanbok':
        return (
          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full select-none">
            <rect x="0" y="0" width="800" height="600" fill="#FFFFFF" />
            {/* Chima (Skirt) split into 3 panels for fun coloring */}
            <path
              d="M275 245 L350 245 L310 545 Q235 545 170 520 Z"
              fill={getRegionFill('chima-left')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('chima-left')}
            />
            <path
              d="M350 245 L450 245 L490 545 Q400 562 310 545 Z"
              fill={getRegionFill('chima-mid')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('chima-mid')}
            />
            <path
              d="M450 245 L525 245 L630 520 Q565 545 490 545 Z"
              fill={getRegionFill('chima-right')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('chima-right')}
            />
            {/* Jeogori Sleeves */}
            <path
              d="M275 110 L130 220 L195 270 L285 205 Z"
              fill={getRegionFill('sleeve-left')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('sleeve-left')}
            />
            <path
              d="M525 110 L670 220 L605 270 L515 205 Z"
              fill={getRegionFill('sleeve-right')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('sleeve-right')}
            />
            {/* Jeogori Body */}
            <path
              d="M275 110 L345 75 L400 135 L455 75 L525 110 L525 245 L275 245 Z"
              fill={getRegionFill('jeogori-body')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('jeogori-body')}
            />
            {/* Dongjeong Collar */}
            <path
              d="M345 75 L400 135 L455 75 L438 68 L400 112 L362 68 Z"
              fill={getRegionFill('dongjeong')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('dongjeong')}
            />
            {/* Goreum Ribbon */}
            <path
              d="M392 155 L345 310 L372 318 L410 165 Z"
              fill={getRegionFill('goreum')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('goreum')}
            />
            <path
              d="M404 155 L452 330 L478 320 L422 155 Z"
              fill={getRegionFill('goreum')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('goreum')}
            />
            <circle
              cx="402"
              cy="155"
              r="18"
              fill={getRegionFill('goreum-knot')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('goreum-knot')}
            />
          </svg>
        );

      case 'hanok':
        return (
          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full select-none">
            <rect x="0" y="0" width="800" height="600" fill="#FFFFFF" />
            {/* Roof */}
            <path
              d="M70 250 Q400 75 730 250 L670 295 Q400 185 130 295 Z"
              fill={getRegionFill('roof')}
              stroke="#0F172A"
              strokeWidth="6"
              {...interactiveProps('roof')}
            />
            {/* Wall Left & Right */}
            <rect
              x="170"
              y="280"
              width="155"
              height="210"
              fill={getRegionFill('wall-left')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('wall-left')}
            />
            <rect
              x="475"
              y="280"
              width="155"
              height="210"
              fill={getRegionFill('wall-right')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('wall-right')}
            />
            {/* Windows */}
            <rect
              x="205"
              y="325"
              width="85"
              height="85"
              fill={getRegionFill('window-left')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('window-left')}
            />
            <rect
              x="510"
              y="325"
              width="85"
              height="85"
              fill={getRegionFill('window-right')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('window-right')}
            />
            {/* Center Door */}
            <rect
              x="325"
              y="280"
              width="75"
              height="210"
              fill={getRegionFill('door-left')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('door-left')}
            />
            <rect
              x="400"
              y="280"
              width="75"
              height="210"
              fill={getRegionFill('door-right')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('door-right')}
            />
            {/* Stone Foundation */}
            <rect
              x="130"
              y="490"
              width="540"
              height="50"
              rx="8"
              fill={getRegionFill('stone-base')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('stone-base')}
            />
          </svg>
        );

      case 'tiger':
        return (
          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full select-none">
            <rect x="0" y="0" width="800" height="600" fill="#FFFFFF" />
            {/* Ears */}
            <circle
              cx="230"
              cy="145"
              r="62"
              fill={getRegionFill('ear-left')}
              stroke="#0F172A"
              strokeWidth="6"
              {...interactiveProps('ear-left')}
            />
            <circle
              cx="570"
              cy="145"
              r="62"
              fill={getRegionFill('ear-right')}
              stroke="#0F172A"
              strokeWidth="6"
              {...interactiveProps('ear-right')}
            />
            {/* Face */}
            <circle
              cx="400"
              cy="285"
              r="185"
              fill={getRegionFill('face')}
              stroke="#0F172A"
              strokeWidth="6"
              {...interactiveProps('face')}
            />
            {/* Muzzle */}
            <ellipse
              cx="400"
              cy="345"
              rx="92"
              ry="68"
              fill={getRegionFill('muzzle')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('muzzle')}
            />
            {/* Forehead Stripe */}
            <polygon
              points="365,120 400,190 435,120"
              fill={getRegionFill('stripe-top')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('stripe-top')}
            />
            {/* Cheek Stripes */}
            <rect
              x="230"
              y="265"
              width="65"
              height="20"
              rx="10"
              fill={getRegionFill('stripe-left')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('stripe-left')}
            />
            <rect
              x="505"
              y="265"
              width="65"
              height="20"
              rx="10"
              fill={getRegionFill('stripe-right')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('stripe-right')}
            />
            {/* Eyes */}
            <circle cx="325" cy="255" r="18" fill="#0F172A" />
            <circle cx="475" cy="255" r="18" fill="#0F172A" />
            {/* Nose */}
            <polygon
              points="375,320 425,320 400,350"
              fill={getRegionFill('nose')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('nose')}
            />
            <path d="M360 370 Q400 400 440 370" fill="none" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
            {/* Scarf */}
            <path
              d="M275 450 Q400 500 525 450 L500 545 L300 545 Z"
              fill={getRegionFill('scarf')}
              stroke="#0F172A"
              strokeWidth="5"
              {...interactiveProps('scarf')}
            />
            <circle
              cx="400"
              cy="495"
              r="28"
              fill={getRegionFill('scarf-badge')}
              stroke="#0F172A"
              strokeWidth="4"
              {...interactiveProps('scarf-badge')}
            />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
      {/* Top Toolbar (Hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectTemplate(t.id)}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm md:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
                templateId === t.id
                  ? 'bg-[#0047A0] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowGuide((prev) => !prev);
              if (!showGuide) speakKorean(activeTemplate.guide, ttsEnabled);
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-sm font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>색깔 힌트</span>
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={actionOrder.length === 0}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-45 text-slate-800 text-sm font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4" />
            <span>되돌리기</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새로 칠하기</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-sm font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>그림 저장</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm md:text-base font-extrabold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄하기</span>
          </button>
        </div>
      </div>

      {showGuide && (
        <div
          role="status"
          className="no-print bg-amber-50 border-2 border-amber-300 rounded-2xl px-5 py-3 text-base font-bold text-amber-950"
        >
          색깔 힌트: {activeTemplate.guide}
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Control Panel (Hidden when printing) */}
        <aside className="no-print lg:col-span-4 bg-white border-2 border-slate-200 rounded-3xl p-5 space-y-5 shadow-sm">
          {/* Paint vs Pen Mode Switcher */}
          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">1. 색칠 방법 고르기</h2>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTool('paint')}
                className={`min-h-[56px] p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-sm font-bold transition-colors cursor-pointer ${
                  tool === 'paint'
                    ? 'bg-blue-50 border-[#0047A0] text-[#0047A0]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <PaintBucket className="w-5 h-5" />
                <span>칸 채우기</span>
              </button>

              <button
                type="button"
                onClick={() => setTool('pen')}
                className={`min-h-[56px] p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-sm font-bold transition-colors cursor-pointer ${
                  tool === 'pen'
                    ? 'bg-blue-50 border-[#0047A0] text-[#0047A0]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <PenTool className="w-5 h-5" />
                <span>펜으로 그리기</span>
              </button>

              <button
                type="button"
                onClick={() => setTool('eraser')}
                className={`min-h-[56px] p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-sm font-bold transition-colors cursor-pointer ${
                  tool === 'eraser'
                    ? 'bg-blue-50 border-[#0047A0] text-[#0047A0]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Eraser className="w-5 h-5" />
                <span>펜 지우개</span>
              </button>
            </div>
            <p className="text-sm font-medium text-slate-600">
              {tool === 'paint'
                ? '색깔을 고른 뒤 그림의 칸을 누르면 한 번에 칠해져요.'
                : tool === 'pen'
                  ? '손가락이나 마우스로 그림 위를 직접 문질러 색칠해 보세요.'
                  : '펜으로 그린 선을 문질러서 지울 수 있어요.'}
            </p>
          </div>

          {/* Pen Size Control */}
          {tool !== 'paint' && (
            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">펜 굵기</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { size: 8, label: '가늘게' },
                  { size: 16, label: '보통' },
                  { size: 28, label: '굵게' },
                ].map((b) => (
                  <button
                    key={b.size}
                    type="button"
                    onClick={() => setBrushSize(b.size)}
                    className={`min-h-[44px] rounded-xl border-2 text-sm font-bold cursor-pointer ${
                      brushSize === b.size
                        ? 'bg-[#0047A0] border-[#0047A0] text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Palette */}
          <div className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900">2. 색깔 고르기</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {PALETTE.map((swatch) => {
                const active = selectedColor === swatch.hex && tool !== 'eraser';
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => {
                      setSelectedColor(swatch.hex);
                      if (tool === 'eraser') setTool('pen');
                    }}
                    aria-label={`${swatch.name} 색 선택`}
                    className={`min-h-[48px] px-3 py-2 rounded-xl border-2 flex items-center gap-2.5 text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
                      active
                        ? 'border-[#0047A0] bg-blue-50 text-[#0047A0] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border border-slate-400 shrink-0"
                      style={{ backgroundColor: swatch.hex }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{swatch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onExitToMenu}
            className="w-full min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-base font-bold cursor-pointer"
          >
            처음 화면으로 돌아가기
          </button>
        </aside>

        {/* Right Printable Drawing Canvas */}
        <section className="lg:col-span-8 bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm print-sheet">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {activeTemplate.title} 색칠하기
            </h2>
            <span className="text-sm font-bold text-slate-500">
              {activeTemplate.defaultHint}
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-white border-2 border-slate-300 rounded-2xl overflow-hidden">
            {/* Layer 1: Clickable SVG Coloring Regions */}
            <div className="absolute inset-0">
              {renderColoringSvg()}
            </div>

            {/* Layer 2: Transparent Freehand Pen Canvas */}
            <canvas
              ref={penCanvasRef}
              width={1200}
              height={900}
              onPointerDown={handlePenDown}
              onPointerMove={handlePenMove}
              onPointerUp={handlePenUp}
              onPointerCancel={handlePenUp}
              className={`absolute inset-0 w-full h-full touch-none ${
                tool === 'paint' ? 'pointer-events-none' : 'pointer-events-auto cursor-crosshair'
              }`}
              aria-label={`${activeTemplate.title} 자유 색칠 캔버스`}
            />
          </div>

          <p className="hidden print:block mt-4 text-center text-lg font-bold text-slate-700">
            우리나라를 사랑하는 멋진 작품이 완성되었어요!
          </p>
        </section>
      </div>
    </div>
  );
};
