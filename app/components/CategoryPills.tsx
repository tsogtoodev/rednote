"use client";

import { CATEGORIES } from "../data/categories";
import { useLang } from "../lib/i18n";

type Props = {
  active: string;
  onSelect: (id: string) => void;
};

export function CategoryPills({ active, onSelect }: Props) {
  const { loc } = useLang();
  return (
    <div className="sticky top-16 z-30 -mx-1 bg-white/90 backdrop-blur-md">
      <div className="scrollbar-hidden flex gap-2 overflow-x-auto px-1 py-3">
        {CATEGORIES.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-foreground text-white"
                  : "bg-surface text-foreground hover:bg-black/10"
              }`}
            >
              {loc(c.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
