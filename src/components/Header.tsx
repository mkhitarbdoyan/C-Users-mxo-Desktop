"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/resumes", label: "Resumes" },
  { href: "/housing", label: "Housing" },
  { href: "/cars", label: "Cars" },
  { href: "/directory", label: "Directory" },
  { href: "/events", label: "Events" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[rgba(238,242,245,0.88)] backdrop-blur-md">
      <div className="site-shell flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink">
            Arm<span className="text-brand">Job</span>
          </span>
          <span className="hidden text-xs font-medium tracking-wide text-muted sm:inline">
            LA Armenian community
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-brand" : "text-ink/80 hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/jobs/post" className="btn btn-primary hidden sm:inline-flex !min-h-10 !px-4 text-sm">
            Post a job
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-line bg-surface lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-1">
              <span className={`h-0.5 bg-ink transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-ink transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="site-shell flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-2 py-2.5 text-sm font-medium text-ink hover:bg-accent-soft"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/jobs/post"
              className="btn btn-primary mt-2 text-sm"
              onClick={() => setOpen(false)}
            >
              Post a job
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
