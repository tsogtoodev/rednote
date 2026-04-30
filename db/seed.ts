import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { NOTES } from "../app/data/notes";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const pool = new Pool({
    connectionString: url,
    ssl: /sslmode=require|neon\.tech|amazonaws\.com/i.test(url)
      ? { rejectUnauthorized: false }
      : undefined,
  });
  const db = drizzle(pool, { schema });

  console.log("Truncating tables...");
  await db.execute(
    sql`TRUNCATE sessions, follows, likes, comments, note_tags, note_images, notes, users RESTART IDENTITY CASCADE`,
  );

  console.log("Inserting authors...");
  const authorByAvatarSeed = new Map<string, string>();

  for (const note of NOTES) {
    if (authorByAvatarSeed.has(note.author.avatarSeed)) continue;
    const [row] = await db
      .insert(schema.users)
      .values({
        displayNameZh: note.author.name.zh,
        displayNameMn: note.author.name.mn,
        avatarSeed: note.author.avatarSeed,
        followersText: note.author.followers,
        isAuthor: 1,
      })
      .returning({ id: schema.users.id });
    authorByAvatarSeed.set(note.author.avatarSeed, row.id);
  }

  console.log("Inserting commenter users...");
  for (const note of NOTES) {
    for (const c of note.comments) {
      if (authorByAvatarSeed.has(c.avatarSeed)) continue;
      const [row] = await db
        .insert(schema.users)
        .values({
          displayNameZh: c.author.zh,
          displayNameMn: c.author.mn,
          avatarSeed: c.avatarSeed,
          followersText: "",
          isAuthor: 0,
        })
        .returning({ id: schema.users.id });
      authorByAvatarSeed.set(c.avatarSeed, row.id);
    }
  }

  console.log(`Inserting ${NOTES.length} notes...`);
  for (const note of NOTES) {
    const authorId = authorByAvatarSeed.get(note.author.avatarSeed);
    if (!authorId) throw new Error(`No author for ${note.id}`);

    await db.insert(schema.notes).values({
      id: note.id,
      titleZh: note.title.zh,
      titleMn: note.title.mn,
      descriptionZh: note.description.zh,
      descriptionMn: note.description.mn,
      category: note.category,
      coverSeed: note.cover.seed,
      coverWidth: note.cover.width,
      coverHeight: note.cover.height,
      authorId,
      likesCount: note.likes,
      collectsCount: note.collects,
      commentsCount: note.commentsCount,
      postedAt: note.postedAt,
      locationZh: note.location?.zh ?? null,
      locationMn: note.location?.mn ?? null,
    });

    if (note.images.length) {
      await db.insert(schema.noteImages).values(
        note.images.map((img, i) => ({
          noteId: note.id,
          seed: img.seed,
          width: img.width,
          height: img.height,
          ord: i,
        })),
      );
    }

    if (note.tags.length) {
      await db.insert(schema.noteTags).values(
        note.tags.map((t, i) => ({
          noteId: note.id,
          zh: t.zh,
          mn: t.mn,
          ord: i,
        })),
      );
    }

    if (note.comments.length) {
      await db.insert(schema.comments).values(
        note.comments.map((c) => ({
          noteId: note.id,
          authorId: authorByAvatarSeed.get(c.avatarSeed)!,
          textZh: c.text.zh,
          textMn: c.text.mn,
          likes: c.likes,
        })),
      );
    }
  }

  const counts = await db.execute<{ users: number; notes: number; comments: number }>(
    sql`SELECT
      (SELECT COUNT(*) FROM users)::int AS users,
      (SELECT COUNT(*) FROM notes)::int AS notes,
      (SELECT COUNT(*) FROM comments)::int AS comments`,
  );
  console.log("Seed complete:", counts.rows[0]);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
