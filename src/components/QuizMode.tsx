import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Hand,
  HelpCircle,
  RotateCcw,
  Star,
  Volume2,
} from 'lucide-react';
import {
  ChoiceOption,
  DIFFICULTY_META,
  SymbolQuestion,
} from '../data/symbols';
import { playSoundEffect, speakKorean } from '../utils/audio';
import { CharacterTrack } from './CharacterTrack';
import { MascotCharacterSvg, SymbolArtwork } from './SymbolArtwork';

interface QuizModeProps {
  questions: SymbolQuestion[];
  soundEnabled: boolean;
  ttsEnabled: boolean;
  onExitToMenu: () => void;
  onSwitchToMemory: () => void;
}

function shuffleChoices(choices: ChoiceOption[]): ChoiceOption[] {
  const arr = [...choices];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  questions,
  soundEnabled,
  ttsEnabled,
  onExitToMenu,
  onSwitchToMemory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [firstTryStars, setFirstTryStars] = useState(0);
  const [wrongAttemptsOnCurrent, setWrongAttemptsOnCurrent] = useState(0);
  const [dimmedChoiceIds, setDimmedChoiceIds] = useState<string[]>([]);
  const [shakeChoiceId, setShakeChoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<'ASKING' | 'RETRY' | 'CORRECT' | 'FINISHED'>('ASKING');
  const [showHint, setShowHint] = useState(false);

  // Pointer drag state for touch & mouse drag-and-drop
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredChoiceId, setHoveredChoiceId] = useState<string | null>(null);
  const dragOriginRef = useRef<{ x: number; y: number; active: boolean } | null>(null);

  const currentQuestion = questions[currentIndex];

  const shuffledChoices = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffleChoices(currentQuestion.choices);
  }, [currentQuestion]);

  useEffect(() => {
    if (status === 'ASKING' && currentQuestion && ttsEnabled) {
      speakKorean(`${currentQuestion.id}번 문제. ${currentQuestion.prompt}`, true);
    }
  }, [currentIndex, status, currentQuestion, ttsEnabled]);

  const handleSelectChoice = (choice: ChoiceOption) => {
    if (status === 'CORRECT' || status === 'FINISHED') return;
    if (dimmedChoiceIds.includes(choice.id)) return;

    if (choice.isCorrect) {
      playSoundEffect('correct', soundEnabled);
      if (ttsEnabled) {
        speakKorean(currentQuestion.celebrationText, true);
      }
      if (wrongAttemptsOnCurrent === 0) {
        setFirstTryStars((prev) => prev + 1);
      }
      setSolvedCount((prev) => prev + 1);
      setStatus('CORRECT');
    } else {
      playSoundEffect('retry', soundEnabled);
      setWrongAttemptsOnCurrent((prev) => prev + 1);
      setDimmedChoiceIds((prev) => [...prev, choice.id]);
      setShakeChoiceId(choice.id);
      setShowHint(true);
      setStatus('RETRY');
      if (ttsEnabled) {
        speakKorean('아쉬워요. 힌트를 보고 다시 한 번 골라볼까요?', true);
      }
      setTimeout(() => setShakeChoiceId(null), 350);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      playSoundEffect('victory', soundEnabled);
      setStatus('FINISHED');
      if (ttsEnabled) {
        speakKorean('정말 잘했어요! 열여섯 문제를 모두 맞혔어요!', true);
      }
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setWrongAttemptsOnCurrent(0);
    setDimmedChoiceIds([]);
    setShowHint(false);
    setStatus('ASKING');
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSolvedCount(0);
    setFirstTryStars(0);
    setWrongAttemptsOnCurrent(0);
    setDimmedChoiceIds([]);
    setShowHint(false);
    setStatus('ASKING');
  };

  // Keyboard shortcuts: 1-4 to pick choices, Enter/Space for next when correct
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (status === 'FINISHED') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (status === 'CORRECT' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNextQuestion();
        return;
      }

      const num = parseInt(e.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= shuffledChoices.length) {
        e.preventDefault();
        handleSelectChoice(shuffledChoices[num - 1]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Pointer drag handlers on the draggable symbol card
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (status === 'CORRECT' || status === 'FINISHED') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOriginRef.current = { x: e.clientX, y: e.clientY, active: false };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const origin = dragOriginRef.current;
    if (!origin) return;
    const dx = e.clientX - origin.x;
    const dy = e.clientY - origin.y;
    if (!origin.active && Math.hypot(dx, dy) > 10) {
      origin.active = true;
    }
    if (origin.active) {
      setDragPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const choiceBtn = el?.closest('[data-choice-id]') as HTMLElement | null;
      setHoveredChoiceId(choiceBtn?.dataset.choiceId ?? null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const origin = dragOriginRef.current;
    dragOriginRef.current = null;
    if (origin?.active) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const choiceBtn = el?.closest('[data-choice-id]') as HTMLElement | null;
      const choiceId = choiceBtn?.dataset.choiceId;
      if (choiceId) {
        const found = shuffledChoices.find((c) => c.id === choiceId);
        if (found) {
          handleSelectChoice(found);
        }
      }
    }
    setDragPos(null);
    setHoveredChoiceId(null);
  };

  if (status === 'FINISHED') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <CharacterTrack currentStep={questions.length} totalSteps={questions.length} celebrating />

        <section className="bg-white border-2 border-emerald-300 rounded-3xl p-8 md:p-10 text-center shadow-sm animate-pop-celebrate">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
              <MascotCharacterSvg celebrating className="w-20 h-20" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            짝 맞추기 16문제 모두 완료!
          </h2>
          <p className="text-lg md:text-xl text-slate-700 font-medium mb-8">
            우리나라를 대표하는 소중한 상징들을 모두 잘 찾았어요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-center justify-center gap-2 text-[#0047A0] font-bold text-base mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span>맞힌 문제</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {solvedCount} / {questions.length}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center justify-center gap-2 text-amber-700 font-bold text-base mb-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>한 번에 성공</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {firstTryStars}개
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-base mb-1">
                <Award className="w-5 h-5" />
                <span>나라 사랑 스티커</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">획득!</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleRestart}
              className="min-h-[56px] px-7 py-3.5 rounded-2xl bg-[#0047A0] hover:bg-blue-800 text-white text-lg font-bold flex items-center gap-2.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>처음부터 다시 풀기</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToMemory}
              className="min-h-[56px] px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-lg font-bold flex items-center gap-2.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>메모리 카드 게임 하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onExitToMenu}
              className="min-h-[56px] px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400 whitespace-nowrap shrink-0 cursor-pointer"
            >
              처음 화면
            </button>
          </div>
        </section>
      </div>
    );
  }

  const levelMeta = DIFFICULTY_META[currentQuestion.level];
  const gridColsClass =
    shuffledChoices.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : shuffledChoices.length === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-5">
      <CharacterTrack
        currentStep={solvedCount}
        totalSteps={questions.length}
        celebrating={status === 'CORRECT'}
      />

      {/* Quiet unboxed metadata line */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2 text-base font-bold text-slate-700">
          <span style={{ color: levelMeta.badgeColor }}>{levelMeta.name}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="tabular-nums text-slate-900">
            {currentIndex + 1} / {questions.length} 문제
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="inline-flex items-center gap-1 text-amber-700 tabular-nums">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            별 {firstTryStars}개
          </span>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-bold flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>초기화</span>
        </button>
      </div>

      {/* Single Question Stage (한 화면에 한 문제) */}
      <main className="bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Target Prompt & Draggable Symbol Card */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                dragOriginRef.current = null;
                setDragPos(null);
                setHoveredChoiceId(null);
              }}
              role="region"
              aria-label={`문제 ${currentIndex + 1}: ${currentQuestion.prompt}`}
              className={`w-full max-w-xs bg-[#F5F8FC] border-2 ${
                status === 'CORRECT' ? 'border-emerald-500 bg-emerald-50' : 'border-blue-200'
              } rounded-3xl p-6 flex flex-col items-center justify-center select-none ${
                status !== 'CORRECT' ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              <SymbolArtwork
                artworkId={currentQuestion.symbolKey}
                label={currentQuestion.title}
                customPhotoUrl={currentQuestion.customPhotoUrl}
                className="w-36 h-36 md:w-44 md:h-44"
              />
              {status !== 'CORRECT' && (
                <p className="mt-3 text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Hand className="w-4 h-4 text-[#0047A0]" />
                  <span>그림을 끌어서 짝에 놓거나 아래 카드를 누르세요</span>
                </p>
              )}
            </div>

            <div className="space-y-3 w-full">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug text-balance">
                {currentQuestion.prompt}
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => speakKorean(currentQuestion.prompt, true)}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0047A0] text-base font-bold flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>문제 다시 듣기</span>
                </button>

                {status !== 'CORRECT' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowHint((prev) => !prev);
                      if (!showHint) speakKorean(currentQuestion.hint, ttsEnabled);
                    }}
                    className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-base font-bold flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>힌트 보기</span>
                  </button>
                )}
              </div>

              {showHint && status !== 'CORRECT' && (
                <div
                  role="status"
                  className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 text-base font-bold text-amber-900"
                >
                  힌트: {currentQuestion.hint}
                </div>
              )}
            </div>
          </div>

          {/* Right: Choice Cards */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <p className="text-base font-bold text-slate-600 text-center lg:text-left">
              알맞은 그림과 이름 짝을 고르세요 (키보드 숫자 1~{shuffledChoices.length})
            </p>

            <div className={`grid ${gridColsClass} gap-4`}>
              {shuffledChoices.map((choice, idx) => {
                const isDimmed = dimmedChoiceIds.includes(choice.id);
                const isShaking = shakeChoiceId === choice.id;
                const isSolvedTarget = status === 'CORRECT' && choice.isCorrect;
                const isDragHovered = hoveredChoiceId === choice.id && !isDimmed;

                return (
                  <button
                    key={choice.id}
                    type="button"
                    data-choice-id={choice.id}
                    disabled={isDimmed || status === 'CORRECT'}
                    onClick={() => handleSelectChoice(choice)}
                    aria-label={`${idx + 1}번 보기: ${choice.label}${isDimmed ? ' (다시 골라보세요)' : ''}`}
                    className={`relative min-h-[168px] p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 ${
                      isSolvedTarget
                        ? 'bg-emerald-50 border-emerald-500 shadow-md animate-pop-celebrate'
                        : isDimmed
                          ? 'bg-slate-100 border-slate-200 opacity-45 cursor-not-allowed'
                          : isDragHovered
                            ? 'bg-blue-50 border-[#0047A0] scale-[1.03] shadow-md'
                            : 'bg-white border-slate-300 hover:border-[#0047A0] hover:bg-blue-50/60 shadow-sm cursor-pointer'
                    } ${isShaking ? 'animate-gentle-shake' : ''}`}
                  >
                    <span className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 font-extrabold text-base flex items-center justify-center tabular-nums">
                      {idx + 1}
                    </span>

                    <SymbolArtwork
                      artworkId={choice.artworkId}
                      label={choice.label}
                      customPhotoUrl={choice.isCorrect ? currentQuestion.customPhotoUrl : undefined}
                      className="w-24 h-24 md:w-28 md:h-28"
                    />

                    <span className="text-xl md:text-2xl font-extrabold text-slate-900">
                      {choice.label}
                    </span>

                    {isSolvedTarget && (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold text-base">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>정답!</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Step Bar */}
            {status === 'RETRY' && (
              <div
                role="alert"
                className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-6 h-6 text-[#CD2E3A] shrink-0" />
                  <p className="text-lg font-bold text-rose-900">
                    아쉬워요! 다른 그림 카드를 다시 골라볼까요?
                  </p>
                </div>
              </div>
            )}

            {status === 'CORRECT' && (
              <div
                role="status"
                className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pop-celebrate"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <p className="text-xl font-extrabold text-emerald-950">
                    {currentQuestion.celebrationText}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="min-h-[56px] px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-extrabold flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 >= questions.length ? '결과 보기' : '다음 문제'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Drag Ghost */}
      {dragPos && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-white/95 border-2 border-[#0047A0] rounded-2xl p-3 shadow-xl"
          style={{ left: dragPos.x, top: dragPos.y }}
          aria-hidden="true"
        >
          <SymbolArtwork
            artworkId={currentQuestion.symbolKey}
            label={currentQuestion.title}
            customPhotoUrl={currentQuestion.customPhotoUrl}
            className="w-24 h-24"
          />
        </div>
      )}
    </div>
  );
};
