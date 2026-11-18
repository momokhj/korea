export type DifficultyLevel = 1 | 2 | 3;

export interface ChoiceOption {
  id: string;
  label: string;
  emoji: string;
  artworkId: string;
  isCorrect: boolean;
}

export interface SymbolQuestion {
  id: number;
  symbolKey: string;
  title: string;
  emoji: string;
  level: DifficultyLevel;
  levelLabel: string;
  prompt: string;
  hint: string;
  celebrationText: string;
  customPhotoUrl?: string;
  choices: ChoiceOption[];
}

export const ACHIEVEMENT_STANDARD =
  '[4사회03-06] 우리나라를 상징하는 것들을 살펴보고 나라 사랑하는 마음을 기른다. (기본 / 초3~4 / 사회 / (3) 시민의 삶)';

export const DIFFICULTY_META: Record<
  DifficultyLevel,
  { name: string; choiceCount: number; description: string; badgeColor: string }
> = {
  1: {
    name: '1단계 · 기초 상징',
    choiceCount: 2,
    description: '그림 2개 중에서 알맞은 짝을 찾아요.',
    badgeColor: '#0047A0',
  },
  2: {
    name: '2단계 · 전통과 문화',
    choiceCount: 3,
    description: '그림 3개 중에서 알맞은 짝을 찾아요.',
    badgeColor: '#059669',
  },
  3: {
    name: '3단계 · 나라 사랑 심화',
    choiceCount: 4,
    description: '그림 4개 중에서 알맞은 짝을 찾아요.',
    badgeColor: '#CD2E3A',
  },
};

