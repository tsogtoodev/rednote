"use client";

import type { Note } from "../data/notes";
import { useLang } from "../lib/i18n";
import { NoteCard } from "./NoteCard";

type Props = {
  notes: Note[];
  onOpen: (id: string) => void;
};

export function MasonryFeed({ notes, onOpen }: Props) {
  const { t } = useLang();

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
