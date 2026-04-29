"use client";

import { useMemo, useState } from "react";
import { TopNav } from "./components/TopNav";
import { Sidebar } from "./components/Sidebar";
import { CategoryPills } from "./components/CategoryPills";
import { MasonryFeed } from "./components/MasonryFeed";
import { NoteDetailModal } from "./components/NoteDetailModal";
import { LoginModal } from "./components/LoginModal";
import { NOTES, getNoteById } from "./data/notes";

export default function Home() {
  const [activeNav, setActiveNav] = useState("discover");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = NOTES;
    if (activeCategory !== "all") {
      list = list.filter((n) => n.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.author.name.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeCategory, query]);

  const openNote = openNoteId ? getNoteById(openNoteId) ?? null : null;

  return (
    <>
      <TopNav
        query={query}
        onQueryChange={setQuery}
        onLoginClick={() => setLoginOpen(true)}
      />

      <div className="mx-auto flex max-w-[1480px]">
        <Sidebar active={activeNav} onSelect={setActiveNav} />

        <main className="min-w-0 flex-1 px-4 pb-20 sm:px-6">
          <CategoryPills
            active={activeCategory}
            onSelect={setActiveCategory}
          />
          <MasonryFeed notes={filtered} onOpen={setOpenNoteId} />
        </main>
      </div>

      <NoteDetailModal note={openNote} onClose={() => setOpenNoteId(null)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
