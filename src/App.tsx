import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Grid2x2,
  ImagePlus,
  Layers,
  Palette,
  Puzzle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ColoringMode } from './components/ColoringMode';
import { MemoryGameMode } from './components/MemoryGameMode';
import { PuzzleMode } from './components/PuzzleMode';
import { QuizMode } from './components/QuizMode';
import { MascotCharacterSvg, SymbolArtwork } from './components/SymbolArtwork';
import { TeacherSetupModal } from './components/TeacherSetupModal';
import {
  ACHIEVEMENT_STANDARD,
  DIFFICULTY_META,
  INITIAL_SYMBOL_QUESTIONS,
  SymbolQuestion,
} from './data/symbols';
import { stopSpeaking } from './utils/audio';

type AppScreen = 'HOME' | 'QUIZ' | 'MEMORY' | 'COLORING' | 'PUZZLE';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('HOME');
  const [questions, setQuestions] = useState<SymbolQuestion[]>(INITIAL_SYMBOL_QUESTIONS);
  const [soundAndTtsEnabled, setSoundAndTtsEnabled] = useState(true);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  const handleUpdateQuestion = (id: number, updates: Partial<SymbolQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const handleResetAll = () => {
    setQuestions(INITIAL_SYMBOL_QUESTIONS);
  };

  const toggleSoundAndTts = () => {
    setSoundAndTtsEnabled((prev) => {
      const next = !prev;
      if (!next) stopSpeaking();
      return next;
    });
  };

  const navigateTo = (next: AppScreen) => {
    stopSpeaking();
    setScreen(next);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] text-slate-900">
      {/* 3-Zone Top Bar */}
      <header className="no-print bg-white border-b border-slate-200 px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Single-line Brand Title */}
          <button
            type="button"
            onClick={() => navigateTo('HOME')}
            className="text-lg md:text-xl font-extrabold tracking-tight text-[#0047A0] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 rounded-lg px-1"
          >
            우리나라 상징 짝 맞추기
          </button>

          {/* Zone 2: Concise single-line navigation links (5 items) */}
          <nav
            aria-label="학습 메뉴"
            className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base font-bold text-slate-600"
          >
            <button
              type="button"
              onClick={() => navigateTo('HOME')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 rounded-sm ${
                screen === 'HOME'
                  ? 'border-[#0047A0] text-[#0047A0]'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              처음 화면
            </button>
            <button
              type="button"
              onClick={() => navigateTo('QUIZ')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 rounded-sm ${
                screen === 'QUIZ'
                  ? 'border-[#0047A0] text-[#0047A0]'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              짝 맞추기
            </button>
            <button
              type="button"
              onClick={() => navigateTo('MEMORY')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 rounded-sm ${
                screen === 'MEMORY'
                  ? 'border-[#0047A0] text-[#0047A0]'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              메모리 카드
            </button>
            <button
              type="button"
              onClick={() => navigateTo('COLORING')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 rounded-sm ${
                screen === 'COLORING'
                  ? 'border-[#0047A0] text-[#0047A0]'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              상징 채색
            </button>
            <button
              type="button"
              onClick={() => navigateTo('PUZZLE')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 rounded-sm ${
                screen === 'PUZZLE'
                  ? 'border-[#0047A0] text-[#0047A0]'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              퍼즐 놀이
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <button
            type="button"
            onClick={toggleSoundAndTts}
            aria-pressed={soundAndTtsEnabled}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
              soundAndTtsEnabled
                ? 'bg-[#0047A0] text-white hover:bg-blue-800'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            {soundAndTtsEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span>{soundAndTtsEnabled ? '소리·읽기 켜짐' : '소리·읽기 꺼짐'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {screen === 'HOME' && (
          <main className="max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-8">
            {/* Hero Focal Stage */}
            <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <p className="text-sm font-bold text-[#0047A0]">
                    사회 · 3학년 우리나라 상징 배우기
                  </p>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight text-balance">
                    우리나라를 대표하는 상징을 보고 놀이로 배워요
                  </h1>
                  <p className="text-lg text-slate-700 font-medium leading-relaxed">
                    짝 맞추기 퀴즈부터 메모리 카드, 그림 채색하기, 퍼즐 맞추기까지 재미있게 활동해 보세요.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => navigateTo('QUIZ')}
                      className="min-h-[60px] px-5 py-3.5 rounded-2xl bg-[#0047A0] hover:bg-blue-800 text-white text-lg font-extrabold flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
                    >
                      <span>16문제 짝 맞추기</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('MEMORY')}
                      className="min-h-[60px] px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-lg font-extrabold flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
                    >
                      <Grid2x2 className="w-5 h-5" />
                      <span>메모리 카드 게임</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('COLORING')}
                      className="min-h-[60px] px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-extrabold flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
                    >
                      <Palette className="w-5 h-5" />
                      <span>상징 채색하기</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('PUZZLE')}
                      className="min-h-[60px] px-5 py-3.5 rounded-2xl bg-[#CD2E3A] hover:bg-rose-700 text-white text-lg font-extrabold flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
                    >
                      <Puzzle className="w-5 h-5" />
                      <span>퍼즐 조각 맞추기</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#F5F8FC] border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center justify-center gap-4">
                    <SymbolArtwork artworkId="taegeukgi" label="태극기" className="w-24 h-20" />
                    <SymbolArtwork artworkId="mugunghwa" label="무궁화" className="w-20 h-20" />
                    <SymbolArtwork artworkId="hanbok" label="한복" className="w-20 h-20" />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <MascotCharacterSvg celebrating className="w-16 h-16 shrink-0" />
                    <p className="text-base font-bold text-slate-800">
                      한 문제씩 맞힐 때마다 호랑이 친구가 앞으로 한 걸음씩 나아가요!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3 Difficulty Stages Preview */}
            <section aria-label="단계별 활동 안내" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([1, 2, 3] as const).map((lvl) => {
                const meta = DIFFICULTY_META[lvl];
                const count = questions.filter((q) => q.level === lvl).length;
                return (
                  <div
                    key={lvl}
                    className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg font-extrabold" style={{ color: meta.badgeColor }}>
                        {meta.name}
                      </h2>
                      <span className="text-sm font-bold text-slate-500 tabular-nums">
                        {count}문제
                      </span>
                    </div>
                    <p className="text-base font-medium text-slate-700">{meta.description}</p>
                  </div>
                );
              })}
            </section>

            {/* Curriculum Standard & Teacher Photo Upload Bar */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#0047A0] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">적용 성취기준</p>
                  <p className="text-sm font-medium text-slate-600">{ACHIEVEMENT_STANDARD}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSetupOpen(true)}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
              >
                <ImagePlus className="w-4 h-4 text-[#0047A0]" />
                <span>실물 사진 넣기 · 단일 HTML 저장</span>
              </button>
            </section>

            {/* Quick Symbol Preview Strip */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-700">
                <Layers className="w-5 h-5 text-[#0047A0]" />
                <span>우리가 만날 16가지 우리나라 상징</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {questions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5 text-center"
                  >
                    <SymbolArtwork
                      artworkId={item.symbolKey}
                      label={item.title}
                      customPhotoUrl={item.customPhotoUrl}
                      className="w-11 h-11"
                    />
                    <span className="text-xs font-bold text-slate-800 truncate w-full">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {screen === 'QUIZ' && (
          <QuizMode
            questions={questions}
            soundEnabled={soundAndTtsEnabled}
            ttsEnabled={soundAndTtsEnabled}
            onExitToMenu={() => navigateTo('HOME')}
            onSwitchToMemory={() => navigateTo('MEMORY')}
          />
        )}

        {screen === 'MEMORY' && (
          <MemoryGameMode
            questions={questions}
            soundEnabled={soundAndTtsEnabled}
            ttsEnabled={soundAndTtsEnabled}
            onExitToMenu={() => navigateTo('HOME')}
          />
        )}

        {screen === 'COLORING' && (
          <ColoringMode
            soundEnabled={soundAndTtsEnabled}
            ttsEnabled={soundAndTtsEnabled}
            onExitToMenu={() => navigateTo('HOME')}
          />
        )}

        {screen === 'PUZZLE' && (
          <PuzzleMode
            questions={questions}
            soundEnabled={soundAndTtsEnabled}
            ttsEnabled={soundAndTtsEnabled}
            onExitToMenu={() => navigateTo('HOME')}
          />
        )}
      </div>

      <TeacherSetupModal
        isOpen={isSetupOpen}
        questions={questions}
        onUpdateQuestion={handleUpdateQuestion}
        onResetAll={handleResetAll}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
