import { db, schema } from "../db";
import { eq, asc, desc, and, sql } from "drizzle-orm";

export type Loc = { zh: string; mn: string };

export type ApiNoteImage = { seed: string; width: number; height: number };

export type ApiComment = {
  id: number;
  text: Loc;
  author: Loc;
  avatarSeed: string;
  likes: number;
  timeAgo: Loc;
  createdAt: string;
};

export type ApiNote = {
  id: string;
  title: Loc;
  description: Loc;
  category: string;
  cover: ApiNoteImage;
  images: ApiNoteImage[];
  author: {
    id: string;
    name: Loc;
    avatarSeed: string;
    followers: string;
  };
  likes: number;
  collects: number;
  commentsCount: number;
  postedAt: string;
  location?: Loc;
  tags: Loc[];
  comments: ApiComment[];
  liked?: boolean;
  followed?: boolean;
};

function timeAgo(iso: string): Loc {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (min < 1) return { zh: "刚刚", mn: "Дөнгөж сая" };
  if (hr < 1)
    return { zh: `${min}分钟前`, mn: `${min} минутын өмнө` };
  if (day < 1) return { zh: `${hr}小时前`, mn: `${hr} цагийн өмнө` };
  if (day < 30) return { zh: `${day}天前`, mn: `${day} өдрийн өмнө` };
  const months = Math.floor(day / 30);
  return { zh: `${months}个月前`, mn: `${months} сарын өмнө` };
}

type Filter = {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

export async function listNotes(filter: Filter = {}): Promise<{
  notes: Omit<ApiNote, "comments" | "images">[];
  total: number;
}> {
  const limit = Math.min(filter.limit ?? 60, 200);
  const offset = filter.offset ?? 0;

  const conds = [] as ReturnType<typeof eq>[];
  if (filter.category && filter.category !== "all") {
    conds.push(eq(schema.notes.category, filter.category));
  }

  let query = db
    .select({
      id: schema.notes.id,
      titleZh: schema.notes.titleZh,
      titleMn: schema.notes.titleMn,
      descriptionZh: schema.notes.descriptionZh,
      descriptionMn: schema.notes.descriptionMn,
      category: schema.notes.category,
      coverSeed: schema.notes.coverSeed,
      coverWidth: schema.notes.coverWidth,
      coverHeight: schema.notes.coverHeight,
      likesCount: schema.notes.likesCount,
      collectsCount: schema.notes.collectsCount,
      commentsCount: schema.notes.commentsCount,
      postedAt: schema.notes.postedAt,
      locationZh: schema.notes.locationZh,
      locationMn: schema.notes.locationMn,
      authorId: schema.users.id,
      authorZh: schema.users.displayNameZh,
      authorMn: schema.users.displayNameMn,
      authorSeed: schema.users.avatarSeed,
      authorFollowers: schema.users.followersText,
    })
    .from(schema.notes)
    .innerJoin(schema.users, eq(schema.users.id, schema.notes.authorId))
    .$dynamic();

  if (conds.length) query = query.where(and(...conds));
  query = query.orderBy(desc(schema.notes.postedAt), desc(schema.notes.id))
    .limit(limit)
    .offset(offset);

  let rows = await query;

  if (filter.q) {
    const q = filter.q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.titleZh.toLowerCase().includes(q) ||
        r.titleMn.toLowerCase().includes(q) ||
        r.authorZh.toLowerCase().includes(q) ||
        r.authorMn.toLowerCase().includes(q),
    );
  }

  const totalRow = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(schema.notes)
    .where(conds.length ? and(...conds) : undefined);
  const total = totalRow[0]?.c ?? 0;

  return {
    notes: rows.map((r) => ({
      id: r.id,
      title: { zh: r.titleZh, mn: r.titleMn },
      description: { zh: r.descriptionZh, mn: r.descriptionMn },
      category: r.category,
      cover: { seed: r.coverSeed, width: r.coverWidth, height: r.coverHeight },
      author: {
        id: r.authorId,
        name: { zh: r.authorZh, mn: r.authorMn },
        avatarSeed: r.authorSeed,
        followers: r.authorFollowers,
      },
      likes: r.likesCount,
      collects: r.collectsCount,
      commentsCount: r.commentsCount,
      postedAt: r.postedAt,
      location:
        r.locationZh && r.locationMn
          ? { zh: r.locationZh, mn: r.locationMn }
          : undefined,
      tags: [],
    })),
    total,
  };
}

