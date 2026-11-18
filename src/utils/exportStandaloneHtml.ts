import { ACHIEVEMENT_STANDARD, SymbolQuestion } from '../data/symbols';

export function buildStandaloneHtml(questions: SymbolQuestion[]): string {
  const serializedQuestions = JSON.stringify(
    questions.map((q) => ({
      id: q.id,
      symbolKey: q.symbolKey,
      title: q.title,
      emoji: q.emoji,
      level: q.level,
      levelLabel: q.levelLabel,
      prompt: q.prompt,
      hint: q.hint,
      celebrationText: q.celebrationText,
      customPhotoUrl: q.customPhotoUrl || '',
      choices: q.choices,
    }))
  );

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>우리나라 상징 짝 맞추기</title>
  <style>
    :root {
      --bg: #F5F8FC;
      --surface: #FFFFFF;
      --border: #CBD5E1;
      --text: #0F172A;
      --muted: #475569;
      --primary: #0047A0;
      --red: #CD2E3A;
      --emerald: #059669;
      --amber: #F59E0B;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    button {
      font-family: inherit;
      cursor: pointer;
      touch-action: manipulation;
    }
    button:focus-visible, input:focus-visible {
      outline: 4px solid #2563EB;
      outline-offset: 2px;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid #E2E8F0;
      padding: 12px 20px;
    }
    .header-inner {
      max-width: 1120px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }
    .brand {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      background: transparent;
      border: 0;
      padding: 4px 6px;
      white-space: nowrap;
    }
    .nav-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    .nav-btn {
      background: transparent;
      border: 0;
      border-bottom: 2px solid transparent;
      font-size: 16px;
      font-weight: 700;
      color: var(--muted);
      padding: 6px 8px;
      white-space: nowrap;
    }
    .nav-btn.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
    .cta-btn {
      min-height: 44px;
      padding: 10px 18px;
      border-radius: 12px;
      border: 0;
      background: var(--primary);
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
    }
    .cta-btn:hover { background: #1E40AF; }
    main {
      max-width: 1120px;
      margin: 0 auto;
      padding: 20px 16px 48px;
    }
    .card {
      background: var(--surface);
      border: 2px solid #E2E8F0;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .track-wrap {
      background: var(--surface);
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 16px 20px;
      margin-bottom: 16px;
    }
    .track-head {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 12px;
    }
    .track-bar {
      position: relative;
      height: 14px;
      background: #E2E8F0;
      border-radius: 999px;
      margin: 22px 10px 8px;
    }
    .track-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 999px;
      transition: width 260ms ease;
    }
    .mascot {
      position: absolute;
      top: -28px;
      transform: translateX(-50%);
      transition: left 280ms ease;
      font-size: 30px;
      line-height: 1;
      user-select: none;
    }
    .home-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 12px;
      margin-top: 20px;
    }
    .big-mode-btn {
      min-height: 62px;
      padding: 14px 20px;
      border-radius: 18px;
      border: 0;
      font-size: 18px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .quiz-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      align-items: center;
    }
    @media (min-width: 820px) {
      .quiz-grid { grid-template-columns: 5fr 7fr; }
    }
    .target-box {
      background: #F5F8FC;
      border: 2px solid #BFDBFE;
      border-radius: 24px;
      padding: 24px;
      text-align: center;
      user-select: none;
    }
    .art-box {
      width: 156px;
      height: 156px;
      margin: 0 auto 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .art-box img, .art-sm img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 14px;
      border: 2px solid #CBD5E1;
    }
    .choices-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
    }
    .choice-btn {
      min-height: 168px;
      background: #FFFFFF;
      border: 2px solid #CBD5E1;
      border-radius: 20px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      position: relative;
      transition: transform 160ms ease, border-color 160ms ease;
    }
    .choice-btn:hover:not(:disabled) {
      border-color: var(--primary);
      background: #EFF6FF;
    }
    .choice-btn.dimmed { opacity: 0.42; cursor: not-allowed; }
    .choice-btn.correct { background: #ECFDF5; border-color: var(--emerald); }
    .choice-num {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .art-sm {
      width: 92px;
      height: 92px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .choice-label { font-size: 21px; font-weight: 800; color: var(--text); }
    .feedback-box {
      margin-top: 16px;
      padding: 16px 20px;
      border-radius: 18px;
      font-weight: 800;
      font-size: 18px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .feedback-retry { background: #FFF1F2; border: 2px solid #FDA4AF; color: #881337; }
    .feedback-ok { background: #ECFDF5; border: 2px solid #34D399; color: #064E3B; }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: #fff;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 12px;
      margin-bottom: 14px;
    }
    .tab-group {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      background: #F1F5F9;
      padding: 4px;
      border-radius: 12px;
    }
    .tab-btn {
      min-height: 40px;
      padding: 8px 14px;
      border-radius: 10px;
      border: 0;
      background: transparent;
      font-size: 15px;
      font-weight: 700;
      color: #334155;
      white-space: nowrap;
    }
    .tab-btn.active {
      background: var(--primary);
      color: #fff;
    }
    .btn-sec {
      min-height: 44px;
      padding: 8px 16px;
      border-radius: 12px;
      border: 1px solid #CBD5E1;
      background: #F8FAFC;
      color: var(--text);
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
    }
    .memory-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-top: 14px;
    }
    @media (max-width: 640px) {
      .memory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .mem-card {
      min-height: 148px;
      border-radius: 18px;
      border: 2px solid #1E40AF;
      background: var(--primary);
      color: #fff;
      font-size: 18px;
      font-weight: 800;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
    }
    .mem-card.open { background: #fff; color: var(--text); border-color: #3B82F6; }
    .mem-card.matched { background: #ECFDF5; color: #065F46; border-color: var(--emerald); }
    .coloring-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
      align-items: start;
    }
    @media (min-width: 880px) {
      .coloring-layout { grid-template-columns: 4fr 8fr; }
    }
    .swatch-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
    }
    .swatch-btn {
      min-height: 44px;
      padding: 6px 10px;
      border-radius: 12px;
      border: 2px solid #E2E8F0;
      background: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
    }
    .swatch-btn.active { border-color: var(--primary); background: #EFF6FF; color: var(--primary); }
    .swatch-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #94A3B8;
      flex-shrink: 0;
    }
    .canvas-stage {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      background: #fff;
      border: 2px solid #CBD5E1;
      border-radius: 18px;
      overflow: hidden;
    }
    .canvas-stage svg, .canvas-stage canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .puzzle-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      align-items: start;
    }
    @media (min-width: 880px) {
      .puzzle-layout { grid-template-columns: 7fr 5fr; }
    }
    .puzzle-board {
      position: relative;
      width: 100%;
      background: #F1F5F9;
      border: 2px solid #CBD5E1;
      border-radius: 18px;
      overflow: hidden;
    }
    .puzzle-grid {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      display: grid;
    }
    .puzzle-slot {
      border: 1px dashed #64748B;
      background: transparent;
      padding: 0;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .puzzle-slot.occupied { border-color: rgba(16, 185, 129, 0.4); }
    .puzzle-slot-num {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(255,255,255,0.9);
      border: 1px solid #CBD5E1;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tray-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .tray-piece {
      aspect-ratio: 1 / 1;
      border-radius: 14px;
      border: 2px solid #CBD5E1;
      overflow: hidden;
      padding: 0;
      background: #fff;
      position: relative;
      touch-action: none;
    }
    .tray-piece.selected { border-color: var(--primary); box-shadow: 0 0 0 4px #BFDBFE; }
    .slice-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #fff;
    }
    .slice-inner {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    .drag-ghost {
      position: fixed;
      width: 110px;
      height: 110px;
      border-radius: 14px;
      border: 2px solid var(--primary);
      overflow: hidden;
      background: #fff;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.24);
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 999;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 100;
    }
    .modal-card {
      background: #fff;
      border-radius: 24px;
      max-width: 820px;
      width: 100%;
      max-height: 86vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .hidden { display: none !important; }
    @media print {
      header, .no-print { display: none !important; }
      body { background: #fff !important; }
      .print-sheet { border: 0 !important; box-shadow: none !important; padding: 0 !important; }
    }
  </style>
</head>
<body>
  <header class="no-print">
    <div class="header-inner">
      <button class="brand" onclick="setScreen('HOME')">우리나라 상징 짝 맞추기</button>
      <nav class="nav-links" aria-label="학습 메뉴">
        <button class="nav-btn active" id="nav-HOME" onclick="setScreen('HOME')">처음 화면</button>
        <button class="nav-btn" id="nav-QUIZ" onclick="setScreen('QUIZ')">짝 맞추기</button>
        <button class="nav-btn" id="nav-MEMORY" onclick="setScreen('MEMORY')">메모리 카드</button>
        <button class="nav-btn" id="nav-COLORING" onclick="setScreen('COLORING')">상징 채색</button>
        <button class="nav-btn" id="nav-PUZZLE" onclick="setScreen('PUZZLE')">퍼즐 놀이</button>
      </nav>
      <button class="cta-btn" id="tts-toggle" onclick="toggleTts()">🔊 소리·읽기 켜짐</button>
    </div>
  </header>

  <main id="app"></main>
  <div id="modal-root"></div>

  <script>
    const ACHIEVEMENT_STANDARD = ${JSON.stringify(ACHIEVEMENT_STANDARD)};
    const INITIAL_QUESTIONS = ${serializedQuestions};
    let QUESTIONS = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));

    const COLOR_PALETTE = [
      { hex: '#CD2E3A', name: '태극 빨강' },
      { hex: '#0047A0', name: '태극 파랑' },
      { hex: '#0F172A', name: '검정' },
      { hex: '#FFFFFF', name: '하양' },
      { hex: '#FACC15', name: '노랑' },
      { hex: '#F9A8D4', name: '연분홍' },
      { hex: '#DB2777', name: '진분홍' },
      { hex: '#16A34A', name: '초록' },
      { hex: '#38BDF8', name: '하늘' },
      { hex: '#B45309', name: '갈색' }
    ];

    const COLOR_TEMPLATES = [
      { id: 'taegeukgi', title: '태극기', guide: '바탕은 하양, 태극 위쪽은 빨강, 아래쪽은 파랑, 네 모서리 막대는 검정으로 칠해 보세요.' },
      { id: 'mugunghwa', title: '무궁화', guide: '꽃잎 다섯 장은 연분홍, 가운데는 진분홍과 노랑, 잎은 초록으로 칠해 보세요.' },
      { id: 'hanbok', title: '한복', guide: '저고리와 치마를 곱고 밝은 색으로 칠해 보세요.' },
      { id: 'hanok', title: '한옥', guide: '기와지붕은 검정, 벽은 노랑, 문은 갈색으로 칠해 보세요.' },
      { id: 'tiger', title: '호랑이', guide: '호랑이 얼굴은 노랑, 줄무늬는 검정, 스카프는 파랑과 빨강으로 칠해 보세요.' }
    ];

    const PUZZLE_KEYS = ['taegeukgi', 'mugunghwa', 'hanbok', 'hanok', 'dokdo'];

    let state = {
      screen: 'HOME',
      tts: true,
      setupOpen: false,
      // Quiz
      quizIndex: 0,
      solvedCount: 0,
      firstTryStars: 0,
      wrongOnCurrent: 0,
      dimmedIds: [],
      quizStatus: 'ASKING',
      showHint: false,
      shuffledChoices: [],
      // Memory
      memPairs: 4,
      memCards: [],
      memSelected: [],
      memMatched: 0,
      memAttempts: 0,
      memLocked: false,
      memMessage: '같은 우리나라 상징 카드 두 장을 찾아보세요!',
      // Coloring
      colTemplate: 'taegeukgi',
      colTool: 'paint',
      colColor: '#CD2E3A',
      colBrush: 14,
      colShowGuide: false,
      colRegions: {},
      colHistory: [],
      // Puzzle
      puzKey: 'taegeukgi',
      puzCount: 6,
      puzGhost: false,
      puzSlots: [null, null, null, null, null, null],
      puzTray: [],
      puzSelected: null,
      puzMessage: '퍼즐 조각을 끌어서 알맞은 빈칸에 놓아 보세요!'
    };

    let penImageData = null;

    function speak(text) {
      if (!state.tts || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ko-KR';
        u.rate = 0.88;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }

    function beep(kind) {
      if (!state.tts) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = kind === 'ok' ? 660 : kind === 'win' ? 880 : kind === 'flip' ? 520 : 300;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.24);
      } catch (e) {}
    }

    function toggleTts() {
      state.tts = !state.tts;
      document.getElementById('tts-toggle').textContent = state.tts ? '🔊 소리·읽기 켜짐' : '🔇 소리·읽기 꺼짐';
      if (!state.tts && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function getSvgMarkup(id) {
      switch (id) {
        case 'taegeukgi':
          return '<svg viewBox="0 0 120 84" width="100%" height="100%"><rect x="4" y="4" width="112" height="76" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/><g transform="translate(60 42) rotate(-34)"><path d="M-18,0 A18,18 0 0,1 18,0 A9,9 0 0,1 0,0 A9,9 0 0,0 -18,0 Z" fill="#CD2E3A"/><path d="M18,0 A18,18 0 0,1 -18,0 A9,9 0 0,1 0,0 A9,9 0 0,0 18,0 Z" fill="#0047A0"/></g><g transform="translate(24 20) rotate(-34)" fill="#0F172A"><rect x="-8" y="-6" width="16" height="2.6"/><rect x="-8" y="-1.3" width="16" height="2.6"/><rect x="-8" y="3.4" width="16" height="2.6"/></g><g transform="translate(96 64) rotate(-34)" fill="#0F172A"><rect x="-8" y="-6" width="7" height="2.6"/><rect x="1" y="-6" width="7" height="2.6"/><rect x="-8" y="-1.3" width="7" height="2.6"/><rect x="1" y="-1.3" width="7" height="2.6"/><rect x="-8" y="3.4" width="7" height="2.6"/><rect x="1" y="3.4" width="7" height="2.6"/></g><g transform="translate(96 20) rotate(34)" fill="#0F172A"><rect x="-8" y="-6" width="7" height="2.6"/><rect x="1" y="-6" width="7" height="2.6"/><rect x="-8" y="-1.3" width="16" height="2.6"/><rect x="-8" y="3.4" width="7" height="2.6"/><rect x="1" y="3.4" width="7" height="2.6"/></g><g transform="translate(24 64) rotate(34)" fill="#0F172A"><rect x="-8" y="-6" width="16" height="2.6"/><rect x="-8" y="-1.3" width="7" height="2.6"/><rect x="1" y="-1.3" width="7" height="2.6"/><rect x="-8" y="3.4" width="16" height="2.6"/></g></svg>';
        case 'mugunghwa':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 86 L50 65" stroke="#15803D" stroke-width="5" stroke-linecap="round"/><ellipse cx="38" cy="76" rx="10" ry="5" transform="rotate(-25 38 76)" fill="#22C55E"/><ellipse cx="62" cy="76" rx="10" ry="5" transform="rotate(25 62 76)" fill="#22C55E"/>' +
            [0,72,144,216,288].map(d => '<ellipse cx="50" cy="28" rx="15" ry="20" fill="#FBCFE8" stroke="#EC4899" stroke-width="2" transform="rotate(' + d + ' 50 48)"/>').join('') +
            [0,72,144,216,288].map(d => '<ellipse cx="50" cy="40" rx="6" ry="10" fill="#BE185D" transform="rotate(' + d + ' 50 48)"/>').join('') +
            '<circle cx="50" cy="48" r="7" fill="#FACC15"/></svg>';
        case 'hanbok':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M30 42 L70 42 L84 88 Q50 94 16 88 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="2.5"/><path d="M22 24 L38 18 L50 28 L62 18 L78 24 L86 44 L70 48 L66 36 L66 44 L34 44 L34 36 L30 48 L14 44 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="2.5"/><path d="M38 18 L50 30 L62 18" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><path d="M48 34 L38 56 M50 34 L58 58" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/><circle cx="49" cy="34" r="3.5" fill="#0284C7"/></svg>';
        case 'aegukga':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="10" y="16" width="80" height="68" rx="12" fill="#EFF6FF" stroke="#3B82F6" stroke-width="3"/><line x1="20" y1="36" x2="80" y2="36" stroke="#93C5FD" stroke-width="2"/><line x1="20" y1="48" x2="80" y2="48" stroke="#93C5FD" stroke-width="2"/><line x1="20" y1="60" x2="80" y2="60" stroke="#93C5FD" stroke-width="2"/><circle cx="34" cy="58" r="7" fill="#0047A0"/><rect x="39" y="28" width="4" height="30" fill="#0047A0"/><circle cx="62" cy="50" r="7" fill="#CD2E3A"/><rect x="67" y="22" width="4" height="28" fill="#CD2E3A"/><path d="M39 28 L71 22 L71 29 L39 35 Z" fill="#0047A0"/></svg>';
        case 'hangeul':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="10" y="10" width="80" height="80" rx="14" fill="#FEF3C7" stroke="#D97706" stroke-width="3"/><text x="22" y="48" font-size="28" font-weight="800" fill="#0047A0">가</text><text x="54" y="48" font-size="28" font-weight="800" fill="#CD2E3A">나</text><text x="22" y="80" font-size="28" font-weight="800" fill="#059669">다</text><text x="54" y="80" font-size="28" font-weight="800" fill="#7C3AED">라</text></svg>';
        case 'seollal':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M16 54 Q50 50 84 54 L76 82 Q50 90 24 82 Z" fill="#FFFFFF" stroke="#0047A0" stroke-width="3"/><ellipse cx="50" cy="54" rx="34" ry="10" fill="#FEF9C3" stroke="#0047A0" stroke-width="2.5"/><ellipse cx="38" cy="53" rx="8" ry="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/><ellipse cx="56" cy="55" rx="8" ry="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/><path d="M36 36 Q50 42 64 36 L68 20 Q50 24 32 20 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/><circle cx="50" cy="28" r="6" fill="#FACC15"/></svg>';
        case 'chuseok':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="8" y="8" width="84" height="84" rx="14" fill="#1E293B"/><circle cx="50" cy="36" r="20" fill="#FDE047"/><path d="M24 72 Q36 58 48 72 Q36 80 24 72 Z" fill="#F472B6" stroke="#FFFFFF" stroke-width="1.5"/><path d="M52 72 Q64 58 76 72 Q64 80 52 72 Z" fill="#4ADE80" stroke="#FFFFFF" stroke-width="1.5"/><path d="M38 80 Q50 66 62 80 Q50 88 38 80 Z" fill="#FBBF24" stroke="#FFFFFF" stroke-width="1.5"/></svg>';
        case 'kimchi':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="68" rx="36" ry="18" fill="#FFFFFF" stroke="#64748B" stroke-width="3"/><path d="M24 62 Q36 32 52 46 Q66 30 76 62 Z" fill="#DC2626" stroke="#991B1B" stroke-width="2"/><path d="M34 58 Q46 38 56 54" stroke="#22C55E" stroke-width="4" stroke-linecap="round" fill="none"/></svg>';
        case 'bibimbap':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="52" r="38" fill="#1E293B"/><circle cx="50" cy="52" r="31" fill="#F8FAFC"/><path d="M50 52 L50 23 A29 29 0 0,1 75 37 Z" fill="#22C55E"/><path d="M50 52 L75 37 A29 29 0 0,1 75 67 Z" fill="#F97316"/><path d="M50 52 L25 37 A29 29 0 0,1 50 23 Z" fill="#A16207"/><path d="M50 52 L25 67 A29 29 0 0,1 25 37 Z" fill="#DC2626"/><circle cx="50" cy="52" r="12" fill="#FFFFFF"/><circle cx="50" cy="52" r="6" fill="#FACC15"/></svg>';
        case 'hanok':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M10 46 Q50 20 90 46 L80 54 Q50 40 20 54 Z" fill="#334155" stroke="#0F172A" stroke-width="2.5"/><rect x="24" y="52" width="52" height="32" fill="#FEF3C7" stroke="#92400E" stroke-width="2.5"/><rect x="42" y="56" width="16" height="28" fill="#D97706" stroke="#78350F" stroke-width="2"/><rect x="18" y="84" width="64" height="6" rx="2" fill="#94A3B8"/></svg>';
        case 'tiger':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="24" cy="28" r="11" fill="#F59E0B" stroke="#B45309" stroke-width="2.5"/><circle cx="76" cy="28" r="11" fill="#F59E0B" stroke="#B45309" stroke-width="2.5"/><circle cx="50" cy="54" r="32" fill="#FBBF24" stroke="#B45309" stroke-width="3"/><ellipse cx="50" cy="64" rx="16" ry="12" fill="#FEF3C7"/><path d="M44 26 L50 36 L56 26 M20 50 L30 52 M80 50 L70 52" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" fill="none"/><circle cx="38" cy="48" r="4" fill="#0F172A"/><circle cx="62" cy="48" r="4" fill="#0F172A"/><polygon points="45,58 55,58 50,64" fill="#EC4899"/></svg>';
        case 'taegeuk':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/><g transform="translate(50 50) rotate(-30)"><path d="M-32,0 A32,32 0 0,1 32,0 A16,16 0 0,1 0,0 A16,16 0 0,0 -32,0 Z" fill="#CD2E3A"/><path d="M32,0 A32,32 0 0,1 -32,0 A16,16 0 0,1 0,0 A16,16 0 0,0 32,0 Z" fill="#0047A0"/></g></svg>';
        case 'trigrams':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="8" y="8" width="84" height="84" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/><g fill="#0F172A"><rect x="18" y="20" width="24" height="4"/><rect x="18" y="28" width="24" height="4"/><rect x="18" y="36" width="24" height="4"/><rect x="58" y="20" width="10" height="4"/><rect x="72" y="20" width="10" height="4"/><rect x="58" y="28" width="24" height="4"/><rect x="58" y="36" width="10" height="4"/><rect x="72" y="36" width="10" height="4"/><rect x="18" y="60" width="24" height="4"/><rect x="18" y="68" width="10" height="4"/><rect x="32" y="68" width="10" height="4"/><rect x="18" y="76" width="24" height="4"/><rect x="58" y="60" width="10" height="4"/><rect x="72" y="60" width="10" height="4"/><rect x="58" y="68" width="10" height="4"/><rect x="72" y="68" width="10" height="4"/><rect x="58" y="76" width="10" height="4"/><rect x="72" y="76" width="10" height="4"/></g></svg>';
        case 'gwanghwamun':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M10 38 Q50 18 90 38 L84 44 L16 44 Z" fill="#1E293B"/><path d="M18 24 Q50 12 82 24 L76 30 L24 30 Z" fill="#334155"/><rect x="26" y="28" width="48" height="14" fill="#B91C1C"/><rect x="16" y="44" width="68" height="38" fill="#E2E8F0" stroke="#64748B" stroke-width="2.5"/><path d="M24 82 L24 62 A6,6 0 0,1 36 62 L36 82 Z" fill="#334155"/><path d="M43 82 L43 58 A7,7 0 0,1 57 58 L57 82 Z" fill="#0F172A"/><path d="M64 82 L64 62 A6,6 0 0,1 76 62 L76 82 Z" fill="#334155"/></svg>';
        case 'dokdo':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="8" y="10" width="84" height="80" rx="12" fill="#DBEAFE"/><path d="M8 66 Q30 60 50 66 T92 66 L92 90 L8 90 Z" fill="#0284C7"/><polygon points="18,68 34,34 48,68" fill="#78716C" stroke="#44403C" stroke-width="2"/><polygon points="52,68 68,40 82,68" fill="#57534E" stroke="#44403C" stroke-width="2"/><line x1="62" y1="44" x2="62" y2="15" stroke="#0F172A" stroke-width="2.2" stroke-linecap="round"/><rect x="62" y="15" width="24" height="16" rx="1" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2"/><g transform="translate(74 23) rotate(-34)"><path d="M-4,0 A4,4 0 0,1 4,0 A2,2 0 0,1 0,0 A2,2 0 0,0 -4,0 Z" fill="#CD2E3A"/><path d="M4,0 A4,4 0 0,1 -4,0 A2,2 0 0,1 0,0 A2,2 0 0,0 4,0 Z" fill="#0047A0"/></g><g stroke="#0F172A" stroke-width="0.9"><line x1="64.5" y1="18.2" x2="67.5" y2="16.4"/><line x1="65.1" y1="19.1" x2="68.1" y2="17.3"/><line x1="65.7" y1="20" x2="68.7" y2="18.2"/><line x1="80.5" y1="16.4" x2="83.5" y2="18.2"/><line x1="79.9" y1="17.3" x2="82.9" y2="19.1"/><line x1="79.3" y1="18.2" x2="82.3" y2="20"/><line x1="64.5" y1="27.8" x2="67.5" y2="29.6"/><line x1="65.1" y1="26.9" x2="68.1" y2="28.7"/><line x1="65.7" y1="26" x2="68.7" y2="27.8"/><line x1="80.5" y1="29.6" x2="83.5" y2="27.8"/><line x1="79.9" y1="28.7" x2="82.9" y2="26.9"/><line x1="79.3" y1="27.8" x2="82.3" y2="26"/></g></svg>';
        case 'patriotism':
          return '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 84 C20 66 12 46 12 32 C12 18 24 12 36 16 C43 18 48 24 50 28 C52 24 57 18 64 16 C76 12 88 18 88 32 C88 46 80 66 50 84 Z" fill="#FFE4E6" stroke="#E11D48" stroke-width="3.5"/><g transform="translate(50 47) rotate(-30)"><path d="M-16,0 A16,16 0 0,1 16,0 A8,8 0 0,1 0,0 A8,8 0 0,0 -16,0 Z" fill="#CD2E3A"/><path d="M16,0 A16,16 0 0,1 -16,0 A8,8 0 0,1 0,0 A8,8 0 0,0 16,0 Z" fill="#0047A0"/></g></svg>';
        default:
          return '';
      }
    }

    function renderArtHtml(artworkId, label, emoji, photoUrl, sizeClass) {
      if (photoUrl) {
        return '<div class="' + sizeClass + '"><img src="' + photoUrl + '" alt="' + label + '" /></div>';
      }
      const svg = getSvgMarkup(artworkId);
      if (svg) {
        return '<div class="' + sizeClass + '">' + svg + '</div>';
      }
      return '<div class="' + sizeClass + '" style="font-size:64px;">' + (emoji || '⭐') + '</div>';
    }

    function setScreen(screen) {
      state.screen = screen;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      const activeNav = document.getElementById('nav-' + screen);
      if (activeNav) activeNav.classList.add('active');
      if (screen === 'QUIZ') { startQuiz(); return; }
      if (screen === 'MEMORY') { startMemory(state.memPairs); return; }
      if (screen === 'PUZZLE') { resetPuzzle(state.puzKey, state.puzCount); return; }
      render();
    }

    function renderTrack(step, total, label) {
      const pct = Math.round((step / Math.max(1, total)) * 100);
      return '<section class="track-wrap"><div class="track-head"><span>' + label + '</span><span>' + step + ' / ' + total + ' 걸음</span></div><div class="track-bar"><div class="track-fill" style="width:' + pct + '%"></div><div class="mascot" style="left:calc(' + pct + '% * 0.92 + 4%)">🐯</div></div></section>';
    }

    // Quiz Logic
    function startQuiz() {
      state.quizIndex = 0;
      state.solvedCount = 0;
      state.firstTryStars = 0;
      state.wrongOnCurrent = 0;
      state.dimmedIds = [];
      state.quizStatus = 'ASKING';
      state.showHint = false;
      state.shuffledChoices = shuffle(QUESTIONS[0].choices);
      render();
      speak('1번 문제. ' + QUESTIONS[0].prompt);
    }

    function pickChoice(choiceId) {
      if (state.quizStatus === 'CORRECT' || state.quizStatus === 'FINISHED') return;
      if (state.dimmedIds.includes(choiceId)) return;
      const q = QUESTIONS[state.quizIndex];
      const c = state.shuffledChoices.find(x => x.id === choiceId);
      if (!c) return;
      if (c.isCorrect) {
        beep('ok');
        if (state.wrongOnCurrent === 0) state.firstTryStars++;
        state.solvedCount++;
        state.quizStatus = 'CORRECT';
        speak(q.celebrationText);
      } else {
        beep('retry');
        state.wrongOnCurrent++;
        state.dimmedIds.push(choiceId);
        state.showHint = true;
        state.quizStatus = 'RETRY';
        speak('아쉬워요. 힌트를 보고 다시 골라볼까요?');
      }
      render();
    }

    function nextQuestion() {
      if (state.quizIndex + 1 >= QUESTIONS.length) {
        state.quizStatus = 'FINISHED';
        beep('win');
        speak('열여섯 문제를 모두 맞혔어요!');
        render();
        return;
      }
      state.quizIndex++;
      state.wrongOnCurrent = 0;
      state.dimmedIds = [];
      state.showHint = false;
      state.quizStatus = 'ASKING';
      state.shuffledChoices = shuffle(QUESTIONS[state.quizIndex].choices);
      render();
      speak((state.quizIndex + 1) + '번 문제. ' + QUESTIONS[state.quizIndex].prompt);
    }

    // Memory Logic
    function startMemory(pairs) {
      state.memPairs = pairs;
      const picked = shuffle(QUESTIONS).slice(0, pairs);
      const deck = [];
      picked.forEach(item => {
        deck.push({ uid: item.symbolKey + '-a', key: item.symbolKey, title: item.title, emoji: item.emoji, photo: item.customPhotoUrl, open: false, matched: false });
        deck.push({ uid: item.symbolKey + '-b', key: item.symbolKey, title: item.title, emoji: item.emoji, photo: item.customPhotoUrl, open: false, matched: false });
      });
      state.memCards = shuffle(deck);
      state.memSelected = [];
      state.memMatched = 0;
      state.memAttempts = 0;
      state.memLocked = false;
      state.memMessage = '같은 우리나라 상징 카드 두 장을 찾아보세요!';
      render();
    }

    function flipMemory(idx) {
      if (state.memLocked) return;
      const c = state.memCards[idx];
      if (!c || c.open || c.matched) return;
      c.open = true;
      state.memSelected.push(idx);
      beep('flip');
      speak(c.title);
      render();
      if (state.memSelected.length === 2) {
        state.memLocked = true;
        state.memAttempts++;
        const [i1, i2] = state.memSelected;
        const c1 = state.memCards[i1], c2 = state.memCards[i2];
        if (c1.key === c2.key) {
          setTimeout(() => {
            c1.matched = true; c2.matched = true;
            state.memMatched++;
            state.memSelected = [];
            state.memLocked = false;
            if (state.memMatched >= state.memPairs) {
              beep('win');
              state.memMessage = '모든 짝을 다 찾았어요! 정말 멋져요!';
              speak('메모리 카드 짝을 모두 맞혔어요!');
            } else {
              beep('ok');
              state.memMessage = '정답! ' + c1.title + ' 짝을 찾았어요!';
            }
            render();
          }, 260);
        } else {
          state.memMessage = '조금 달라요! 다시 기억해서 뒤집어 볼까요?';
          render();
          setTimeout(() => {
            c1.open = false; c2.open = false;
            state.memSelected = [];
            state.memLocked = false;
            render();
          }, 850);
        }
      }
    }

    // Coloring Logic
    function paintRegion(rid) {
      if (state.colTool !== 'paint') return;
      state.colHistory.push(Object.assign({}, state.colRegions));
      state.colRegions[rid] = state.colColor;
      beep('flip');
      render();
    }

    function fillVal(rid) {
      return state.colRegions[rid] || '#FFFFFF';
    }

    function getColoringSvg(id) {
      if (id === 'taegeukgi') {
        return '<svg id="col-svg" viewBox="0 0 800 600"><rect x="60" y="60" width="680" height="480" rx="16" fill="' + fillVal('flag-bg') + '" stroke="#0F172A" stroke-width="6" onclick="paintRegion(\\'flag-bg\\')"/><g transform="translate(400 300) rotate(-34)"><path d="M-110,0 A110,110 0 0,1 110,0 A55,55 0 0,1 0,0 A55,55 0 0,0 -110,0 Z" fill="' + fillVal('t-top') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'t-top\\')"/><path d="M110,0 A110,110 0 0,1 -110,0 A55,55 0 0,1 0,0 A55,55 0 0,0 110,0 Z" fill="' + fillVal('t-bot') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'t-bot\\')"/></g><g transform="translate(185 165) rotate(-34)" onclick="paintRegion(\\'g1\\')"><rect x="-48" y="-34" width="96" height="16" fill="' + fillVal('g1') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="-8" width="96" height="16" fill="' + fillVal('g1') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="18" width="96" height="16" fill="' + fillVal('g1') + '" stroke="#0F172A" stroke-width="4"/></g><g transform="translate(615 435) rotate(-34)" onclick="paintRegion(\\'g2\\')"><rect x="-48" y="-34" width="42" height="16" fill="' + fillVal('g2') + '" stroke="#0F172A" stroke-width="4"/><rect x="6" y="-34" width="42" height="16" fill="' + fillVal('g2') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="-8" width="42" height="16" fill="' + fillVal('g2') + '" stroke="#0F172A" stroke-width="4"/><rect x="6" y="-8" width="42" height="16" fill="' + fillVal('g2') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="18" width="42" height="16" fill="' + fillVal('g2') + '" stroke="#0F172A" stroke-width="4"/><rect x="6" y="18" width="42" height="16" fill="' + fillVal('g2') + '" stroke="#0F172A" stroke-width="4"/></g><g transform="translate(615 165) rotate(34)" onclick="paintRegion(\\'g3\\')"><rect x="-48" y="-34" width="42" height="16" fill="' + fillVal('g3') + '" stroke="#0F172A" stroke-width="4"/><rect x="6" y="-34" width="42" height="16" fill="' + fillVal('g3') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="-8" width="96" height="16" fill="' + fillVal('g3') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="18" width="42" height="16" fill="' + fillVal('g3') + '" stroke="#0F172A" stroke-width="4"/><rect x="6" y="18" width="42" height="16" fill="' + fillVal('g3') + '" stroke="#0F172A" stroke-width="4"/></g><g transform="translate(185 435) rotate(34)" onclick="paintRegion(\\'g4\\')"><rect x="-48" y="-34" width="96" height="16" fill="' + fillVal('g4') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="-8" width="42" height="16" fill="' + fillVal('g4') + '" stroke="#0F172A" stroke-width="4"/><rect x="6" y="-8" width="42" height="16" fill="' + fillVal('g4') + '" stroke="#0F172A" stroke-width="4"/><rect x="-48" y="18" width="96" height="16" fill="' + fillVal('g4') + '" stroke="#0F172A" stroke-width="4"/></g></svg>';
      }
      if (id === 'mugunghwa') {
        return '<svg id="col-svg" viewBox="0 0 800 600"><rect x="0" y="0" width="800" height="600" fill="#FFFFFF"/><rect x="388" y="340" width="24" height="210" rx="12" fill="' + fillVal('stem') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'stem\\')"/><ellipse cx="310" cy="460" rx="75" ry="34" transform="rotate(-24 310 460)" fill="' + fillVal('l1') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'l1\\')"/><ellipse cx="490" cy="450" rx="75" ry="34" transform="rotate(24 490 450)" fill="' + fillVal('l2') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'l2\\')"/>' +
          [0,72,144,216,288].map((d,i) => '<ellipse cx="400" cy="148" rx="82" ry="112" transform="rotate(' + d + ' 400 265)" fill="' + fillVal('p'+i) + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'p'+i+'\\')"/>').join('') +
          '<circle cx="400" cy="265" r="58" fill="' + fillVal('cr') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'cr\\')"/><circle cx="400" cy="265" r="26" fill="' + fillVal('st') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'st\\')"/></svg>';
      }
      if (id === 'hanbok') {
        return '<svg id="col-svg" viewBox="0 0 800 600"><rect x="0" y="0" width="800" height="600" fill="#FFFFFF"/><path d="M275 245 L350 245 L310 545 Q235 545 170 520 Z" fill="' + fillVal('c1') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'c1\\')"/><path d="M350 245 L450 245 L490 545 Q400 562 310 545 Z" fill="' + fillVal('c2') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'c2\\')"/><path d="M450 245 L525 245 L630 520 Q565 545 490 545 Z" fill="' + fillVal('c3') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'c3\\')"/><path d="M275 110 L130 220 L195 270 L285 205 Z" fill="' + fillVal('s1') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'s1\\')"/><path d="M525 110 L670 220 L605 270 L515 205 Z" fill="' + fillVal('s2') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'s2\\')"/><path d="M275 110 L345 75 L400 135 L455 75 L525 110 L525 245 L275 245 Z" fill="' + fillVal('jb') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'jb\\')"/><path d="M392 155 L345 310 L372 318 L410 165 Z" fill="' + fillVal('gr') + '" stroke="#0F172A" stroke-width="4" onclick="paintRegion(\\'gr\\')"/><circle cx="402" cy="155" r="18" fill="' + fillVal('gr') + '" stroke="#0F172A" stroke-width="4" onclick="paintRegion(\\'gr\\')"/></svg>';
      }
      if (id === 'hanok') {
        return '<svg id="col-svg" viewBox="0 0 800 600"><rect x="0" y="0" width="800" height="600" fill="#FFFFFF"/><path d="M70 250 Q400 75 730 250 L670 295 Q400 185 130 295 Z" fill="' + fillVal('rf') + '" stroke="#0F172A" stroke-width="6" onclick="paintRegion(\\'rf\\')"/><rect x="170" y="280" width="155" height="210" fill="' + fillVal('wl') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'wl\\')"/><rect x="475" y="280" width="155" height="210" fill="' + fillVal('wr') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'wr\\')"/><rect x="325" y="280" width="150" height="210" fill="' + fillVal('dr') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'dr\\')"/><rect x="130" y="490" width="540" height="50" rx="8" fill="' + fillVal('sb') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'sb\\')"/></svg>';
      }
      return '<svg id="col-svg" viewBox="0 0 800 600"><rect x="0" y="0" width="800" height="600" fill="#FFFFFF"/><circle cx="230" cy="145" r="62" fill="' + fillVal('el') + '" stroke="#0F172A" stroke-width="6" onclick="paintRegion(\\'el\\')"/><circle cx="570" cy="145" r="62" fill="' + fillVal('er') + '" stroke="#0F172A" stroke-width="6" onclick="paintRegion(\\'er\\')"/><circle cx="400" cy="285" r="185" fill="' + fillVal('fc') + '" stroke="#0F172A" stroke-width="6" onclick="paintRegion(\\'fc\\')"/><ellipse cx="400" cy="345" rx="92" ry="68" fill="' + fillVal('mz') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'mz\\')"/><polygon points="365,120 400,190 435,120" fill="' + fillVal('st1') + '" stroke="#0F172A" stroke-width="4" onclick="paintRegion(\\'st1\\')"/><circle cx="325" cy="255" r="18" fill="#0F172A"/><circle cx="475" cy="255" r="18" fill="#0F172A"/><polygon points="375,320 425,320 400,350" fill="' + fillVal('ns') + '" stroke="#0F172A" stroke-width="4" onclick="paintRegion(\\'ns\\')"/><path d="M275 450 Q400 500 525 450 L500 545 L300 545 Z" fill="' + fillVal('sc') + '" stroke="#0F172A" stroke-width="5" onclick="paintRegion(\\'sc\\')"/></svg>';
    }

    function bindPenCanvas() {
      const canvas = document.getElementById('pen-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (penImageData) {
        ctx.putImageData(penImageData, 0, 0);
      }
      let drawing = false;
      let last = null;
      function getPt(e) {
        const r = canvas.getBoundingClientRect();
        return { x: ((e.clientX - r.left) / r.width) * canvas.width, y: ((e.clientY - r.top) / r.height) * canvas.height };
      }
      canvas.onpointerdown = function (e) {
        if (state.colTool === 'paint') return;
        canvas.setPointerCapture(e.pointerId);
        drawing = true;
        last = getPt(e);
      };
      canvas.onpointermove = function (e) {
        if (!drawing || state.colTool === 'paint') return;
        const pt = getPt(e);
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (state.colTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = state.colBrush * 1.8;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = state.colColor;
          ctx.lineWidth = state.colBrush;
        }
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        ctx.restore();
        last = pt;
      };
      canvas.onpointerup = canvas.onpointercancel = function () {
        if (drawing) {
          penImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        drawing = false;
        last = null;
      };
    }

    function saveColoringPng() {
      const svgEl = document.getElementById('col-svg');
      const pen = document.getElementById('pen-canvas');
      if (!svgEl || !pen) return;
      const out = document.createElement('canvas');
      out.width = 1200; out.height = 900;
      const ctx = out.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 1200, 900);
      const clone = svgEl.cloneNode(true);
      clone.setAttribute('width', '1200');
      clone.setAttribute('height', '900');
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, 1200, 900);
        ctx.drawImage(pen, 0, 0, 1200, 900);
        URL.revokeObjectURL(url);
        const a = document.createElement('a');
        a.href = out.toDataURL('image/png');
        a.download = state.colTemplate + '_색칠작품.png';
        a.click();
      };
      img.src = url;
    }

    // Puzzle Logic
    function resetPuzzle(key, count) {
      state.puzKey = key;
      state.puzCount = count;
      state.puzSlots = Array(count).fill(null);
      const tiles = [];
      for (let i = 0; i < count; i++) tiles.push({ idx: i, row: Math.floor(i / 3), col: i % 3 });
      state.puzTray = shuffle(tiles);
      state.puzSelected = null;
      state.puzMessage = '퍼즐 조각을 끌어서 알맞은 빈칸에 놓아 보세요!';
      render();
    }

    function placePuzzlePiece(tileIdx, slotIdx) {
      if (state.puzSlots[slotIdx] !== null) return;
      if (tileIdx === slotIdx) {
        state.puzSlots[slotIdx] = tileIdx;
        state.puzTray = state.puzTray.filter(t => t.idx !== tileIdx);
        state.puzSelected = null;
        const done = state.puzSlots.filter(x => x !== null).length;
        if (done === state.puzCount) {
          beep('win');
          state.puzMessage = '퍼즐을 모두 완성했어요! 정말 잘했어요!';
          speak('퍼즐을 모두 완성했어요!');
        } else {
          beep('ok');
          state.puzMessage = '잘 맞췄어요! (' + done + '/' + state.puzCount + '조각)';
        }
      } else {
        beep('retry');
        state.puzMessage = '조금 다른 자리예요! 힌트 그림자를 보고 다시 놓아볼까요?';
      }
      render();
    }

    function renderSliceHtml(q, row, col, rows) {
      const art = q.customPhotoUrl
        ? '<img src="' + q.customPhotoUrl + '" style="width:100%;height:100%;object-fit:cover;" />'
        : getSvgMarkup(q.symbolKey);
      return '<div class="slice-wrap"><div class="slice-inner" style="width:300%;height:' + (rows * 100) + '%;transform:translate(-' + (col * 100 / 3) + '%,-' + (row * 100 / rows) + '%);padding:10px;">' + art + '</div></div>';
    }

    function bindPuzzleDrag() {
      const pieces = document.querySelectorAll('[data-tray-idx]');
      pieces.forEach(btn => {
        const idx = parseInt(btn.getAttribute('data-tray-idx'), 10);
        const row = parseInt(btn.getAttribute('data-row'), 10);
        const col = parseInt(btn.getAttribute('data-col'), 10);
        let origin = null;
        let ghost = null;
        btn.onpointerdown = function (e) {
          btn.setPointerCapture(e.pointerId);
          origin = { x: e.clientX, y: e.clientY, active: false };
        };
        btn.onpointermove = function (e) {
          if (!origin) return;
          if (!origin.active && Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > 8) {
            origin.active = true;
            state.puzSelected = idx;
            ghost = document.createElement('div');
            ghost.className = 'drag-ghost';
            const q = QUESTIONS.find(x => x.symbolKey === state.puzKey);
            ghost.innerHTML = renderSliceHtml(q, row, col, state.puzCount === 6 ? 2 : 3);
            document.body.appendChild(ghost);
          }
          if (origin.active && ghost) {
            ghost.style.left = e.clientX + 'px';
            ghost.style.top = e.clientY + 'px';
          }
        };
        btn.onpointerup = btn.onpointercancel = function (e) {
          if (ghost) { ghost.remove(); ghost = null; }
          if (origin && origin.active) {
            const el = document.elementFromPoint(e.clientX, e.clientY);
            const slotEl = el && el.closest('[data-puz-slot]');
            if (slotEl) {
              placePuzzlePiece(idx, parseInt(slotEl.getAttribute('data-puz-slot'), 10));
              origin = null;
              return;
            }
          } else {
            state.puzSelected = state.puzSelected === idx ? null : idx;
            render();
          }
          origin = null;
        };
      });
    }

    // Teacher Setup Modal
    function openSetup() { state.setupOpen = true; renderModal(); }
    function closeSetup() { state.setupOpen = false; renderModal(); }
    function uploadPhoto(id, input) {
      const f = input.files && input.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = function () {
        const q = QUESTIONS.find(x => x.id === id);
        if (q) q.customPhotoUrl = r.result;
        renderModal();
        render();
      };
      r.readAsDataURL(f);
    }

    function renderModal() {
      const mRoot = document.getElementById('modal-root');
      if (!state.setupOpen) { mRoot.innerHTML = ''; return; }
      mRoot.innerHTML = '<div class="modal-backdrop"><div class="modal-card"><div style="padding:18px 22px;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center;"><div><h2 style="margin:0;font-size:20px;">실물 사진 업로드 · 문제 문구 설정</h2><p style="margin:4px 0 0;font-size:13px;color:#475569;">사진은 이 화면에서만 사용되며 외부로 전송되지 않습니다.</p></div><button class="btn-sec" onclick="closeSetup()">닫기</button></div><div class="modal-body">' +
        QUESTIONS.map(q => '<div style="border:1px solid #E2E8F0;border-radius:16px;padding:12px;display:flex;align-items:center;gap:12px;"><div style="width:60px;height:60px;flex-shrink:0;">' + renderArtHtml(q.symbolKey, q.title, q.emoji, q.customPhotoUrl, 'art-sm') + '</div><div style="flex:1;"><div style="font-weight:800;font-size:14px;margin-bottom:4px;">' + q.id + '번 · ' + q.title + '</div><input type="text" value="' + q.prompt.replace(/"/g, '&quot;') + '" onchange="QUESTIONS.find(x=>x.id===' + q.id + ').prompt=this.value" style="width:100%;padding:8px 10px;border-radius:10px;border:1px solid #CBD5E1;font-size:15px;font-weight:600;" /></div><label class="btn-sec" style="cursor:pointer;">사진 올리기<input type="file" accept="image/*" style="display:none" onchange="uploadPhoto(' + q.id + ',this)"/></label></div>').join('') +
        '</div></div></div>';
    }

    function render() {
      const root = document.getElementById('app');

      if (state.screen === 'HOME') {
        root.innerHTML = '<section class="card"><p style="font-weight:800;color:#0047A0;margin:0 0 8px;">사회 · 3학년 우리나라 상징 배우기</p><h1 style="font-size:32px;margin:0 0 12px;">우리나라를 대표하는 상징을 놀이로 배워요</h1><p style="font-size:18px;color:#334155;margin:0 0 20px;">16문제 짝 맞추기, 메모리 카드, 상징 채색하기, 퍼즐 조각 맞추기를 자유롭게 선택해 활동해요.</p><div class="home-actions"><button class="big-mode-btn" style="background:#0047A0;color:#fff;" onclick="setScreen(\\'QUIZ\\')">16문제 짝 맞추기 →</button><button class="big-mode-btn" style="background:#FBBF24;color:#0F172A;" onclick="setScreen(\\'MEMORY\\')">메모리 카드 게임</button><button class="big-mode-btn" style="background:#059669;color:#fff;" onclick="setScreen(\\'COLORING\\')">상징 채색하기</button><button class="big-mode-btn" style="background:#CD2E3A;color:#fff;" onclick="setScreen(\\'PUZZLE\\')">퍼즐 조각 맞추기</button></div><div style="margin-top:24px;padding:14px 18px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;"><span style="font-size:14px;color:#475569;font-weight:600;">성취기준: ' + ACHIEVEMENT_STANDARD + '</span><button class="btn-sec" onclick="openSetup()">실물 사진 넣기 · 문제 수정</button></div></section>';
        return;
      }

      if (state.screen === 'QUIZ') {
        if (state.quizStatus === 'FINISHED') {
          root.innerHTML = renderTrack(QUESTIONS.length, QUESTIONS.length, '호랑이 친구 이동 길') + '<section class="card" style="text-align:center;"><div style="font-size:60px;">🐯 🏆</div><h2 style="font-size:30px;margin:10px 0;">16문제 짝 맞추기 모두 완료!</h2><p style="font-size:19px;">맞힌 문제: <strong>' + state.solvedCount + ' / ' + QUESTIONS.length + '</strong> · 한 번에 성공: <strong>' + state.firstTryStars + '개</strong></p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px;"><button class="cta-btn" onclick="startQuiz()">처음부터 다시 풀기</button><button class="btn-sec" onclick="setScreen(\\'HOME\\')">처음 화면</button></div></section>';
          return;
        }
        const q = QUESTIONS[state.quizIndex];
        const choicesHtml = state.shuffledChoices.map((c, idx) => {
          const dimmed = state.dimmedIds.includes(c.id);
          const ok = state.quizStatus === 'CORRECT' && c.isCorrect;
          return '<button class="choice-btn ' + (dimmed ? 'dimmed' : '') + ' ' + (ok ? 'correct' : '') + '" ' + (dimmed || state.quizStatus === 'CORRECT' ? 'disabled' : '') + ' data-choice="' + c.id + '" onclick="pickChoice(\\'' + c.id + '\\')"><span class="choice-num">' + (idx + 1) + '</span>' + renderArtHtml(c.artworkId, c.label, c.emoji, c.isCorrect ? q.customPhotoUrl : '', 'art-sm') + '<span class="choice-label">' + c.label + '</span>' + (ok ? '<span style="color:#059669;font-weight:800;">✔ 정답!</span>' : '') + '</button>';
        }).join('');

        root.innerHTML = renderTrack(state.solvedCount, QUESTIONS.length, '호랑이 친구 이동 길') + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-weight:700;"><span>' + q.levelLabel + ' · ' + (state.quizIndex + 1) + ' / ' + QUESTIONS.length + ' 문제 · 별 ' + state.firstTryStars + '개</span><button class="btn-sec" onclick="startQuiz()">초기화</button></div><section class="card"><div class="quiz-grid"><div class="target-box" draggable="true" ondragstart="event.dataTransfer.setData(\\'text/plain\\',\\'q\\')">' + renderArtHtml(q.symbolKey, q.title, q.emoji, q.customPhotoUrl, 'art-box') + '<h2 style="font-size:25px;margin:8px 0 12px;">' + q.prompt + '</h2><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;"><button class="btn-sec" onclick="speak(QUESTIONS[state.quizIndex].prompt)">🔊 다시 듣기</button><button class="btn-sec" onclick="state.showHint=!state.showHint;render();">💡 힌트</button></div>' + (state.showHint ? '<p style="margin-top:12px;background:#FEF3C7;border:1px solid #F59E0B;border-radius:12px;padding:10px;font-weight:700;">힌트: ' + q.hint + '</p>' : '') + '</div><div><p style="font-weight:700;color:#475569;margin-top:0;">알맞은 짝을 누르거나 그림을 끌어다 놓으세요 (숫자 1~' + state.shuffledChoices.length + ')</p><div class="choices-grid">' + choicesHtml + '</div>' + (state.quizStatus === 'RETRY' ? '<div class="feedback-box feedback-retry">아쉬워요! 다른 그림을 다시 골라볼까요?</div>' : '') + (state.quizStatus === 'CORRECT' ? '<div class="feedback-box feedback-ok"><span>✔ ' + q.celebrationText + '</span><button class="cta-btn" style="background:#059669;" onclick="nextQuestion()">' + (state.quizIndex + 1 >= QUESTIONS.length ? '결과 보기' : '다음 문제 →') + '</button></div>' : '') + '</div></div></section>';

        document.querySelectorAll('[data-choice]').forEach(el => {
          el.ondragover = function (e) { e.preventDefault(); };
          el.ondrop = function (e) { e.preventDefault(); pickChoice(el.getAttribute('data-choice')); };
        });
        return;
      }

      if (state.screen === 'MEMORY') {
        const cardsHtml = state.memCards.map((c, idx) => {
          const open = c.open || c.matched;
          return '<button class="mem-card ' + (open ? 'open' : '') + ' ' + (c.matched ? 'matched' : '') + '" onclick="flipMemory(' + idx + ')" ' + (open || state.memLocked ? 'disabled' : '') + '>' + (open ? renderArtHtml(c.key, c.title, c.emoji, c.photo, 'art-sm') + '<span>' + c.title + '</span>' : '<span style="font-size:24px;">' + (idx + 1) + '</span><span style="font-size:13px;">뒤집기</span>') + '</button>';
        }).join('');
        root.innerHTML = renderTrack(state.memMatched, state.memPairs, '메모리 카드 짝 찾기 여행') + '<div class="toolbar"><div class="tab-group"><button class="tab-btn ' + (state.memPairs===4?'active':'') + '" onclick="startMemory(4)">4쌍 (8장)</button><button class="tab-btn ' + (state.memPairs===6?'active':'') + '" onclick="startMemory(6)">6쌍 (12장)</button><button class="tab-btn ' + (state.memPairs===8?'active':'') + '" onclick="startMemory(8)">8쌍 (16장)</button></div><div style="font-weight:700;">찾은 짝 ' + state.memMatched + '/' + state.memPairs + '쌍 · 시도 ' + state.memAttempts + '회</div></div><section class="card"><div style="font-weight:800;font-size:18px;color:#0047A0;">' + state.memMessage + '</div><div class="memory-grid">' + cardsHtml + '</div></section>';
        return;
      }

      if (state.screen === 'COLORING') {
        const activeT = COLOR_TEMPLATES.find(t => t.id === state.colTemplate);
        root.innerHTML = '<div class="toolbar no-print"><div class="tab-group">' +
          COLOR_TEMPLATES.map(t => '<button class="tab-btn ' + (state.colTemplate===t.id?'active':'') + '" onclick="state.colTemplate=\\'' + t.id + '\\';state.colRegions={};state.colHistory=[];penImageData=null;render();">' + t.title + '</button>').join('') +
          '</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn-sec" onclick="state.colShowGuide=!state.colShowGuide;render();">색깔 힌트</button><button class="btn-sec" onclick="if(state.colHistory.length){state.colRegions=state.colHistory.pop();render();}">되돌리기</button><button class="btn-sec" onclick="state.colRegions={};state.colHistory=[];penImageData=null;render();">새로 칠하기</button><button class="btn-sec" onclick="saveColoringPng()">그림 저장</button><button class="cta-btn" style="background:#059669;" onclick="window.print()">인쇄하기</button></div></div>' +
          (state.colShowGuide ? '<div class="no-print" style="background:#FEF3C7;border:2px solid #F59E0B;border-radius:16px;padding:12px 16px;font-weight:700;margin-bottom:14px;">색깔 힌트: ' + activeT.guide + '</div>' : '') +
          '<div class="coloring-layout"><aside class="card no-print" style="padding:18px;"><h2 style="font-size:17px;margin:0 0 8px;">1. 색칠 방법</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px;"><button class="tab-btn ' + (state.colTool==='paint'?'active':'') + '" style="border:1px solid #CBD5E1;" onclick="state.colTool=\\'paint\\';render();">칸 채우기</button><button class="tab-btn ' + (state.colTool==='pen'?'active':'') + '" style="border:1px solid #CBD5E1;" onclick="state.colTool=\\'pen\\';render();">펜 그리기</button><button class="tab-btn ' + (state.colTool==='eraser'?'active':'') + '" style="border:1px solid #CBD5E1;" onclick="state.colTool=\\'eraser\\';render();">펜 지우개</button></div>' +
          (state.colTool !== 'paint' ? '<h2 style="font-size:16px;margin:0 0 6px;">펜 굵기</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px;"><button class="tab-btn ' + (state.colBrush===8?'active':'') + '" style="border:1px solid #CBD5E1;" onclick="state.colBrush=8;render();">가늘게</button><button class="tab-btn ' + (state.colBrush===14?'active':'') + '" style="border:1px solid #CBD5E1;" onclick="state.colBrush=14;render();">보통</button><button class="tab-btn ' + (state.colBrush===26?'active':'') + '" style="border:1px solid #CBD5E1;" onclick="state.colBrush=26;render();">굵게</button></div>' : '') +
          '<h2 style="font-size:17px;margin:0;">2. 색깔 고르기</h2><div class="swatch-grid">' +
          COLOR_PALETTE.map(s => '<button class="swatch-btn ' + (state.colColor===s.hex && state.colTool!=='eraser'?'active':'') + '" onclick="state.colColor=\\'' + s.hex + '\\';if(state.colTool===\\'eraser\\')state.colTool=\\'pen\\';render();"><span class="swatch-dot" style="background:' + s.hex + '"></span><span>' + s.name + '</span></button>').join('') +
          '</div></aside><section class="card print-sheet"><h2 style="margin:0 0 12px;font-size:22px;">' + activeT.title + ' 색칠하기</h2><div class="canvas-stage">' + getColoringSvg(state.colTemplate) + '<canvas id="pen-canvas" width="1200" height="900" style="pointer-events:' + (state.colTool==='paint'?'none':'auto') + ';touch-action:none;"></canvas></div></section></div>';
        bindPenCanvas();
        return;
      }

      if (state.screen === 'PUZZLE') {
        const puzSymbols = QUESTIONS.filter(q => PUZZLE_KEYS.includes(q.symbolKey));
        const activeSym = puzSymbols.find(s => s.symbolKey === state.puzKey) || puzSymbols[0];
        const rows = state.puzCount === 6 ? 2 : 3;
        const doneCount = state.puzSlots.filter(x => x !== null).length;
        const slotsHtml = state.puzSlots.map((val, idx) => {
          const r = Math.floor(idx / 3), c = idx % 3;
          return '<button class="puzzle-slot ' + (val!==null?'occupied':'') + '" data-puz-slot="' + idx + '" onclick="if(state.puzSelected!==null)placePuzzlePiece(state.puzSelected,' + idx + ')">' + (val !== null ? renderSliceHtml(activeSym, r, c, rows) : '<span class="puzzle-slot-num">' + (idx + 1) + '</span>') + '</button>';
        }).join('');
        const trayHtml = state.puzTray.map(t => '<button class="tray-piece ' + (state.puzSelected===t.idx?'selected':'') + '" data-tray-idx="' + t.idx + '" data-row="' + t.row + '" data-col="' + t.col + '">' + renderSliceHtml(activeSym, t.row, t.col, rows) + '</button>').join('');

        root.innerHTML = renderTrack(doneCount, state.puzCount, activeSym.title + ' 퍼즐 완성 길') + '<div class="toolbar"><div class="tab-group">' +
          puzSymbols.map(s => '<button class="tab-btn ' + (state.puzKey===s.symbolKey?'active':'') + '" onclick="resetPuzzle(\\'' + s.symbolKey + '\\',state.puzCount)">' + s.title + '</button>').join('') +
          '</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn-sec" onclick="resetPuzzle(state.puzKey,6)">6조각</button><button class="btn-sec" onclick="resetPuzzle(state.puzKey,9)">9조각</button><button class="btn-sec" style="background:' + (state.puzGhost?'#FBBF24':'#FEF3C7') + ';border-color:#F59E0B;" onclick="state.puzGhost=!state.puzGhost;render();">' + (state.puzGhost?'👁️ 힌트 그림자 켜짐':'👁️ 힌트 그림자 보기') + '</button><button class="btn-sec" onclick="resetPuzzle(state.puzKey,state.puzCount)">다시 섞기</button></div></div>' +
          '<div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:16px;padding:12px 16px;font-weight:800;margin-bottom:14px;">' + state.puzMessage + '</div>' +
          '<div class="puzzle-layout"><section class="card"><h2 style="margin:0 0 10px;">' + activeSym.title + ' 퍼즐 판 (' + doneCount + '/' + state.puzCount + ')</h2><div class="puzzle-board" style="aspect-ratio:' + (state.puzCount===6?'3/2':'1/1') + ';">' + (state.puzGhost ? '<div style="position:absolute;inset:0;opacity:0.28;pointer-events:none;padding:10px;">' + (activeSym.customPhotoUrl ? '<img src="' + activeSym.customPhotoUrl + '" style="width:100%;height:100%;object-fit:cover;"/>' : getSvgMarkup(activeSym.symbolKey)) + '</div>' : '') + '<div class="puzzle-grid" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(' + rows + ',1fr);">' + slotsHtml + '</div></div></section><section class="card">' + (doneCount === state.puzCount ? '<div style="text-align:center;padding:20px 0;"><div style="font-size:54px;">🐯 🎉</div><h3>' + activeSym.title + ' 퍼즐 완성!</h3><button class="cta-btn" onclick="resetPuzzle(state.puzKey,state.puzCount)">한 번 더 맞추기</button></div>' : '<h2 style="margin:0 0 6px;">퍼즐 조각 상자</h2><p style="margin:0;font-size:14px;color:#475569;">조각을 끌어서 왼쪽 빈칸에 놓거나, 조각을 누른 뒤 빈칸 번호를 누르세요.</p><div class="tray-grid">' + trayHtml + '</div>') + '</section></div>';
        bindPuzzleDrag();
      }
    }

    window.addEventListener('keydown', function (e) {
      if (state.screen === 'QUIZ') {
        if (state.quizStatus === 'CORRECT' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); nextQuestion(); return; }
        const n = parseInt(e.key, 10);
        if (!isNaN(n) && n >= 1 && n <= state.shuffledChoices.length) pickChoice(state.shuffledChoices[n - 1].id);
      } else if (state.screen === 'PUZZLE' && state.puzSelected !== null) {
        const n = parseInt(e.key, 10);
        if (!isNaN(n) && n >= 1 && n <= state.puzCount) placePuzzlePiece(state.puzSelected, n - 1);
      }
    });

    render();
  </script>
</body>
</html>`;
}
