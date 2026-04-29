"use client";

import { Compass, Heart, MapPin, Tag, type LucideIcon } from "lucide-react";
import { SIDEBAR_TOPICS } from "../data/categories";
import { useLang } from "../lib/i18n";

type Item = { id: string; key: "navDiscover" | "navFollow" | "navNearby"; icon: LucideIcon };

const PRIMARY: Item[] = [
  { id: "discover", key: "navDiscover", icon: Compass },
  { id: "follow", key: "navFollow", icon: Heart },
  { id: "nearby", key: "navNearby", icon: MapPin },
];

type Props = {
  active: string;
  onSelect: (id: string) => void;
};

export function Sidebar({ active, onSelect }: Props) {
  const { t, loc } = useLang();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-white pt-4 lg:block">
      <nav className="flex flex-col gap-1 px-3">
        {PRIMARY.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition ${
                isActive
                  ? "bg-surface text-brand"
                  : "text-foreground hover:bg-surface"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
              {t[item.key]}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 px-3">
        <div className="mb-2 flex items-center gap-1.5 px-3 text-xs font-medium text-muted">
          <Tag className="h-3.5 w-3.5" />
          {t.hotTopics}
        </div>
        <ul className="flex flex-col">
          {SIDEBAR_TOPICS.map((topic) => (
            <li key={topic.zh}>
              <a
                href="#"
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-surface hover:text-foreground"
              >
                # {loc(topic)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 px-6 pb-8 text-[11px] leading-relaxed text-muted">
        <p>
          {t.about} · {t.userAgreement} · {t.privacyPolicy}
        </p>
        <p>
          {t.complaint} · {t.helpCenter}
        </p>
        <p className="mt-2">{t.copyright}</p>
      </div>
    </aside>
  );
}
