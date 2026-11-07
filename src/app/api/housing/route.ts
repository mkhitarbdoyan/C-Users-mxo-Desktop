import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { listHousing } from "@/lib/listings";
import { mapHousing } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const housing = await listHousing();
  return NextResponse.json({ housing });
}

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const location = String(body.location ?? "").trim();
    const price = String(body.price ?? "").trim();
    const description = String(body.description ?? "").trim();
    const beds = Number(body.beds ?? 0);
    const baths = Number(body.baths ?? 0);

    if (!title || !location || !price || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const home = await prisma.housing.create({
      data: {
        title,
        titleHy: body.titleHy ? String(body.titleHy) : null,
        location,
        price,
        beds,
        baths,
        description,
        authorId: user.id,
      },
    });

    return NextResponse.json({ housing: mapHousing(home) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create housing listing." }, { status: 500 });
  }
}
