import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { listBusinesses } from "@/lib/listings";
import { mapBusiness } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const businesses = await listBusinesses();
  return NextResponse.json({ businesses });
}

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const category = String(body.category ?? "").trim();
    const location = String(body.location ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const hours = String(body.hours ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!name || !category || !location || !phone || !hours || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const business = await prisma.business.create({
      data: {
        name,
        nameHy: body.nameHy ? String(body.nameHy) : null,
        category,
        location,
        phone,
        hours,
        description,
        authorId: user.id,
      },
    });

    return NextResponse.json({ business: mapBusiness(business) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create business." }, { status: 500 });
  }
}
