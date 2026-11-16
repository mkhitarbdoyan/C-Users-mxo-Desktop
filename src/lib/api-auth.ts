import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      user: null,
      error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  return { user: session.user, error: null };
}
