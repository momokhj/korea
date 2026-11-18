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
    button:focus-visible {
      outline: 4px solid #2563EB;
      outline-offset: 2px;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid #E2E8F0;
      padding: 14px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      white-space: nowrap;
    }
    .nav-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }
    .nav-btn {
      background: transparent;
      border: 0;
      font-size: 16px;
      font-weight: 700;
      color: var(--muted);
      padding: 8px 12px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .nav-btn.active {
      color: var(--primary);
      background: #EFF6FF;
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
    main {
      max-width: 1040px;
      margin: 0 auto;
      padding: 20px 16px 40px;
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
      margin-bottom: 18px;
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
      margin: 18px 8px 8px;
    }
    .track-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 999px;
      transition: width 260ms ease;
    }
    .mascot {
      position: absolute;
      top: -26px;
      transform: translateX(-50%);
      transition: left 280ms ease;
      font-size: 32px;
      line-height: 1;
      user-select: none;
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
    .target-art {
      font-size: 86px;
      line-height: 1.1;
      margin-bottom: 10px;
    }
    .target-art img {
      width: 160px;
      height: 160px;
      object-fit: cover;
      border-radius: 16px;
      border: 2px solid #CBD5E1;
    }
    .choices-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    }
    .choice-btn {
      min-height: 160px;
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
    .choice-btn.dimmed {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .choice-btn.correct {
      background: #ECFDF5;
      border-color: var(--emerald);
    }
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
    .choice-emoji { font-size: 56px; line-height: 1.1; }
    .choice-emoji img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 12px;
    }
    .choice-label { font-size: 22px; font-weight: 800; }
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
    .memory-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    @media (max-width: 600px) {
      .memory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .mem-card {
      min-height: 140px;
      border-radius: 18px;
      border: 2px solid #1E40AF;
      background: var(--primary);
      color: #fff;
      font-size: 20px;
      font-weight: 800;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px;
    }
    .mem-card.open {
      background: #fff;
      color: var(--text);
      border-color: #3B82F6;
    }
    .mem-card.matched {
      background: #ECFDF5;
      color: #065F46;
      border-color: var(--emerald);
    }
    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    .btn-sec {
      min-height: 48px;
      padding: 10px 18px;
      border-radius: 14px;
      border: 1px solid #CBD5E1;
      background: #F8FAFC;
      color: var(--text);
      font-size: 16px;
      font-weight: 700;
    }
    .hidden { display: none !important; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
    .shake { animation: shake 260ms ease; }
    @media (prefers-reduced-motion: reduce) {
      .shake, .mascot, .track-fill { animation: none; transition: none; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">🇰🇷 우리나라 상징 짝 맞추기</div>
    <nav class="nav-links" aria-label="활동 메뉴">
      <button class="nav-btn active" id="nav-home" onclick="setScreen('HOME')">처음 화면</button>
      <button class="nav-btn" id="nav-quiz" onclick="setScreen('QUIZ')">16문제 짝 맞추기</button>
      <button class="nav-btn" id="nav-memory" onclick="setScreen('MEMORY')">메모리 카드 게임</button>
    </nav>
    <button class="cta-btn" id="tts-toggle" onclick="toggleTts()">🔊 읽어주기 켜짐</button>
  </header>

  <main id="app"></main>

  <script>
    const ACHIEVEMENT_STANDARD = ${JSON.stringify(ACHIEVEMENT_STANDARD)};
    const QUESTIONS = ${serializedQuestions};

    let state = {
      screen: 'HOME',
      tts: true,
      quizIndex: 0,
      solvedCount: 0,
      firstTryStars: 0,
      wrongOnCurrent: 0,
      dimmedIds: [],
      quizStatus: 'ASKING',
      showHint: false,
      shuffledChoices: [],
      memPairs: 4,
      memCards: [],
      memSelected: [],
      memMatched: 0,
      memAttempts: 0,
      memLocked: false,
      memMessage: '같은 우리나라 상징 카드 두 장을 찾아보세요!'
    };

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
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = kind === 'ok' ? 660 : kind === 'win' ? 880 : 300;
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
      document.getElementById('tts-toggle').textContent = state.tts ? '🔊 읽어주기 켜짐' : '🔇 읽어주기 꺼짐';
    }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function setScreen(screen) {
      state.screen = screen;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      if (screen === 'HOME') document.getElementById('nav-home').classList.add('active');
      if (screen === 'QUIZ') {
        document.getElementById('nav-quiz').classList.add('active');
        startQuiz();
        return;
      }
      if (screen === 'MEMORY') {
        document.getElementById('nav-memory').classList.add('active');
        startMemory(state.memPairs);
        return;
      }
      render();
    }

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
      const choice = state.shuffledChoices.find(c => c.id === choiceId);
      if (!choice) return;
      if (choice.isCorrect) {
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
        speak('열여섯 문제를 모두 맞혔어요! 정말 잘했어요!');
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
      speak(c.title);
      render();

      if (state.memSelected.length === 2) {
        state.memLocked = true;
        state.memAttempts++;
        const [i1, i2] = state.memSelected;
        const c1 = state.memCards[i1];
        const c2 = state.memCards[i2];
        if (c1.key === c2.key) {
          setTimeout(() => {
            c1.matched = true;
            c2.matched = true;
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
          }, 280);
        } else {
          state.memMessage = '조금 달라요! 다시 기억해서 뒤집어 보아요.';
          render();
          setTimeout(() => {
            c1.open = false;
            c2.open = false;
            state.memSelected = [];
            state.memLocked = false;
            render();
          }, 850);
        }
      }
    }

    function renderTrack(step, total) {
      const pct = Math.round((step / total) * 100);
      return \`
        <div class="track-wrap">
          <div class="track-head">
            <span>🐯 호랑이 친구 이동 길</span>
            <span>\${step} / \${total} 걸음 도착</span>
          </div>
          <div class="track-bar">
            <div class="track-fill" style="width:\${pct}%"></div>
            <div class="mascot" style="left:calc(\${pct}% * 0.94 + 3%)">🐯</div>
          </div>
        </div>
      \`;
    }

    function render() {
      const root = document.getElementById('app');
      if (state.screen === 'HOME') {
        root.innerHTML = \`
          <section class="card" style="text-align:center; padding:36px 24px;">
            <div style="font-size:64px; margin-bottom:10px;">🇰🇷 🌺 🐯</div>
            <h1 style="font-size:34px; margin:0 0 12px;">우리나라를 대표하는 것 알기</h1>
            <p style="font-size:19px; color:#334155; margin:0 0 24px;">
              그림을 보고 알맞은 우리나라 상징 짝을 맞추고 메모리 카드 놀이를 해요!
            </p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:16px; margin-bottom:28px;">
              <button class="cta-btn" style="min-height:64px; font-size:20px; padding:16px 28px;" onclick="setScreen('QUIZ')">
                16문제 짝 맞추기 시작하기
              </button>
              <button class="btn-sec" style="min-height:64px; font-size:20px; padding:16px 28px; background:#FEF3C7; border-color:#F59E0B;" onclick="setScreen('MEMORY')">
                메모리 카드 게임 하기
              </button>
            </div>
            <p style="font-size:14px; color:#475569; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:12px 16px; display:inline-block;">
              성취기준: \${ACHIEVEMENT_STANDARD}
            </p>
          </section>
        \`;
        return;
      }

      if (state.screen === 'QUIZ') {
        if (state.quizStatus === 'FINISHED') {
          root.innerHTML = renderTrack(QUESTIONS.length, QUESTIONS.length) + \`
            <section class="card" style="text-align:center;">
              <div style="font-size:64px;">🏆 🐯 🎉</div>
              <h2 style="font-size:32px; margin:12px 0;">16문제 짝 맞추기 모두 완료!</h2>
              <p style="font-size:20px; color:#334155;">
                맞힌 문제: <strong>\${state.solvedCount} / \${QUESTIONS.length}</strong> · 한 번에 성공: <strong>\${state.firstTryStars}개</strong>
              </p>
              <div class="btn-row" style="justify-content:center; margin-top:24px;">
                <button class="cta-btn" style="min-height:56px; font-size:18px;" onclick="startQuiz()">처음부터 다시 풀기</button>
                <button class="btn-sec" style="min-height:56px; font-size:18px;" onclick="setScreen('MEMORY')">메모리 카드 게임</button>
              </div>
            </section>
          \`;
          return;
        }

        const q = QUESTIONS[state.quizIndex];
        const artHtml = q.customPhotoUrl
          ? \`<img src="\${q.customPhotoUrl}" alt="\${q.title}" />\`
          : \`<span>\${q.emoji}</span>\`;

        const choicesHtml = state.shuffledChoices.map((c, idx) => {
          const dimmed = state.dimmedIds.includes(c.id);
          const ok = state.quizStatus === 'CORRECT' && c.isCorrect;
          const imgHtml = c.isCorrect && q.customPhotoUrl ? \`<img src="\${q.customPhotoUrl}" alt="\${c.label}" />\` : c.emoji;
          return \`
            <button
              class="choice-btn \${dimmed ? 'dimmed' : ''} \${ok ? 'correct' : ''}"
              \${dimmed || state.quizStatus === 'CORRECT' ? 'disabled' : ''}
              onclick="pickChoice('\${c.id}')"
            >
              <span class="choice-num">\${idx + 1}</span>
              <span class="choice-emoji">\${imgHtml}</span>
              <span class="choice-label">\${c.label}</span>
              \${ok ? '<span style="color:#059669;font-weight:800;">✔ 정답!</span>' : ''}
            </button>
          \`;
        }).join('');

        root.innerHTML = renderTrack(state.solvedCount, QUESTIONS.length) + \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-weight:700;">
            <span>\${q.levelLabel} · \${state.quizIndex + 1} / \${QUESTIONS.length} 문제 · 별 \${state.firstTryStars}개</span>
            <button class="btn-sec" onclick="startQuiz()">초기화</button>
          </div>
          <section class="card">
            <div class="quiz-grid">
              <div class="target-box" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'target')" style="cursor:grab;">
                <div class="target-art">\${artHtml}</div>
                <p style="font-size:13px; color:#475569; font-weight:700; margin:0 0 6px;">그림을 끌어다 놓거나 아래 카드를 누르세요</p>
                <h2 style="font-size:26px; margin:8px 0 12px;">\${q.prompt}</h2>
                <div class="btn-row" style="justify-content:center;">
                  <button class="btn-sec" onclick="speak(QUESTIONS[state.quizIndex].prompt)">🔊 다시 듣기</button>
                  <button class="btn-sec" onclick="state.showHint=!state.showHint; render();">💡 힌트</button>
                </div>
                \${state.showHint ? \`<p style="margin-top:12px; background:#FEF3C7; border:1px solid #F59E0B; border-radius:12px; padding:10px; font-weight:700;">힌트: \${q.hint}</p>\` : ''}
              </div>
              <div>
                <p style="font-weight:700; color:#475569; margin-top:0;">알맞은 짝을 누르세요 (숫자 키 1~\${state.shuffledChoices.length})</p>
                <div class="choices-grid" id="choices-container">\${choicesHtml}</div>
                \${state.quizStatus === 'RETRY' ? '<div class="feedback-box feedback-retry">아쉬워요! 다른 그림을 다시 골라볼까요?</div>' : ''}
                \${state.quizStatus === 'CORRECT' ? \`
                  <div class="feedback-box feedback-ok">
                    <span>✔ \${q.celebrationText}</span>
                    <button class="cta-btn" style="background:#059669;" onclick="nextQuestion()">
                      \${state.quizIndex + 1 >= QUESTIONS.length ? '결과 보기' : '다음 문제 →'}
                    </button>
                  </div>
                \` : ''}
              </div>
            </div>
          </section>
        \`;
        document.querySelectorAll('.choice-btn').forEach((btn, i) => {
          const cid = state.shuffledChoices[i]?.id;
          if (!cid) return;
          btn.addEventListener('dragover', (e) => e.preventDefault());
          btn.addEventListener('drop', (e) => {
            e.preventDefault();
            pickChoice(cid);
          });
        });
        return;
      }

      if (state.screen === 'MEMORY') {
        const cardsHtml = state.memCards.map((c, idx) => {
          const open = c.open || c.matched;
          const imgHtml = c.photo ? \`<img src="\${c.photo}" alt="\${c.title}" style="width:68px;height:68px;object-fit:cover;border-radius:10px;" />\` : \`<span style="font-size:44px;">\${c.emoji}</span>\`;
          return \`
            <button class="mem-card \${open ? 'open' : ''} \${c.matched ? 'matched' : ''}" onclick="flipMemory(\${idx})" \${open || state.memLocked ? 'disabled' : ''}>
              \${open ? imgHtml + '<span>' + c.title + '</span>' : '<span style="font-size:24px;">' + (idx + 1) + '</span><span style="font-size:13px;">뒤집기</span>'}
            </button>
          \`;
        }).join('');

        root.innerHTML = renderTrack(state.memMatched, state.memPairs) + \`
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between; gap:10px; margin-bottom:12px;">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="btn-sec" onclick="startMemory(4)">4쌍 (8장)</button>
              <button class="btn-sec" onclick="startMemory(6)">6쌍 (12장)</button>
              <button class="btn-sec" onclick="startMemory(8)">8쌍 (16장)</button>
            </div>
            <div style="font-weight:700; align-self:center;">
              찾은 짝 \${state.memMatched}/\${state.memPairs}쌍 · 시도 \${state.memAttempts}회
            </div>
          </div>
          <section class="card">
            <div style="font-weight:800; font-size:18px; color:#0047A0; margin-bottom:10px;">\${state.memMessage}</div>
            <div class="memory-grid">\${cardsHtml}</div>
          </section>
        \`;
      }
    }

    window.addEventListener('keydown', function (e) {
      if (state.screen !== 'QUIZ') return;
      if (state.quizStatus === 'CORRECT' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextQuestion();
        return;
      }
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= state.shuffledChoices.length) {
        pickChoice(state.shuffledChoices[n - 1].id);
      }
    });

    render();
  </script>
</body>
</html>`;
}
