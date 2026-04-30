import {
  pgTable,
  text,
  integer,
  timestamp,
  date,
  primaryKey,
  uuid,
  serial,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phone: text("phone").unique(),
    displayNameZh: text("display_name_zh").notNull(),
    displayNameMn: text("display_name_mn").notNull(),
    avatarSeed: text("avatar_seed").notNull(),
    followersText: text("followers_text").notNull().default(""),
    isAuthor: integer("is_author").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("users_phone_idx").on(t.phone)],
);

export const notes = pgTable(
  "notes",
  {
    id: text("id").primaryKey(),
    titleZh: text("title_zh").notNull(),
    titleMn: text("title_mn").notNull(),
    descriptionZh: text("description_zh").notNull(),
    descriptionMn: text("description_mn").notNull(),
    category: text("category").notNull(),
    coverSeed: text("cover_seed").notNull(),
    coverWidth: integer("cover_width").notNull(),
    coverHeight: integer("cover_height").notNull(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    likesCount: integer("likes_count").notNull().default(0),
    collectsCount: integer("collects_count").notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    postedAt: date("posted_at").notNull(),
    locationZh: text("location_zh"),
    locationMn: text("location_mn"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("notes_category_idx").on(t.category),
    index("notes_author_idx").on(t.authorId),
    index("notes_posted_at_idx").on(t.postedAt),
  ],
);

export const noteImages = pgTable(
  "note_images",
  {
    id: serial("id").primaryKey(),
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    seed: text("seed").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    ord: integer("ord").notNull().default(0),
  },
  (t) => [index("note_images_note_idx").on(t.noteId)],
);

export const noteTags = pgTable(
  "note_tags",
  {
    id: serial("id").primaryKey(),
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    zh: text("zh").notNull(),
    mn: text("mn").notNull(),
    ord: integer("ord").notNull().default(0),
  },
  (t) => [index("note_tags_note_idx").on(t.noteId)],
);

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    textZh: text("text_zh").notNull(),
    textMn: text("text_mn").notNull(),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("comments_note_idx").on(t.noteId)],
);

export const likes = pgTable(
  "likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.noteId] }),
    index("likes_note_idx").on(t.noteId),
  ],
);

export const follows = pgTable(
  "follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followeeId: uuid("followee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followeeId] }),
    index("follows_followee_idx").on(t.followeeId),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    token: text("token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);
