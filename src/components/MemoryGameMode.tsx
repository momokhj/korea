import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { SymbolQuestion } from '../data/symbols';
import { playSoundEffect, speakKorean } from '../utils/audio';
import { CharacterTrack } from './CharacterTrack';
import { MascotCharacterSvg, SymbolArtwork } from './SymbolArtwork';

interface MemoryGameModeProps {
  questions: SymbolQuestion[];
  soundEnabled: boolean;
  ttsEnabled: boolean;
  onExitToMenu: () => void;
}

interface MemoryCard {
  uid: string;
  symbolKey: string;
  title: string;
  customPhotoUrl?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type MemoryDifficulty = 4 | 6 | 8;

const MEMORY_LEVELS: { pairs: MemoryDifficulty; label: string; desc: string }[] = [
  { pairs: 4, label: '1단계 · 4쌍 (8장)', desc: '큰 카드 8장으로 가볍게 시작해요' },
  { pairs: 6, label: '2단계 · 6쌍 (12장)', desc: '카드 12장으로 실력을 키워요' },
  { pairs: 8, label: '3단계 · 8쌍 (16장)', desc: '카드 16장 도전에 성공해 보세요' },
];

function buildDeck(questions: SymbolQuestion[], pairCount: MemoryDifficulty): MemoryCard[] {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const selected = pool.slice(0, pairCount);
  const cards: MemoryCard[] = [];
  selected.forEach((item) => {
    cards.push({
      uid: `${item.symbolKey}-a`,
      symbolKey: item.symbolKey,
      title: item.title,
      customPhotoUrl: item.customPhotoUrl,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      uid: `${item.symbolKey}-b`,
      symbolKey: item.symbolKey,
      title: item.title,
      customPhotoUrl: item.customPhotoUrl,
      isFlipped: false,
      isMatched: false,
    });
  });

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export const MemoryGameMode: React.FC<MemoryGameModeProps> = ({
  questions,
  soundEnabled,
  ttsEnabled,
  onExitToMenu,
}) => {
  const [pairCount, setPairCount] = useState<MemoryDifficulty>(4);
  const [cards, setCards] = useState<MemoryCard[]>(() => buildDeck(questions, 4));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedbackText, setFeedbackText] = useState('같은 우리나라 상징 카드 두 장을 찾아보세요!');

  const resetGame = (newPairs: MemoryDifficulty = pairCount) => {
    setPairCount(newPairs);
    setCards(buildDeck(questions, newPairs));
    setSelectedIndices([]);
    setMatchedPairs(0);
    setAttempts(0);
    setLocked(false);
    setFeedbackText('같은 우리나라 상징 카드 두 장을 찾아보세요!');
  };

  useEffect(() => {
    // Keep custom photos synced if teacher updates them
    setCards((prev) =>
      prev.map((card) => {
        const latest = questions.find((q) => q.symbolKey === card.symbolKey);
        return latest ? { ...card, customPhotoUrl: latest.customPhotoUrl } : card;
      })
    );
  }, [questions]);

  const handleCardClick = (index: number) => {
    if (locked) return;
    const target = cards[index];
    if (!target || target.isFlipped || target.isMatched) return;

    playSoundEffect('flip', soundEnabled);
    if (ttsEnabled) {
      speakKorean(target.title, true);
    }

    const updated = cards.map((c, idx) => (idx === index ? { ...c, isFlipped: true } : c));
    const nextSelected = [...selectedIndices, index];
    setCards(updated);
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      setLocked(true);
      setAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = nextSelected;
      const firstCard = updated[firstIdx];
      const secondCard = updated[secondIdx];

      if (firstCard.symbolKey === secondCard.symbolKey) {
        const nextMatched = matchedPairs + 1;
        setTimeout(() => {
          setCards((curr) =>
            curr.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs(nextMatched);
          setSelectedIndices([]);
          setLocked(false);

          if (nextMatched >= pairCount) {
            playSoundEffect('victory', soundEnabled);
            setFeedbackText(`짝을 모두 맞혔어요! (${firstCard.title}까지 ${pairCount}쌍 완성)`);
            if (ttsEnabled) {
              speakKorean('와! 메모리 카드 짝을 모두 맞혔어요!', true);
            }
          } else {
            playSoundEffect('correct', soundEnabled);
            setFeedbackText(`정답! '${firstCard.title}' 짝을 찾았어요!`);
          }
        }, 280);
      } else {
        setFeedbackText('조금 달라요! 카드 위치를 기억해서 다시 뒤집어 볼까요?');
        setTimeout(() => {
          playSoundEffect('retry', soundEnabled);
          setCards((curr) =>
            curr.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedIndices([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const isCompleted = matchedPairs >= pairCount;
  const gridClass = pairCount === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4';

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-5">
      <CharacterTrack
        currentStep={matchedPairs}
        totalSteps={pairCount}
        celebrating={isCompleted}
        label="메모리 카드 짝 찾기 여행"
      />

      {/* Difficulty Selector & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {MEMORY_LEVELS.map((lvl) => {
            const active = pairCount === lvl.pairs;
            return (
              <button
                key={lvl.pairs}
                type="button"
                onClick={() => resetGame(lvl.pairs)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm md:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
                  active
                    ? 'bg-[#0047A0] text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-2">
          <div className="text-base font-bold text-slate-700 tabular-nums">
            찾은 짝 {matchedPairs} / {pairCount}쌍
            <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
            시도 {attempts}회
          </div>

          <button
            type="button"
            onClick={() => resetGame(pairCount)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 섞기</span>
          </button>
        </div>
      </div>

      {/* Live Announcement Banner */}
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
          <Sparkles className="w-6 h-6 text-[#0047A0] shrink-0" />
        )}
        <span>{feedbackText}</span>
      </div>

      {/* Completion Card or Memory Grid */}
      {isCompleted ? (
        <section className="bg-white border-2 border-emerald-300 rounded-3xl p-8 text-center shadow-sm animate-pop-celebrate">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
              <MascotCharacterSvg celebrating className="w-20 h-20" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            메모리 카드 {pairCount}쌍 모두 성공!
          </h2>
          <p className="text-lg text-slate-700 font-medium mb-6">
            총 {attempts}번 뒤집어서 우리나라 상징 짝을 다 찾았어요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => resetGame(pairCount)}
              className="min-h-[56px] px-7 py-3 rounded-2xl bg-[#0047A0] hover:bg-blue-800 text-white text-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
            >
              <RotateCcw className="w-5 h-5" />
              <span>한 번 더 하기</span>
            </button>
            {pairCount < 8 && (
              <button
                type="button"
                onClick={() => resetGame((pairCount + 2) as MemoryDifficulty)}
                className="min-h-[56px] px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
              >
                <Award className="w-5 h-5" />
                <span>다음 단계 도전 ({pairCount + 2}쌍)</span>
              </button>
            )}
            <button
              type="button"
              onClick={onExitToMenu}
              className="min-h-[56px] px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-lg font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              처음 화면
            </button>
          </div>
        </section>
      ) : (
        <div className={`grid ${gridClass} gap-3.5 md:gap-4`}>
          {cards.map((card, idx) => {
            const revealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.uid}
                type="button"
                onClick={() => handleCardClick(idx)}
                disabled={revealed || locked}
                aria-label={
                  revealed
                    ? `${idx + 1}번 카드: ${card.title}${card.isMatched ? ' (짝 맞춤 완료)' : ''}`
                    : `${idx + 1}번 뒤집힌 카드`
                }
                className="card-perspective h-36 sm:h-44 w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 rounded-2xl cursor-pointer disabled:cursor-default"
              >
                <div className={`card-flip-inner ${revealed ? 'is-flipped' : ''}`}>
                  {/* Card Back (Unflipped) */}
                  <div className="card-face rounded-2xl bg-[#0047A0] border-2 border-blue-800 shadow-sm flex flex-col items-center justify-center gap-2 text-white hover:bg-blue-800 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-xl font-extrabold tabular-nums">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold text-blue-100">눌러서 뒤집기</span>
                  </div>

                  {/* Card Front (Revealed) */}
                  <div
                    className={`card-face card-face-back rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-2 shadow-sm ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white border-blue-400'
                    }`}
                  >
                    <SymbolArtwork
                      artworkId={card.symbolKey}
                      label={card.title}
                      customPhotoUrl={card.customPhotoUrl}
                      className="w-20 h-20 sm:w-24 sm:h-24"
                    />
                    <div className="flex items-center gap-1">
                      {card.isMatched && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span className="text-base sm:text-lg font-extrabold text-slate-900">
                        {card.title}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
