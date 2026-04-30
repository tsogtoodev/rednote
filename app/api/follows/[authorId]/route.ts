import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/session";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ authorId: string }> },
) {
  let user;
  try {
    user = await requireUser();
  } catch (res) {
    return res as Response;
  }

  const { authorId } = await ctx.params;
  if (authorId === user.id) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 },
    );
  }

  const [exists] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.id, authorId))
    .limit(1);
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [existingFollow] = await db
    .select()
    .from(schema.follows)
    .where(
      and(
        eq(schema.follows.followerId, user.id),
        eq(schema.follows.followeeId, authorId),
      ),
    )
    .limit(1);

  let followed: boolean;
  if (existingFollow) {
    await db
      .delete(schema.follows)
      .where(
        and(
          eq(schema.follows.followerId, user.id),
          eq(schema.follows.followeeId, authorId),
        ),
      );
    followed = false;
  } else {
    await db
      .insert(schema.follows)
      .values({ followerId: user.id, followeeId: authorId });
    followed = true;
  }

  return NextResponse.json({ followed });
}
