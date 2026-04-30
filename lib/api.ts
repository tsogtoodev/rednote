import type {
  ApiComment,
  Note,
  NoteListItem,
  SessionUser,
} from "./types";

async function jsonFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export function listNotes(params: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}): Promise<{ notes: NoteListItem[]; total: number }> {
  const sp = new URLSearchParams();
  if (params.category && params.category !== "all")
    sp.set("category", params.category);
  if (params.q) sp.set("q", params.q);
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.offset) sp.set("offset", String(params.offset));
  return jsonFetch(`/api/notes?${sp.toString()}`, { signal: params.signal });
}

export function getNote(id: string, signal?: AbortSignal): Promise<Note> {
  return jsonFetch(`/api/notes/${id}`, { signal });
}

export async function toggleLike(
  id: string,
): Promise<{ liked: boolean; likes: number }> {
  return jsonFetch(`/api/notes/${id}/like`, { method: "POST" });
}

export async function postComment(
  id: string,
  text: string,
): Promise<ApiComment> {
  return jsonFetch(`/api/notes/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function toggleFollow(
  authorId: string,
): Promise<{ followed: boolean }> {
  return jsonFetch(`/api/follows/${authorId}`, { method: "POST" });
}

export async function login(
  phone: string,
): Promise<{ user: SessionUser }> {
  return jsonFetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function logout(): Promise<{ ok: true }> {
  return jsonFetch(`/api/auth/logout`, { method: "POST" });
}

export async function fetchMe(): Promise<{ user: SessionUser | null }> {
  return jsonFetch(`/api/auth/me`);
}
