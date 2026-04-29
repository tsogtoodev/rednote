"use client";

import { Search, Bell, Pencil, Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGS, useLang } from "../lib/i18n";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  onLoginClick: () => void;
};

export function TopNav({ query, onQueryChange, onLoginClick }: Props) {
  const { t, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

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

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Language"
              className="flex h-10 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground hover:bg-surface"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">
                {LANGS.find((l) => l.code === lang)?.native}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg animate-fade-in">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setMenuOpen(false);
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

          <button
            onClick={onLoginClick}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-hover"
          >
            {t.login}
          </button>
        </nav>
      </div>
    </header>
  );
}
