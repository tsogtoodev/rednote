"use client";

import { Heart } from "lucide-react";
import type { NoteListItem } from "@/lib/types";
import { avatarUrl, formatCount, imgUrl } from "../lib/img";
import { useLang } from "../lib/i18n";
import { useState } from "react";

type Props = {
  note: NoteListItem;
  onOpen: (id: string) => void;
};

export function NoteCard({ note, onOpen }: Props) {
  const { loc } = useLang();
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const aspect = note.cover.height / note.cover.width;
  const paddingTop = `${aspect * 100}%`;
  const title = loc(note.title);
  const authorName = loc(note.author.name);

  return (
    <article className="group break-inside-avoid">
      <button
        onClick={() => onOpen(note.id)}
        className="block w-full overflow-hidden rounded-2xl bg-surface text-left"
      >
        <div className="relative w-full" style={{ paddingTop }}>
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-black/5" />
          )}
          <img
            src={imgUrl(note.cover.seed, note.cover.width, note.cover.height)}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </button>

      <div className="px-1 pt-2.5 pb-4">
        <h3
          className="cursor-pointer text-[15px] leading-snug text-foreground line-clamp-2"
          onClick={() => onOpen(note.id)}
        >
          {title}
        </h3>

        <div className="mt-2 flex items-center justify-between text-xs">
          <a href="#" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
            <img
              src={avatarUrl(note.author.avatarSeed, 40)}
              alt={authorName}
              className="h-5 w-5 rounded-full bg-surface object-cover"
              loading="lazy"
            />
            <span className="truncate max-w-[110px]">{authorName}</span>
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Heart
              className={`h-4 w-4 transition ${liked ? "fill-brand stroke-brand" : ""}`}
            />
            <span className="tabular-nums">
              {formatCount(note.likes + (liked ? 1 : 0))}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
