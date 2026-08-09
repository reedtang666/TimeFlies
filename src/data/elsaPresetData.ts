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

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'elsa-crown',
    name: '艾莎水晶王冠',
    emoji: '👑',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'snowflake-magic',
    name: '冰雪星光魔法',
    emoji: '❄️',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'aurora-princess',
    name: '极光小公主',
    emoji: '✨',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
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
