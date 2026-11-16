import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { mapEvent } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ event: mapEvent(event) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;
  const { id } = await params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
