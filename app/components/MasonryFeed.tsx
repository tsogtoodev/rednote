"use client";

import type { NoteListItem } from "@/lib/types";
import { useLang } from "../lib/i18n";
import { NoteCard } from "./NoteCard";

type Props = {
  notes: NoteListItem[];
  onOpen: (id: string) => void;
  loading?: boolean;
};

export function MasonryFeed({ notes, onOpen, loading }: Props) {
  const { t } = useLang();

  if (loading && notes.length === 0) {
    return (
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="mb-3 break-inside-avoid">
            <div
              className="w-full animate-pulse rounded-2xl bg-black/5"
              style={{ paddingTop: `${[120, 130, 100, 140, 110][i % 5]}%` }}
            />
            <div className="mt-2.5 h-3 w-3/4 animate-pulse rounded bg-black/5" />
            <div className="mt-2 h-2.5 w-1/3 animate-pulse rounded bg-black/5" />
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-3">🥲</div>
        <p className="text-base text-foreground">{t.emptyTitle}</p>
        <p className="mt-1 text-sm text-muted">{t.emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5">
      {notes.map((n) => (
        <div key={n.id} className="mb-3">
          <NoteCard note={n} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
