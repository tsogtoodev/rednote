import { cookies } from "next/headers";
import { eq, gt, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, schema } from "../db";

const COOKIE_NAME = "rn_session";
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type SessionUser = {
  id: string;
  displayName: { zh: string; mn: string };
  avatarSeed: string;
  followersText: string;
  isAuthor: boolean;
};

export async function createSession(userId: string): Promise<string> {
  const token = randomUUID() + randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + TTL_MS);

  await db.insert(schema.sessions).values({ token, userId, expiresAt });

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
  }
  jar.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [row] = await db
    .select({
      id: schema.users.id,
      displayNameZh: schema.users.displayNameZh,
      displayNameMn: schema.users.displayNameMn,
      avatarSeed: schema.users.avatarSeed,
      followersText: schema.users.followersText,
      isAuthor: schema.users.isAuthor,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(
      and(
        eq(schema.sessions.token, token),
        gt(schema.sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    displayName: { zh: row.displayNameZh, mn: row.displayNameMn },
    avatarSeed: row.avatarSeed,
    followersText: row.followersText,
    isAuthor: row.isAuthor === 1,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return user;
}
