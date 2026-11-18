import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Hand,
  RotateCcw,
} from 'lucide-react';
import { SymbolQuestion } from '../data/symbols';
import { playSoundEffect, speakKorean } from '../utils/audio';
import { CharacterTrack } from './CharacterTrack';
import { MascotCharacterSvg, SymbolArtwork } from './SymbolArtwork';

interface PuzzleModeProps {
  questions: SymbolQuestion[];
  soundEnabled: boolean;
  ttsEnabled: boolean;
  onExitToMenu: () => void;
}

type PuzzleDifficulty = 6 | 9;

interface PuzzleTile {
  correctIndex: number; // 0..total-1
  row: number;
  col: number;
}

const PUZZLE_SYMBOL_KEYS = ['taegeukgi', 'mugunghwa', 'hanbok', 'hanok', 'dokdo'];

function shuffleTiles(total: number, cols: number): PuzzleTile[] {
  const arr: PuzzleTile[] = [];
  for (let i = 0; i < total; i++) {
    arr.push({
      correctIndex: i,
      row: Math.floor(i / cols),
      col: i % cols,
    });
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PuzzleMode: React.FC<PuzzleModeProps> = ({
  questions,
  soundEnabled,
  ttsEnabled,
  onExitToMenu,
}) => {
  const puzzleSymbols = useMemo(
    () => questions.filter((q) => PUZZLE_SYMBOL_KEYS.includes(q.symbolKey)),
    [questions]
  );

  const [selectedSymbolKey, setSelectedSymbolKey] = useState<string>('taegeukgi');
  const [pieceCount, setPieceCount] = useState<PuzzleDifficulty>(6);
  const [showHintGhost, setShowHintGhost] = useState<boolean>(false);

  const cols = 3;
  const rows = pieceCount === 6 ? 2 : 3;

  // Slots hold placed piece index (or null if empty)
  const [placedSlots, setPlacedSlots] = useState<(number | null)[]>(() =>
    Array(6).fill(null)
  );
  const [trayTiles, setTrayTiles] = useState<PuzzleTile[]>(() => shuffleTiles(6, 3));
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [wrongSlotIndex, setWrongSlotIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>(
    '퍼즐 조각을 끌어서 알맞은 빈칸에 놓아 보세요!'
  );

  // Pointer drag state (works seamlessly on touchscreens & mouse)
  const [draggingTile, setDraggingTile] = useState<PuzzleTile | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const dragOriginRef = useRef<{ x: number; y: number; active: boolean; tile: PuzzleTile } | null>(
    null
  );

  const activeSymbol =
    puzzleSymbols.find((s) => s.symbolKey === selectedSymbolKey) || puzzleSymbols[0];

  const resetPuzzle = (
    nextKey: string = selectedSymbolKey,
    nextCount: PuzzleDifficulty = pieceCount
  ) => {
    setSelectedSymbolKey(nextKey);
    setPieceCount(nextCount);
    setPlacedSlots(Array(nextCount).fill(null));
    setTrayTiles(shuffleTiles(nextCount, 3));
    setSelectedTileIndex(null);
    setWrongSlotIndex(null);
    setFeedback('퍼즐 조각을 끌어서 알맞은 빈칸에 놓아 보세요!');
  };

  const placedCount = placedSlots.filter((s) => s !== null).length;
  const isCompleted = placedCount === pieceCount;

  const tryPlacePiece = (tileIndex: number, targetSlotIndex: number) => {
    if (placedSlots[targetSlotIndex] !== null) return;

    if (tileIndex === targetSlotIndex) {
      const nextSlots = [...placedSlots];
      nextSlots[targetSlotIndex] = tileIndex;
      const nextPlacedCount = nextSlots.filter((s) => s !== null).length;

      setPlacedSlots(nextSlots);
      setTrayTiles((prev) => prev.filter((t) => t.correctIndex !== tileIndex));
      setSelectedTileIndex(null);

      if (nextPlacedCount === pieceCount) {
        playSoundEffect('victory', soundEnabled);
        setFeedback(`와! ${activeSymbol.title} 퍼즐을 모두 완성했어요!`);
        if (ttsEnabled) {
          speakKorean(`정말 잘했어요! ${activeSymbol.title} 퍼즐을 완성했어요!`, true);
        }
      } else {
        playSoundEffect('correct', soundEnabled);
        setFeedback(`잘 맞췄어요! (${nextPlacedCount} / ${pieceCount}조각 완성)`);
      }
    } else {
      playSoundEffect('retry', soundEnabled);
      setWrongSlotIndex(targetSlotIndex);
      setFeedback('조금 다른 자리예요! 힌트 그림자를 보며 다시 놓아볼까요?');
      if (ttsEnabled) {
        speakKorean('조금 다른 자리예요. 힌트를 보고 다시 놓아보세요.', true);
      }
      setTimeout(() => setWrongSlotIndex(null), 350);
    }
  };

  // Keyboard support: numbers 1..9 place selected piece into slot
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || selectedTileIndex === null) return;
      const num = parseInt(e.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= pieceCount) {
        e.preventDefault();
        tryPlacePiece(selectedTileIndex, num - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Pointer drag handlers for tray pieces
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, tile: PuzzleTile) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOriginRef.current = { x: e.clientX, y: e.clientY, active: false, tile };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const origin = dragOriginRef.current;
    if (!origin) return;
    const dist = Math.hypot(e.clientX - origin.x, e.clientY - origin.y);
    if (!origin.active && dist > 8) {
      origin.active = true;
      setDraggingTile(origin.tile);
      setSelectedTileIndex(origin.tile.correctIndex);
    }
    if (origin.active) {
      setDragPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = el?.closest('[data-puzzle-slot]') as HTMLElement | null;
      const idx = slotEl?.dataset.puzzleSlot ? parseInt(slotEl.dataset.puzzleSlot, 10) : null;
      setHoveredSlot(idx);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, tile: PuzzleTile) => {
    const origin = dragOriginRef.current;
    dragOriginRef.current = null;
    if (origin?.active) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = el?.closest('[data-puzzle-slot]') as HTMLElement | null;
      if (slotEl?.dataset.puzzleSlot) {
        const slotIdx = parseInt(slotEl.dataset.puzzleSlot, 10);
        tryPlacePiece(tile.correctIndex, slotIdx);
      }
    } else {
      // Tap/click fallback to select tile
      setSelectedTileIndex((prev) =>
        prev === tile.correctIndex ? null : tile.correctIndex
      );
    }
    setDraggingTile(null);
    setDragPos(null);
    setHoveredSlot(null);
  };

  // Renders an exact cropped slice of the selected symbol artwork
  const renderPieceSlice = (row: number, col: number) => {
    return (
      <div className="relative w-full h-full overflow-hidden bg-white">
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: `${cols * 100}%`,
            height: `${rows * 100}%`,
            transform: `translate(-${(col * 100) / cols}%, -${(row * 100) / rows}%)`,
          }}
        >
          <SymbolArtwork
            artworkId={activeSymbol.symbolKey}
            label={activeSymbol.title}
            customPhotoUrl={activeSymbol.customPhotoUrl}
            className="w-full h-full p-3"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-5">
      <CharacterTrack
        currentStep={placedCount}
        totalSteps={pieceCount}
        celebrating={isCompleted}
        label={`${activeSymbol.title} 퍼즐 완성 길`}
      />

      {/* Top Controls: Symbol Picker, 6/9 Pieces, Hint Tab */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {puzzleSymbols.map((sym) => (
            <button
              key={sym.symbolKey}
              type="button"
              onClick={() => resetPuzzle(sym.symbolKey, pieceCount)}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm md:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
                selectedSymbolKey === sym.symbolKey
                  ? 'bg-[#0047A0] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {sym.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => resetPuzzle(selectedSymbolKey, 6)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap ${
                pieceCount === 6
                  ? 'bg-white text-[#0047A0] shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              6조각 (3×2)
            </button>
            <button
              type="button"
              onClick={() => resetPuzzle(selectedSymbolKey, 9)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap ${
                pieceCount === 9
                  ? 'bg-white text-[#0047A0] shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              9조각 (3×3)
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowHintGhost((prev) => !prev);
              playSoundEffect('flip', soundEnabled);
            }}
            aria-pressed={showHintGhost}
            className={`min-h-[44px] px-4 py-2 rounded-xl border-2 text-sm font-extrabold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
              showHintGhost
                ? 'bg-amber-400 border-amber-500 text-slate-950'
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {showHintGhost ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showHintGhost ? '힌트 그림자 켜짐' : '힌트 그림자 보기'}</span>
          </button>

          <button
            type="button"
            onClick={() => resetPuzzle(selectedSymbolKey, pieceCount)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 섞기</span>
          </button>
        </div>
      </div>

      {/* Feedback Strip */}
      <div
        role="status"
        className={`rounded-2xl px-5 py-3.5 border-2 font-bold text-lg flex items-center gap-3 ${
          isCompleted
            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
            : 'bg-blue-50 border-blue-200 text-slate-900'
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
        ) : (
          <Hand className="w-6 h-6 text-[#0047A0] shrink-0" />
        )}
        <span>{feedback}</span>
      </div>

      {/* Main Puzzle Layout: Board + Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Puzzle Target Board */}
        <section className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-extrabold text-slate-900">
              {activeSymbol.title} 퍼즐 판
            </h2>
            <span className="text-sm font-bold text-[#0047A0] tabular-nums">
              완성 {placedCount} / {pieceCount} 조각
            </span>
          </div>

          <div
            className={`relative w-full ${
              pieceCount === 6 ? 'aspect-[3/2]' : 'aspect-square max-w-[520px] mx-auto'
            } bg-slate-100 border-2 border-slate-300 rounded-2xl overflow-hidden`}
          >
            {/* Ghost Silhouette Hint Layer */}
            {showHintGhost && (
              <div
                className="absolute inset-0 pointer-events-none opacity-30 grayscale-[20%]"
                aria-hidden="true"
              >
                <SymbolArtwork
                  artworkId={activeSymbol.symbolKey}
                  label={activeSymbol.title}
                  customPhotoUrl={activeSymbol.customPhotoUrl}
                  className="w-full h-full p-3"
                />
              </div>
            )}

            {/* Grid Drop Slots */}
            <div
              className="relative z-10 w-full h-full grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {placedSlots.map((placedIdx, slotIdx) => {
                const row = Math.floor(slotIdx / cols);
                const col = slotIdx % cols;
                const isOccupied = placedIdx !== null;
                const isHovered = hoveredSlot === slotIdx && !isOccupied;
                const isWrong = wrongSlotIndex === slotIdx;

                return (
                  <button
                    key={slotIdx}
                    type="button"
                    data-puzzle-slot={slotIdx}
                    disabled={isOccupied}
                    onClick={() => {
                      if (selectedTileIndex !== null) {
                        tryPlacePiece(selectedTileIndex, slotIdx);
                      }
                    }}
                    aria-label={`${slotIdx + 1}번 퍼즐 자리${isOccupied ? ' (완성됨)' : ''}`}
                    className={`relative border border-dashed transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 ${
                      isOccupied
                        ? 'border-emerald-400/50 cursor-default'
                        : isHovered
                          ? 'bg-blue-200/50 border-[#0047A0] border-2'
                          : selectedTileIndex !== null
                            ? 'border-blue-400 hover:bg-blue-100/50 cursor-pointer'
                            : 'border-slate-400/70'
                    } ${isWrong ? 'animate-gentle-shake bg-rose-200/60' : ''}`}
                  >
                    {isOccupied ? (
                      <div className="w-full h-full animate-pop-celebrate">
                        {renderPieceSlice(row, col)}
                      </div>
                    ) : (
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/85 border border-slate-300 text-slate-700 font-extrabold text-base tabular-nums shadow-xs">
                        {slotIdx + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right: Puzzle Pieces Tray or Completion Card */}
        <section className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
          {isCompleted ? (
            <div className="text-center py-6 space-y-5 animate-pop-celebrate">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                  <MascotCharacterSvg celebrating className="w-20 h-20" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {activeSymbol.title} 퍼즐 완성!
              </h3>
              <p className="text-base font-medium text-slate-700">
                조각을 알맞은 자리에 모두 정확하게 맞추었어요.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => resetPuzzle(selectedSymbolKey, pieceCount)}
                  className="min-h-[52px] px-6 py-3 rounded-2xl bg-[#0047A0] hover:bg-blue-800 text-white text-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>한 번 더 맞추기</span>
                </button>
                {pieceCount === 6 && (
                  <button
                    type="button"
                    onClick={() => resetPuzzle(selectedSymbolKey, 9)}
                    className="min-h-[52px] px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-lg font-bold cursor-pointer"
                  >
                    9조각으로 도전하기
                  </button>
                )}
                <button
                  type="button"
                  onClick={onExitToMenu}
                  className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-base font-bold cursor-pointer"
                >
                  처음 화면
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">퍼즐 조각 상자</h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  조각을 끌어서 왼쪽 빈칸에 놓거나, 조각을 누른 뒤 빈칸 번호를 누르세요.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {trayTiles.map((tile) => {
                  const isSelected = selectedTileIndex === tile.correctIndex;
                  const isDragging = draggingTile?.correctIndex === tile.correctIndex;
                  return (
                    <button
                      key={tile.correctIndex}
                      type="button"
                      onPointerDown={(e) => handlePointerDown(e, tile)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={(e) => handlePointerUp(e, tile)}
                      onPointerCancel={() => {
                        dragOriginRef.current = null;
                        setDraggingTile(null);
                        setDragPos(null);
                        setHoveredSlot(null);
                      }}
                      aria-label={`${activeSymbol.title} 퍼즐 조각`}
                      className={`aspect-square rounded-2xl border-2 overflow-hidden shadow-xs touch-none select-none transition-all cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 ${
                        isSelected
                          ? 'border-[#0047A0] ring-4 ring-blue-200 scale-[1.03]'
                          : 'border-slate-300 hover:border-[#0047A0]'
                      } ${isDragging ? 'opacity-40' : ''}`}
                    >
                      {renderPieceSlice(tile.row, tile.col)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Floating Dragging Piece */}
      {dragPos && draggingTile && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-2xl border-2 border-[#0047A0] overflow-hidden shadow-xl bg-white"
          style={{ left: dragPos.x, top: dragPos.y }}
          aria-hidden="true"
        >
          {renderPieceSlice(draggingTile.row, draggingTile.col)}
        </div>
      )}
    </div>
  );
};
