import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { listCars } from "@/lib/listings";
import { mapCar } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cars = await listCars();
  return NextResponse.json({ cars });
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
    const year = Number(body.year ?? 0);

    if (!title || !location || !price || !description || !year) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const car = await prisma.car.create({
      data: {
        title,
        location,
        price,
        year,
        mileage: body.mileage ? String(body.mileage) : null,
        description,
        authorId: user.id,
      },
    });

    return NextResponse.json({ car: mapCar(car) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create car listing." }, { status: 500 });
  }
}