export async function getNoteWithDetails(
  noteId: string,
  currentUserId: string | null,
): Promise<ApiNote | null> {
  const [row] = await db
    .select({
      id: schema.notes.id,
      titleZh: schema.notes.titleZh,
      titleMn: schema.notes.titleMn,
      descriptionZh: schema.notes.descriptionZh,
      descriptionMn: schema.notes.descriptionMn,
      category: schema.notes.category,
      coverSeed: schema.notes.coverSeed,
      coverWidth: schema.notes.coverWidth,
      coverHeight: schema.notes.coverHeight,
      likesCount: schema.notes.likesCount,
      collectsCount: schema.notes.collectsCount,
      commentsCount: schema.notes.commentsCount,
      postedAt: schema.notes.postedAt,
      locationZh: schema.notes.locationZh,
      locationMn: schema.notes.locationMn,
      authorId: schema.users.id,
      authorZh: schema.users.displayNameZh,
      authorMn: schema.users.displayNameMn,
      authorSeed: schema.users.avatarSeed,
      authorFollowers: schema.users.followersText,
    })
    .from(schema.notes)
    .innerJoin(schema.users, eq(schema.users.id, schema.notes.authorId))
    .where(eq(schema.notes.id, noteId))
    .limit(1);

  if (!row) return null;

  const images = await db
    .select()
    .from(schema.noteImages)
    .where(eq(schema.noteImages.noteId, noteId))
    .orderBy(asc(schema.noteImages.ord));

  const tags = await db
    .select()
    .from(schema.noteTags)
    .where(eq(schema.noteTags.noteId, noteId))
    .orderBy(asc(schema.noteTags.ord));

  const commentRows = await db
    .select({
      id: schema.comments.id,
      textZh: schema.comments.textZh,
      textMn: schema.comments.textMn,
      likes: schema.comments.likes,
      createdAt: schema.comments.createdAt,
      authorZh: schema.users.displayNameZh,
      authorMn: schema.users.displayNameMn,
      authorSeed: schema.users.avatarSeed,
    })
    .from(schema.comments)
    .innerJoin(schema.users, eq(schema.users.id, schema.comments.authorId))
    .where(eq(schema.comments.noteId, noteId))
    .orderBy(desc(schema.comments.createdAt))
    .limit(50);

  let liked = false;
  let followed = false;
  if (currentUserId) {
    const [likeRow] = await db
      .select()
      .from(schema.likes)
      .where(
        and(
          eq(schema.likes.userId, currentUserId),
          eq(schema.likes.noteId, noteId),
        ),
      )
      .limit(1);
    liked = !!likeRow;

    const [followRow] = await db
      .select()
      .from(schema.follows)
      .where(
        and(
          eq(schema.follows.followerId, currentUserId),
          eq(schema.follows.followeeId, row.authorId),
        ),
      )
      .limit(1);
    followed = !!followRow;
  }

  return {
    id: row.id,
    title: { zh: row.titleZh, mn: row.titleMn },
    description: { zh: row.descriptionZh, mn: row.descriptionMn },
    category: row.category,
    cover: { seed: row.coverSeed, width: row.coverWidth, height: row.coverHeight },
    images: images.map((i) => ({ seed: i.seed, width: i.width, height: i.height })),
    author: {
      id: row.authorId,
      name: { zh: row.authorZh, mn: row.authorMn },
      avatarSeed: row.authorSeed,
      followers: row.authorFollowers,
    },
    likes: row.likesCount,
    collects: row.collectsCount,
    commentsCount: row.commentsCount,
    postedAt: row.postedAt,
    location:
      row.locationZh && row.locationMn
        ? { zh: row.locationZh, mn: row.locationMn }
        : undefined,
    tags: tags.map((t) => ({ zh: t.zh, mn: t.mn })),
    comments: commentRows.map((c) => ({
      id: c.id,
      text: { zh: c.textZh, mn: c.textMn },
      author: { zh: c.authorZh, mn: c.authorMn },
      avatarSeed: c.authorSeed,
      likes: c.likes,
      timeAgo: timeAgo(c.createdAt.toISOString()),
      createdAt: c.createdAt.toISOString(),
    })),
    liked,
    followed,
  };
}
