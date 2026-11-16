import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { listJobs } from "@/lib/listings";
import { mapJob } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobs = await listJobs({
    q: searchParams.get("q") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  });
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const company = String(body.company ?? "").trim();
    const location = String(body.location ?? "").trim();
    const type = String(body.type ?? "full-time");
    const category = String(body.category ?? "other");
    const description = String(body.description ?? "").trim();

    if (!title || !company || !location || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const requirements = Array.isArray(body.requirements)
      ? body.requirements.map(String)
      : String(body.requirements ?? "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter(Boolean);

    const languages = Array.isArray(body.languages)
      ? body.languages.map(String)
      : String(body.languages ?? "Armenian, English")
          .split(",")
          .map((line: string) => line.trim())
          .filter(Boolean);

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        category,
        description,
        titleHy: body.titleHy ? String(body.titleHy) : null,
        descriptionHy: body.descriptionHy ? String(body.descriptionHy) : null,
        requirements: JSON.stringify(requirements.length ? requirements : ["See description"]),
        languages: JSON.stringify(languages.length ? languages : ["Armenian", "English"]),
        salary: body.salary ? String(body.salary) : null,
        contactPhone: body.contactPhone || body.phone ? String(body.contactPhone || body.phone) : null,
        contactEmail: body.contactEmail ? String(body.contactEmail) : user.email ?? null,
        featured: Boolean(body.featured),
        authorId: user.id,
      },
    });

    return NextResponse.json({ job: mapJob(job) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create job." }, { status: 500 });
  }
}
