import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { mapJob } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ job: mapJob(job) });
}

export async function PUT(request: Request, { params }: Params) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  const { id } = await params;
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (existing.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const job = await prisma.job.update({
    where: { id },
    data: {
      title: body.title ? String(body.title) : undefined,
      company: body.company ? String(body.company) : undefined,
      location: body.location ? String(body.location) : undefined,
      type: body.type ? String(body.type) : undefined,
      category: body.category ? String(body.category) : undefined,
      description: body.description ? String(body.description) : undefined,
      salary: body.salary !== undefined ? String(body.salary || "") || null : undefined,
      contactPhone:
        body.contactPhone !== undefined || body.phone !== undefined
          ? String(body.contactPhone || body.phone || "") || null
          : undefined,
      contactEmail:
        body.contactEmail !== undefined ? String(body.contactEmail || "") || null : undefined,
    },
  });

  return NextResponse.json({ job: mapJob(job) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  const { id } = await params;
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (existing.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
