"use client";

import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "../lib/i18n";
import { login } from "@/lib/api";
import type { SessionUser } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onLoggedIn: (user: SessionUser) => void;
};

export function LoginModal({ open, onClose, onLoggedIn }: Props) {
  const { t } = useLang();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhone("");
    setCode("");
    setErr(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!phone.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      const { user } = await login(phone.trim());
      onLoggedIn(user);
      onClose();
    } catch (e) {
      console.error(e);
      setErr(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />

      <form
        onSubmit={onSubmit}
        className="relative w-[440px] max-w-[94vw] overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex">
          <div className="hidden w-44 shrink-0 bg-gradient-to-br from-[#ffe1e6] via-[#ffd1d8] to-[#ffeaef] p-6 sm:block">
            <div className="text-2xl font-bold tracking-tight text-brand">
              {t.brandName}
            </div>
            <p className="mt-2 text-[13px] leading-snug text-foreground/70">
              {t.appTagline}
            </p>
            <div className="mt-10 text-[11px] leading-relaxed text-foreground/50">
              <p>{t.brandPanelLine1}</p>
              <p className="mt-1">{t.brandPanelLine2}</p>
            </div>
          </div>

          <div className="flex-1 px-6 py-7">
            <h2 className="text-[17px] font-semibold text-foreground">
              {t.loginTitle}
            </h2>
            <p className="mt-1 text-xs text-muted">{t.loginSubtitle}</p>

            <div className="mt-5 flex h-11 items-center rounded-lg border border-border bg-white px-3 focus-within:border-brand">
              <span className="text-sm text-foreground">+976</span>
              <span className="mx-2 h-4 w-px bg-border" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="flex-1 bg-transparent text-sm placeholder:text-muted focus:outline-none"
              />
            </div>

            <div className="mt-3 flex h-11 items-center rounded-lg border border-border bg-white px-3 focus-within:border-brand">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t.codePlaceholder}
                className="flex-1 bg-transparent text-sm placeholder:text-muted focus:outline-none"
              />
              <button
                type="button"
                className="text-xs font-medium text-brand hover:text-brand-hover"
                onClick={(e) => e.preventDefault()}
              >
                {t.getCode}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy || !phone.trim()}
              className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition hover:bg-brand-hover disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t.loginButton}
            </button>

            {err && (
              <p className="mt-2 text-xs text-brand">{err}</p>
            )}

            <label className="mt-4 flex items-start gap-2 text-[11px] leading-snug text-muted">
              <input type="checkbox" className="mt-0.5 accent-brand" defaultChecked />
              <span>
                {t.agreeText}
                <a className="mx-1 text-[#3a5897] hover:underline">
                  {t.userAgreement}
                </a>
                <span>·</span>
                <a className="mx-1 text-[#3a5897] hover:underline">
                  {t.privacyPolicy}
                </a>
              </span>
            </label>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted">
              <a className="hover:text-foreground">{t.loginWeChat}</a>
              <span>·</span>
              <a className="hover:text-foreground">{t.loginWeibo}</a>
              <span>·</span>
              <a className="hover:text-foreground">{t.loginQR}</a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