export const INITIAL_SYMBOL_QUESTIONS: SymbolQuestion[] = [
  // 1단계: 기초 상징 (1~5번, 보기 2개)
  {
    id: 1,
    symbolKey: 'taegeukgi',
    title: '태극기',
    emoji: '🇰🇷',
    level: 1,
    levelLabel: '1단계',
    prompt: '우리나라를 대표하는 국기예요.',
    hint: '하얀 바탕에 빨강·파랑 태극 무늬와 네 모서리에 검은 막대가 있어요.',
    celebrationText: '맞았어요! 우리나라 국기는 태극기예요.',
    choices: [
      { id: 'c1-1', label: '태극기', emoji: '🇰🇷', artworkId: 'taegeukgi', isCorrect: true },
      { id: 'c1-2', label: '태양', emoji: '☀️', artworkId: 'sun', isCorrect: false },
    ],
  },
  {
    id: 2,
    symbolKey: 'mugunghwa',
    title: '무궁화',
    emoji: '🌺',
    level: 1,
    levelLabel: '1단계',
    prompt: '우리나라를 대표하는 꽃이에요.',
    hint: '연한 분홍색 꽃잎 다섯 장에 가운데가 진한 붉은색인 꽃이에요.',
    celebrationText: '잘했어요! 무궁화는 우리나라 꽃이에요.',
    choices: [
      { id: 'c2-1', label: '무궁화', emoji: '🌺', artworkId: 'mugunghwa', isCorrect: true },
      { id: 'c2-2', label: '해바라기', emoji: '🌻', artworkId: 'sunflower', isCorrect: false },
    ],
  },
  {
    id: 3,
    symbolKey: 'hanbok',
    title: '한복',
    emoji: '👘',
    level: 1,
    levelLabel: '1단계',
    prompt: '명절에 입는 우리나라 전통 옷이에요.',
    hint: '고운 색깔의 저고리와 넓은 치마 또는 바지로 이루어져 있어요.',
    celebrationText: '정답이에요! 아름다운 우리나라 옷은 한복이에요.',
    choices: [
      { id: 'c3-1', label: '한복', emoji: '👘', artworkId: 'hanbok', isCorrect: true },
      { id: 'c3-2', label: '티셔츠', emoji: '👕', artworkId: 'tshirt', isCorrect: false },
    ],
  },
  {
    id: 4,
    symbolKey: 'aegukga',
    title: '애국가',
    emoji: '🎵',
    level: 1,
    levelLabel: '1단계',
    prompt: '우리나라를 대표하는 노래예요.',
    hint: '태극기를 바라보며 바른 자세로 부르는 노래예요.',
    celebrationText: '최고예요! 우리나라 노래는 애국가예요.',
    choices: [
      { id: 'c4-1', label: '애국가', emoji: '🎶', artworkId: 'aegukga', isCorrect: true },
      { id: 'c4-2', label: '생일 노래', emoji: '🎂', artworkId: 'birthday', isCorrect: false },
    ],
  },
  {
    id: 5,
    symbolKey: 'hangeul',
    title: '한글',
    emoji: '🔤',
    level: 1,
    levelLabel: '1단계',
    prompt: '우리가 쓰고 읽는 우리나라 글자예요.',
    hint: 'ㄱ, ㄴ, ㄷ, ㅏ, ㅓ, ㅗ 처럼 자음과 모음이 모여 글자가 돼요.',
    celebrationText: '멋져요! 세종대왕님이 만드신 한글이에요.',
    choices: [
      { id: 'c5-1', label: '한글', emoji: '가', artworkId: 'hangeul', isCorrect: true },
      { id: 'c5-2', label: '숫자', emoji: '🔢', artworkId: 'numbers', isCorrect: false },
    ],
  },

  // 2단계: 전통 명절과 생활 문화 (6~11번, 보기 3개)
  {
    id: 6,
    symbolKey: 'seollal',
    title: '설날',
    emoji: '🧧',
    level: 2,
    levelLabel: '2단계',
    prompt: '새해 첫날, 세배하고 떡국을 먹어요.',
    hint: '하얀 가래떡을 썰어 끓인 따뜻한 떡국과 복주머니가 떠올라요.',
    celebrationText: '맞았어요! 설날에는 세배하고 떡국을 먹어요.',
    choices: [
      { id: 'c6-1', label: '설날', emoji: '🥣', artworkId: 'seollal', isCorrect: true },
      { id: 'c6-2', label: '크리스마스', emoji: '🎄', artworkId: 'tree_star', isCorrect: false },
      { id: 'c6-3', label: '어린이날', emoji: '🎈', artworkId: 'children_balloon', isCorrect: false },
    ],
  },
  {
    id: 7,
    symbolKey: 'chuseok',
    title: '추석',
    emoji: '🌕',
    level: 2,
    levelLabel: '2단계',
    prompt: '보름달을 보며 송편을 먹는 명절이에요.',
    hint: '가을 밤하늘의 둥근 보름달과 반달 모양 송편을 찾아보세요.',
    celebrationText: '정답이에요! 한가위 추석에는 송편을 빚어요.',
    choices: [
      { id: 'c7-1', label: '추석', emoji: '🌕', artworkId: 'chuseok', isCorrect: true },
      { id: 'c7-2', label: '식목일', emoji: '🌱', artworkId: 'sprout', isCorrect: false },
      { id: 'c7-3', label: '할로윈', emoji: '🎃', artworkId: 'pumpkin', isCorrect: false },
    ],
  },
  {
    id: 8,
    symbolKey: 'kimchi',
    title: '김치',
    emoji: '🥬',
    level: 2,
    levelLabel: '2단계',
    prompt: '배추에 빨간 양념을 버무린 음식이에요.',
    hint: '아삭아삭한 배추와 매콤한 빨간 양념이 어우러진 반찬이에요.',
    celebrationText: '잘했어요! 김치는 세계가 좋아하는 우리나라 음식이에요.',
    choices: [
      { id: 'c8-1', label: '김치', emoji: '🥬', artworkId: 'kimchi', isCorrect: true },
      { id: 'c8-2', label: '피자', emoji: '🍕', artworkId: 'pizza', isCorrect: false },
      { id: 'c8-3', label: '햄버거', emoji: '🍔', artworkId: 'burger', isCorrect: false },
    ],
  },
  {
    id: 9,
    symbolKey: 'bibimbap',
    title: '비빔밥',
    emoji: '🍚',
    level: 2,
    levelLabel: '2단계',
    prompt: '밥과 나물을 고추장에 비벼 먹어요.',
    hint: '여러 색깔의 나물과 달걀이 그릇에 예쁘게 담긴 밥이에요.',
    celebrationText: '대단해요! 알록달록 건강한 비빔밥이에요.',
    choices: [
      { id: 'c9-1', label: '비빔밥', emoji: '🍲', artworkId: 'bibimbap', isCorrect: true },
      { id: 'c9-2', label: '스파게티', emoji: '🍝', artworkId: 'spaghetti', isCorrect: false },
      { id: 'c9-3', label: '초밥', emoji: '🍣', artworkId: 'sushi', isCorrect: false },
    ],
  },
  {
    id: 10,
    symbolKey: 'hanok',
    title: '한옥',
    emoji: '🏯',
    level: 2,
    levelLabel: '2단계',
    prompt: '나무와 기와로 지은 우리나라 전통 집이에요.',
    hint: '처마가 멋지게 올라간 기와지붕과 온돌이 있는 집이에요.',
    celebrationText: '정답이에요! 따스한 우리나라 전통 집은 한옥이에요.',
    choices: [
      { id: 'c10-1', label: '한옥', emoji: '🏯', artworkId: 'hanok', isCorrect: true },
      { id: 'c10-2', label: '텐트', emoji: '⛺', artworkId: 'tent', isCorrect: false },
      { id: 'c10-3', label: '이글루', emoji: '🧊', artworkId: 'igloo', isCorrect: false },
    ],
  },
  {
    id: 11,
    symbolKey: 'tiger',
    title: '호랑이',
    emoji: '🐯',
    level: 2,
    levelLabel: '2단계',
    prompt: '옛이야기에 자주 나오는 용감한 동물이에요.',
    hint: '노란 털에 검은 줄무늬가 있는 씩씩한 백두산 호랑이예요.',
    celebrationText: '어흥! 용감한 우리나라 호랑이를 잘 찾았어요.',
    choices: [
      { id: 'c11-1', label: '호랑이', emoji: '🐯', artworkId: 'tiger', isCorrect: true },
      { id: 'c11-2', label: '코알라', emoji: '🐨', artworkId: 'koala', isCorrect: false },
      { id: 'c11-3', label: '펭귄', emoji: '🐧', artworkId: 'penguin', isCorrect: false },
    ],
  },

  // 3단계: 나라 사랑과 심화 상징 연결 (12~16번, 보기 4개)
  {
    id: 12,
    symbolKey: 'taegeuk',
    title: '태극 무늬',
    emoji: '☯️',
    level: 3,
    levelLabel: '3단계',
    prompt: '태극기 가운데의 파랑·빨강 동그라미예요.',
    hint: '위쪽은 빨간색, 아래쪽은 파란색이 어우러진 둥근 무늬예요.',
    celebrationText: '맞았어요! 조화를 뜻하는 태극 무늬예요.',
    choices: [
      { id: 'c12-1', label: '태극 무늬', emoji: '🔴🔵', artworkId: 'taegeuk', isCorrect: true },
      { id: 'c12-2', label: '별 모양', emoji: '⭐', artworkId: 'star_shape', isCorrect: false },
      { id: 'c12-3', label: '하트 모양', emoji: '❤️', artworkId: 'heart_shape', isCorrect: false },
      { id: 'c12-4', label: '네모 모양', emoji: '🟦', artworkId: 'square_shape', isCorrect: false },
    ],
  },
  {
    id: 13,
    symbolKey: 'trigrams',
    title: '건곤감리(4괘)',
    emoji: '☰',
    level: 3,
    levelLabel: '3단계',
    prompt: '태극기 네 모서리의 검은 막대 무늬예요.',
    hint: '하늘, 땅, 물, 불을 나타내는 네 가지 검은 막대예요.',
    celebrationText: '대단해요! 건·곤·감·리 4괘를 정확히 알았어요.',
    choices: [
      { id: 'c13-1', label: '건곤감리(4괘)', emoji: '☰', artworkId: 'trigrams', isCorrect: true },
      { id: 'c13-2', label: '물결 무늬', emoji: '〰️', artworkId: 'wave_pattern', isCorrect: false },
      { id: 'c13-3', label: '꽃 무늬', emoji: '🌸', artworkId: 'flower_pattern', isCorrect: false },
      { id: 'c13-4', label: '구름 무늬', emoji: '☁️', artworkId: 'cloud_pattern', isCorrect: false },
    ],
  },
  {
    id: 14,
    symbolKey: 'gwanghwamun',
    title: '광화문',
    emoji: '🏛️',
    level: 3,
    levelLabel: '3단계',
    prompt: '서울 경복궁에 있는 크고 멋진 전통 문이에요.',
    hint: '무지개 모양 아치 문이 세 개 있고 지붕이 웅장한 우리나라 문이에요.',
    celebrationText: '훌륭해요! 우리나라 수도 서울의 광화문이에요.',
    choices: [
      { id: 'c14-1', label: '광화문', emoji: '🏯', artworkId: 'gwanghwamun', isCorrect: true },
      { id: 'c14-2', label: '에펠탑', emoji: '🗼', artworkId: 'eiffel', isCorrect: false },
      { id: 'c14-3', label: '자유의 여신상', emoji: '🗽', artworkId: 'liberty', isCorrect: false },
      { id: 'c14-4', label: '피라미드', emoji: '🔺', artworkId: 'pyramid', isCorrect: false },
    ],
  },
  {
    id: 15,
    symbolKey: 'dokdo',
    title: '독도',
    emoji: '🏝️',
    level: 3,
    levelLabel: '3단계',
    prompt: '동쪽 바다 끝에 있는 소중한 우리나라 섬이에요.',
    hint: '푸른 동해 바다 위에 서 있는 동도와 서도 두 개의 바위섬이에요.',
    celebrationText: '정답이에요! 독도는 우리가 지키는 소중한 우리나라 땅이에요.',
    choices: [
      { id: 'c15-1', label: '독도', emoji: '🏝️', artworkId: 'dokdo', isCorrect: true },
      { id: 'c15-2', label: '사막', emoji: '🏜️', artworkId: 'desert', isCorrect: false },
      { id: 'c15-3', label: '빙하', emoji: '🧊', artworkId: 'glacier', isCorrect: false },
      { id: 'c15-4', label: '화산섬', emoji: '🌋', artworkId: 'volcano', isCorrect: false },
    ],
  },
  {
    id: 16,
    symbolKey: 'patriotism',
    title: '나라 사랑',
    emoji: '💖',
    level: 3,
    levelLabel: '3단계',
    prompt: '태극기와 무궁화를 소중히 여기며 바르게 인사해요.',
    hint: '우리나라 상징을 아끼고 사랑하는 따뜻한 마음을 골라보세요.',
    celebrationText: '참 잘했어요! 우리나라를 사랑하는 멋진 어린이예요!',
    choices: [
      { id: 'c16-1', label: '나라 사랑', emoji: '🇰🇷', artworkId: 'patriotism', isCorrect: true },
      { id: 'c16-2', label: '장난치기', emoji: '😜', artworkId: 'prank', isCorrect: false },
      { id: 'c16-3', label: '버리기', emoji: '🗑️', artworkId: 'trash', isCorrect: false },
      { id: 'c16-4', label: '잊어버리기', emoji: '💤', artworkId: 'forget', isCorrect: false },
    ],
  },
];
