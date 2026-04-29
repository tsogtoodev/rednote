import type { Loc } from "../lib/i18n";

export type Category = {
  id: string;
  label: Loc;
};

export const CATEGORIES: Category[] = [
  { id: "all", label: { zh: "推荐", mn: "Санал болгох" } },
  { id: "fashion", label: { zh: "穿搭", mn: "Хувцас" } },
  { id: "beauty", label: { zh: "美妆", mn: "Гоо сайхан" } },
  { id: "food", label: { zh: "美食", mn: "Хоол" } },
  { id: "travel", label: { zh: "旅行", mn: "Аялал" } },
  { id: "movie", label: { zh: "影视", mn: "Кино" } },
  { id: "career", label: { zh: "职场", mn: "Ажил" } },
  { id: "love", label: { zh: "情感", mn: "Хайр сэтгэл" } },
  { id: "home", label: { zh: "家居", mn: "Гэр ахуй" } },
  { id: "game", label: { zh: "游戏", mn: "Тоглоом" } },
  { id: "fitness", label: { zh: "健身", mn: "Фитнес" } },
  { id: "art", label: { zh: "艺术", mn: "Урлаг" } },
  { id: "tech", label: { zh: "科技", mn: "Технологи" } },
  { id: "education", label: { zh: "教育", mn: "Боловсрол" } },
  { id: "pets", label: { zh: "宠物", mn: "Тэжээвэр" } },
];

export const SIDEBAR_TOPICS: Loc[] = [
  { zh: "穿搭", mn: "Хувцас" },
  { zh: "美食", mn: "Хоол" },
  { zh: "彩妆", mn: "Будалт" },
  { zh: "影视", mn: "Кино" },
  { zh: "职场", mn: "Ажил" },
  { zh: "情感", mn: "Хайр" },
  { zh: "家居", mn: "Гэр" },
  { zh: "游戏", mn: "Тоглоом" },
  { zh: "旅行", mn: "Аялал" },
  { zh: "健身", mn: "Фитнес" },
];
