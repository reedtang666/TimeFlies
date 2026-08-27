export interface Milestone {
  id: string;
  title: string;
  days: number;
  icon: string;
  description: string;
  dateStr?: string;
  isUnlocked?: boolean;
}

export interface PresetAvatar {
  id: string;
  name: string;
  emoji: string;
  url: string;
}

const PRINCESS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%231e3a8a"/><stop offset="100%" stop-color="%230284c7"/></linearGradient></defs><rect width="200" height="200" rx="100" fill="url(%23bg1)"/><text x="100" y="125" font-size="90" text-anchor="middle">👸</text></svg>`;

const SNOWFLAKE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230284c7"/><stop offset="50%" stop-color="%2338bdf8"/><stop offset="100%" stop-color="%23c084fc"/></linearGradient></defs><rect width="200" height="200" rx="100" fill="url(%23bg2)"/><text x="100" y="125" font-size="90" text-anchor="middle">❄️</text></svg>`;

const AURORA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%233b0764"/><stop offset="50%" stop-color="%237e22ce"/><stop offset="100%" stop-color="%2338bdf8"/></linearGradient></defs><rect width="200" height="200" rx="100" fill="url(%23bg3)"/><text x="100" y="125" font-size="90" text-anchor="middle">✨</text></svg>`;

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'elsa-crown',
    name: '艾莎水晶王冠',
    emoji: '👸',
    url: PRINCESS_SVG,
  },
  {
    id: 'snowflake-magic',
    name: '冰雪星光魔法',
    emoji: '❄️',
    url: SNOWFLAKE_SVG,
  },
  {
    id: 'aurora-princess',
    name: '极光小公主',
    emoji: '✨',
    url: AURORA_SVG,
  },
];

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: '降临这片星海 👶',
    days: 0,
    icon: '🌟',
    description: '从这一刻起，阿伦黛尔的冰雪奇缘多了一位可爱的小公主。',
  },
  {
    id: 'm2',
    title: '百天萌芽 💯',
    days: 100,
    icon: '🌸',
    description: '第 100 天，戴上第一顶闪亮的冰晶皇冠，平安健康茁壮成长。',
  },
  {
    id: 'm3',
    title: '一周岁魔法 birthday 🎂',
    days: 365,
    icon: '👑',
    description: '踏出勇敢的第一步，学会叫第一声“爸爸妈妈”！',
  },
  {
    id: 'm4',
    title: '陪伴 500 天纪念 ❄️',
    days: 500,
    icon: '💎',
    description: '五百个日夜的欢声笑语，汇聚成世界上最璀璨的冰晶。',
  },
  {
    id: 'm5',
    title: '1000 天冰雪纪元 🏰',
    days: 1000,
    icon: '🏰',
    description: '勇敢、聪慧的小艾莎，正张开翅膀探索大大的奇妙世界！',
  },
];

export const DEFAULT_QUOTES = [
  '“做你自己的女王，勇敢去光芒亮丽闪耀吧！”',
  '“愿你拥有艾莎般的勇敢，安娜般的温暖。”',
  '“陪伴你长大的每一秒，都是时光送给我们最美妙的魔法。”',
  '“Let it go! 自由快乐、无畏成长。”',
];
