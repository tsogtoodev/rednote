"use client";

import { Search, Bell, Pencil, Check, Globe, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGS, useLang } from "../lib/i18n";
import { avatarUrl } from "../lib/img";
import type { SessionUser } from "@/lib/types";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  onLoginClick: () => void;
  user: SessionUser | null;
  onLogout: () => void;
};

export function TopNav({
  query,
  onQueryChange,
  onLoginClick,
  user,
  onLogout,
}: Props) {
  const { t, lang, loc, setLang } = useLang();
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langOpen && !langRef.current?.contains(target)) setLangOpen(false);
      if (userOpen && !userRef.current?.contains(target)) setUserOpen(false);
    };
    if (langOpen || userOpen) {
      window.addEventListener("mousedown", onClick);
      return () => window.removeEventListener("mousedown", onClick);
    }
  }, [langOpen, userOpen]);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1480px] items-center gap-6 px-6">
        <a href="/" className="flex shrink-0 items-center gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-brand">
            {t.brandName}
          </span>
          <span className="hidden text-[11px] font-medium text-muted lg:inline">
            {t.brandSub}
          </span>
        </a>

        <div className="flex max-w-[480px] flex-1 items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-10 w-full rounded-full bg-surface pl-4 pr-12 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <button
              aria-label={t.search}
              className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-black/5"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex shrink-0 items-center gap-2">
          <button className="hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-surface md:flex">
            <Pencil className="h-4 w-4" />
            {t.publish}
          </button>
          <a
            href="#"
            className="hidden text-sm text-muted-foreground hover:text-foreground lg:block"
          >
            {t.creatorCenter}
          </a>
          <a
            href="#"
            className="hidden text-sm text-muted-foreground hover:text-foreground lg:block"
          >
            {t.business}
          </a>
          <button
            aria-label={t.notifications}
            className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-surface md:flex"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Language"
              className="flex h-10 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground hover:bg-surface"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">
                {LANGS.find((l) => l.code === lang)?.native}
              </span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg animate-fade-in">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-surface"
                  >
                    <span>{l.native}</span>
                    {lang === l.code && (
                      <Check className="h-4 w-4 text-brand" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-full bg-surface pl-1 pr-3 text-sm hover:bg-black/10"
              >
                <img
                  src={avatarUrl(user.avatarSeed, 40)}
                  alt={loc(user.displayName)}
                  className="h-8 w-8 rounded-full bg-surface object-cover"
                />
                <span className="hidden max-w-[120px] truncate text-foreground sm:inline">
                  {loc(user.displayName)}
                </span>
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg animate-fade-in">
                  <button
                    onClick={() => {
                      onLogout();
                      setUserOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface"
                  >
                    <LogOut className="h-4 w-4" />
                    {lang === "mn" ? "Гарах" : "退出登录"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-hover"
            >
              {t.login}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
