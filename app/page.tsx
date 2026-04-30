"use client";

import { useEffect, useRef, useState } from "react";
import { TopNav } from "./components/TopNav";
import { Sidebar } from "./components/Sidebar";
import { CategoryPills } from "./components/CategoryPills";
import { MasonryFeed } from "./components/MasonryFeed";
import { NoteDetailModal } from "./components/NoteDetailModal";
import { LoginModal } from "./components/LoginModal";
import {
  fetchMe,
  getNote,
  listNotes,
  logout as logoutApi,
} from "@/lib/api";
import type { Note, NoteListItem, SessionUser } from "@/lib/types";

export default function Home() {
  const [activeNav, setActiveNav] = useState("discover");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [openNote, setOpenNote] = useState<Note | null>(null);
  const [openLoading, setOpenLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const lastFeedReq = useRef(0);

  // Bootstrap session
  useEffect(() => {
    fetchMe()
      .then(({ user }) => setUser(user))
      .catch(() => {});
  }, []);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(id);
  }, [query]);

  // Load feed
  useEffect(() => {
    const reqId = ++lastFeedReq.current;
    setFeedLoading(true);
    const ctrl = new AbortController();
    listNotes({
      category: activeCategory,
      q: debouncedQuery || undefined,
      signal: ctrl.signal,
    })
      .then((data) => {
        if (reqId !== lastFeedReq.current) return;
        setNotes(data.notes);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => {
        if (reqId === lastFeedReq.current) setFeedLoading(false);
      });
    return () => ctrl.abort();
  }, [activeCategory, debouncedQuery]);

  // Load detail
  useEffect(() => {
    if (!openId) {
      setOpenNote(null);
      return;
    }
    setOpenLoading(true);
    getNote(openId)
      .then((n) => setOpenNote(n))
      .catch((err) => {
        console.error(err);
        setOpenId(null);
      })
      .finally(() => setOpenLoading(false));
  }, [openId]);

  const onLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  return (
    <>
      <TopNav
        query={query}
        onQueryChange={setQuery}
        onLoginClick={() => setLoginOpen(true)}
        user={user}
        onLogout={onLogout}
      />

      <div className="mx-auto flex max-w-[1480px]">
        <Sidebar active={activeNav} onSelect={setActiveNav} />

        <main className="min-w-0 flex-1 px-4 pb-20 sm:px-6">
          <CategoryPills
            active={activeCategory}
            onSelect={setActiveCategory}
          />
          <MasonryFeed
            notes={notes}
            onOpen={setOpenId}
            loading={feedLoading}
          />
        </main>
      </div>

      <NoteDetailModal
        note={openNote}
        loading={openLoading}
        user={user}
        onClose={() => setOpenId(null)}
        onRequireLogin={() => setLoginOpen(true)}
        onNoteUpdated={(n) => setOpenNote(n)}
      />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoggedIn={(u) => setUser(u)}
      />
    </>
  );
}
