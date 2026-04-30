import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { createSession } from "@/lib/session";

const Body = z.object({
  phone: z.string().trim().min(4).max(32),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  const { phone } = parsed.data;

  let [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.phone, phone))
    .limit(1);

  if (!user) {
    const suffix = phone.replace(/\D/g, "").slice(-4) || phone.slice(-4);
    [user] = await db
      .insert(schema.users)
      .values({
        phone,
        displayNameZh: `用户${suffix}`,
        displayNameMn: `Хэрэглэгч ${suffix}`,
        avatarSeed: `phone-${phone}`,
        followersText: "0",
        isAuthor: 0,
      })
      .returning();
  }

  await createSession(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: { zh: user.displayNameZh, mn: user.displayNameMn },
      avatarSeed: user.avatarSeed,
      followersText: user.followersText,
      isAuthor: user.isAuthor === 1,
    },
  });
}
