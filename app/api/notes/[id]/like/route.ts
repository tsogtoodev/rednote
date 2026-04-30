import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/session";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  let user;
  try {
    user = await requireUser();
  } catch (res) {
    return res as Response;
  }

  const { id: noteId } = await ctx.params;

  const [exists] = await db
    .select({ noteId: schema.notes.id })
    .from(schema.notes)
    .where(eq(schema.notes.id, noteId))
    .limit(1);
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [existingLike] = await db
    .select()
    .from(schema.likes)
    .where(
      and(eq(schema.likes.userId, user.id), eq(schema.likes.noteId, noteId)),
    )
    .limit(1);

  let liked: boolean;
  if (existingLike) {
    await db
      .delete(schema.likes)
      .where(
        and(eq(schema.likes.userId, user.id), eq(schema.likes.noteId, noteId)),
      );
    await db
      .update(schema.notes)
      .set({ likesCount: sql`GREATEST(${schema.notes.likesCount} - 1, 0)` })
      .where(eq(schema.notes.id, noteId));
    liked = false;
  } else {
    await db.insert(schema.likes).values({ userId: user.id, noteId });
    await db
      .update(schema.notes)
      .set({ likesCount: sql`${schema.notes.likesCount} + 1` })
      .where(eq(schema.notes.id, noteId));
    liked = true;
  }

  const [counts] = await db
    .select({ likes: schema.notes.likesCount })
    .from(schema.notes)
    .where(eq(schema.notes.id, noteId));

  return NextResponse.json({ liked, likes: counts.likes });
}
