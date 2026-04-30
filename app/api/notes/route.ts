import { NextResponse } from "next/server";
import { listNotes } from "@/lib/note-shape";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q")?.trim() || undefined;
  const limit = Number(searchParams.get("limit")) || undefined;
  const offset = Number(searchParams.get("offset")) || undefined;

  const data = await listNotes({ category, q, limit, offset });
  return NextResponse.json(data);
}
