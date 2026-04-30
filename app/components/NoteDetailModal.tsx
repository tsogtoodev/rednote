"use client";

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Star,
  X,
  Smile,
  MapPin,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Note, ApiComment, SessionUser } from "@/lib/types";
import { useLang } from "../lib/i18n";
import { avatarUrl, formatCount, imgUrl } from "../lib/img";
import { postComment, toggleFollow, toggleLike } from "@/lib/api";

type Props = {
  note: Note | null;
  loading?: boolean;
  user: SessionUser | null;
  onClose: () => void;
  onRequireLogin: () => void;
  onNoteUpdated: (n: Note) => void;
};

export function NoteDetailModal({
  note,
  loading,
  user,
  onClose,
  onRequireLogin,
  onNoteUpdated,
}: Props) {
  const { t, loc } = useLang();
  const [imgIdx, setImgIdx] = useState(0);
  const [collected, setCollected] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setImgIdx(0);
    setCollected(false);
    setDraft("");
  }, [note?.id]);

  useEffect(() => {
    if (!note && !loading) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (note) {
        if (e.key === "ArrowLeft") setImgIdx((i) => Math.max(0, i - 1));
        if (e.key === "ArrowRight")
          setImgIdx((i) => Math.min((note.images.length || 1) - 1, i + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [note, loading, onClose]);

  if (!note && !loading) return null;

  const img = note ? note.images[imgIdx] ?? note.cover : null;
  const hasMultipleImages = (note?.images.length ?? 0) > 1;

  const requireAuth = (fn: () => void) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    fn();
  };

  const onLike = () => {
    if (!note) return;
    requireAuth(async () => {
      try {
        const res = await toggleLike(note.id);
        onNoteUpdated({ ...note, liked: res.liked, likes: res.likes });
      } catch (e) {
        console.error(e);
      }
    });
  };

  const onFollow = () => {
    if (!note) return;
    requireAuth(async () => {
      try {
        const res = await toggleFollow(note.author.id);
        onNoteUpdated({ ...note, followed: res.followed });
      } catch (e) {
        console.error(e);
      }
    });
  };

  const onSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    const text = draft.trim();
    if (!text) return;
    requireAuth(async () => {
      setPosting(true);
      try {
        const c = await postComment(note.id, text);
        onNoteUpdated({
          ...note,
          comments: [c, ...note.comments],
          commentsCount: note.commentsCount + 1,
        });
        setDraft("");
      } catch (err) {
        console.error(err);
      } finally {
        setPosting(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      <button
        onClick={onClose}
        aria-label={t.close}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative mx-auto flex h-full max-h-[92vh] w-[min(1100px,94vw)] translate-y-[4vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in">
        {!note || !img ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : (
          <>
            <div className="relative hidden flex-1 items-center justify-center bg-black md:flex">
              <img
                src={imgUrl(img.seed, img.width, img.height)}
                alt={loc(note.title)}
                className="max-h-full max-w-full object-contain"
              />

              {hasMultipleImages && (
                <>
                  {imgIdx > 0 && (
                    <button
                      onClick={() => setImgIdx((i) => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-foreground shadow transition hover:bg-white"
                      aria-label={t.prev}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  {imgIdx < note.images.length - 1 && (
                    <button
                      onClick={() => setImgIdx((i) => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-foreground shadow transition hover:bg-white"
                      aria-label={t.next}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {note.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        aria-label={t.imageNth(i + 1)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === imgIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex w-full flex-col md:w-[400px] md:shrink-0 md:border-l md:border-border">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <a href="#" className="flex items-center gap-3">
                  <img
                    src={avatarUrl(note.author.avatarSeed, 80)}
                    alt={loc(note.author.name)}
                    className="h-10 w-10 rounded-full bg-surface object-cover"
                  />
                  <div className="leading-tight">
                    <div className="text-sm font-medium text-foreground">
                      {loc(note.author.name)}
                    </div>
                    <div className="text-xs text-muted">
                      {t.followers} {note.author.followers}
                    </div>
                  </div>
                </a>
                <button
                  onClick={onFollow}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    note.followed
                      ? "bg-surface text-muted-foreground"
                      : "bg-brand text-white hover:bg-brand-hover"
                  }`}
                >
                  {note.followed ? t.followed : t.follow}
                </button>
              </div>

              <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
                <h1 className="text-lg font-semibold leading-snug text-foreground">
                  {loc(note.title)}
                </h1>
                <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-foreground/85">
                  {loc(note.description)}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {note.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-md text-[13px] text-[#3a5897] hover:underline"
                    >
                      #{loc(tag)}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                  {note.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {loc(note.location)}
                    </span>
                  )}
                  <span>{note.postedAt}</span>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <div className="mb-3 text-sm text-muted">
                    {t.totalComments(formatCount(note.commentsCount))}
                  </div>
                  <ul className="flex flex-col gap-4">
                    {note.comments.map((c: ApiComment) => (
                      <li key={c.id} className="flex gap-3">
                        <img
                          src={avatarUrl(c.avatarSeed, 56)}
                          alt={loc(c.author)}
                          className="h-7 w-7 shrink-0 rounded-full bg-surface object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted">
                            {loc(c.author)}
                          </div>
                          <p className="mt-0.5 text-[14px] leading-snug text-foreground">
                            {loc(c.text)}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                            <span>{loc(c.timeAgo)}</span>
                            <button className="hover:text-foreground">
                              {t.reply}
                            </button>
                          </div>
                        </div>
                        <button className="flex flex-col items-center gap-0.5 pt-0.5 text-muted hover:text-foreground">
                          <Heart className="h-3.5 w-3.5" />
                          <span className="text-[11px] tabular-nums">
                            {c.likes}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <form
                onSubmit={onSubmitComment}
                className="flex items-center gap-2 border-t border-border bg-white px-4 py-3"
              >
                <div className="flex flex-1 items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm">
                  <Smile className="h-4 w-4 text-muted shrink-0" />
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={t.commentPlaceholder}
                    className="flex-1 bg-transparent placeholder:text-muted focus:outline-none"
                  />
                  {draft.trim() && (
                    <button
                      type="submit"
                      disabled={posting}
                      className="rounded-full bg-brand px-3 py-0.5 text-xs font-medium text-white disabled:opacity-50"
                    >
                      {t.publish}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onLike}
                  className="flex flex-col items-center text-xs text-muted-foreground"
                >
                  <Heart
                    className={`h-6 w-6 ${note.liked ? "fill-brand stroke-brand" : ""}`}
                  />
                  <span className="tabular-nums">{formatCount(note.likes)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCollected((v) => !v)}
                  className="flex flex-col items-center text-xs text-muted-foreground"
                >
                  <Star
                    className={`h-6 w-6 ${
                      collected ? "fill-yellow-400 stroke-yellow-400" : ""
                    }`}
                  />
                  <span className="tabular-nums">
                    {formatCount(note.collects)}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center text-xs text-muted-foreground"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="tabular-nums">
                    {formatCount(note.commentsCount)}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="share"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
