import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { listEvents } from "@/lib/listings";
import { mapEvent } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await listEvents();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const location = String(body.location ?? "").trim();
    const date = String(body.date ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!title || !location || !date || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        titleHy: body.titleHy ? String(body.titleHy) : null,
        location,
        date,
        description,
        authorId: user.id,
      },
    });

    return NextResponse.json({ event: mapEvent(event) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create event." }, { status: 500 });
  }
}
