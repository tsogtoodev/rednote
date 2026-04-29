"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "mn" | "zh";

export type Loc = { zh: string; mn: string };

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "mn", label: "Монгол", native: "Монгол" },
  { code: "zh", label: "中文", native: "中文" },
];

type Strings = {
  appTitle: string;
  appTagline: string;
  searchPlaceholder: string;
  search: string;
  publish: string;
  creatorCenter: string;
  business: string;
  notifications: string;
  login: string;
  brandName: string;
  brandSub: string;

  navDiscover: string;
  navFollow: string;
  navNearby: string;
  hotTopics: string;

  about: string;
  userAgreement: string;
  privacyPolicy: string;
  complaint: string;
  helpCenter: string;
  copyright: string;

  follow: string;
  followed: string;
  followers: string;
  totalComments: (n: string) => string;
  reply: string;
  commentPlaceholder: string;
  close: string;
  prev: string;
  next: string;
  imageNth: (n: number) => string;
  emptyTitle: string;
  emptyHint: string;

  loginTitle: string;
  loginSubtitle: string;
  phonePlaceholder: string;
  codePlaceholder: string;
  getCode: string;
  loginButton: string;
  agreeText: string;
  loginWeChat: string;
  loginWeibo: string;
  loginQR: string;
  brandPanelLine1: string;
  brandPanelLine2: string;
};

const STRINGS: Record<Lang, Strings> = {
  mn: {
    appTitle: "RedNote — Таны амьдралын сонирхлын нийгэмлэг",
    appTagline: "Таны амьдралын сонирхлын нийгэмлэг",
    searchPlaceholder: "RedNote дотор хайх",
    search: "Хайх",
    publish: "Нийтлэх",
    creatorCenter: "Бүтээлийн төв",
    business: "Бизнесийн хамтрал",
    notifications: "Мэдэгдэл",
    login: "Нэвтрэх",
    brandName: "RedNote",
    brandSub: "Улаан тэмдэглэл",

    navDiscover: "Нээх",
    navFollow: "Дагах",
    navNearby: "Ойролцоо",
    hotTopics: "Халуун сэдэв",

    about: "Бидний тухай",
    userAgreement: "Хэрэглэгчийн гэрээ",
    privacyPolicy: "Нууцлалын бодлого",
    complaint: "Зөрчлийн гомдол",
    helpCenter: "Тусламжийн төв",
    copyright: "© 2026 RedNote",

    follow: "Дагах",
    followed: "Дагасан",
    followers: "Дагагч",
    totalComments: (n) => `Нийт ${n} сэтгэгдэл`,
    reply: "Хариулах",
    commentPlaceholder: "Сэтгэгдэл бичих...",
    close: "Хаах",
    prev: "Өмнөх зураг",
    next: "Дараагийн зураг",
    imageNth: (n) => `${n}-р зураг`,
    emptyTitle: "Холбоотой бичлэг олдсонгүй",
    emptyHint: "Өөр ангиллаас үзээрэй",

    loginTitle: "Утсаар нэвтрэх",
    loginSubtitle: "Бүртгэлгүй дугаар автоматаар бүртгэгдэнэ",
    phonePlaceholder: "Утасны дугаараа оруулна уу",
    codePlaceholder: "Баталгаажуулах код",
    getCode: "Код авах",
    loginButton: "Нэвтрэх",
    agreeText: "Би уншиж зөвшөөрсөн:",
    loginWeChat: "WeChat",
    loginWeibo: "Weibo",
    loginQR: "QR-аар нэвтрэх",
    brandPanelLine1: "200 саяны амьдрах хэв маяг",
    brandPanelLine2: "Энд миний амьдрал тэмдэглэгдэнэ",
  },
  zh: {
    appTitle: "小红书 - 你的生活兴趣社区",
    appTagline: "你的生活兴趣社区",
    searchPlaceholder: "搜索小红书",
    search: "搜索",
    publish: "发布",
    creatorCenter: "创作中心",
    business: "业务合作",
    notifications: "通知",
    login: "登录",
    brandName: "小红书",
    brandSub: "RedNote",

    navDiscover: "发现",
    navFollow: "关注",
    navNearby: "附近",
    hotTopics: "热门话题",

    about: "关于我们",
    userAgreement: "用户协议",
    privacyPolicy: "隐私政策",
    complaint: "侵权投诉",
    helpCenter: "帮助中心",
    copyright: "© 2026 小红书 · 沪 ICP 备 13030189 号",

    follow: "关注",
    followed: "已关注",
    followers: "粉丝",
    totalComments: (n) => `共 ${n} 条评论`,
    reply: "回复",
    commentPlaceholder: "说点什么...",
    close: "关闭",
    prev: "上一张",
    next: "下一张",
    imageNth: (n) => `第 ${n} 张`,
    emptyTitle: "暂时没有相关笔记",
    emptyHint: "换个分类看看吧～",

    loginTitle: "手机号登录",
    loginSubtitle: "未注册的手机号将自动注册",
    phonePlaceholder: "请输入手机号",
    codePlaceholder: "验证码",
    getCode: "获取验证码",
    loginButton: "登录",
    agreeText: "我已阅读并同意",
    loginWeChat: "微信",
    loginWeibo: "微博",
    loginQR: "扫码登录",
    brandPanelLine1: "2 亿人的生活方式",
    brandPanelLine2: "在这里，标记我的生活",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
  loc: (l: Loc) => string;
};

const LangCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "rednote.lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("mn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "mn" || saved === "zh") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang === "mn" ? "mn" : "zh-CN";
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const loc = useCallback((l: Loc) => l[lang], [lang]);

  return (
    <LangCtx.Provider value={{ lang, setLang, t: STRINGS[lang], loc }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
