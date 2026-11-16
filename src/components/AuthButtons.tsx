"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthButtons() {
  const { data, status } = useSession();

  if (status === "loading") {
    return <span className="hidden text-sm text-muted sm:inline">…</span>;
  }

  if (!data?.user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link href="/login" className="text-sm font-medium text-ink/80 hover:text-brand">
          Sign in
        </Link>
        <Link href="/register" className="btn btn-outline !min-h-10 !px-3 text-sm">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="max-w-[10rem] truncate text-sm text-muted">{data.user.name}</span>
      <button
        type="button"
        className="btn btn-outline !min-h-10 !px-3 text-sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign out
      </button>
    </div>
  );
}
