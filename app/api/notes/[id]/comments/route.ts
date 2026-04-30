import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/session";

const Body = z.object({
  text: z.string().trim().min(1).max(2000),
});

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  let user;
  try {
    user = await requireUser();
  } catch (res) {
    return res as Response;
  }

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id: noteId } = await ctx.params;
  const [exists] = await db
    .select({ id: schema.notes.id })
    .from(schema.notes)
    .where(eq(schema.notes.id, noteId))
    .limit(1);
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [row] = await db
    .insert(schema.comments)
    .values({
      noteId,
      authorId: user.id,
      textZh: parsed.data.text,
      textMn: parsed.data.text,
    })
    .returning({
      id: schema.comments.id,
      createdAt: schema.comments.createdAt,
      textZh: schema.comments.textZh,
      textMn: schema.comments.textMn,
      likes: schema.comments.likes,
    });

  await db
    .update(schema.notes)
    .set({ commentsCount: sql`${schema.notes.commentsCount} + 1` })
    .where(eq(schema.notes.id, noteId));

  return NextResponse.json({
    id: row.id,
    text: { zh: row.textZh, mn: row.textMn },
    author: user.displayName,
    avatarSeed: user.avatarSeed,
    likes: row.likes,
    timeAgo: { zh: "刚刚", mn: "Дөнгөж сая" },
    createdAt: row.createdAt.toISOString(),
  });
}
