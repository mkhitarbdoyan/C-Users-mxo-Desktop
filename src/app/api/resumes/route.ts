import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { listResumes } from "@/lib/listings";
import { mapResume } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const resumes = await listResumes();
  return NextResponse.json({ resumes });
}

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const body = await request.json();
    const name = String(body.name ?? user.name ?? "").trim();
    const title = String(body.title ?? "").trim();
    const location = String(body.location ?? "").trim();
    const experience = String(body.experience ?? "").trim();
    if (!name || !title || !location || !experience) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const languages = Array.isArray(body.languages)
      ? body.languages.map(String)
      : String(body.languages ?? "Armenian, English")
          .split(",")
          .map((line: string) => line.trim())
          .filter(Boolean);

    const resume = await prisma.resume.create({
      data: {
        name,
        title,
        titleHy: body.titleHy ? String(body.titleHy) : null,
        location,
        experience,
        languages: JSON.stringify(languages),
        authorId: user.id,
      },
    });

    return NextResponse.json({ resume: mapResume(resume) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create resume." }, { status: 500 });
  }
}
