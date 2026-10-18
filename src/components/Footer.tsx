import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="site-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Arm<span className="text-[#ff6b7f]">Job</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Jobs, housing, cars, events, and local businesses for the Armenian
            community across Los Angeles — inspired by the everyday utility of
            ArmenianBD, rebuilt for clarity.
          </p>
        </div>
        <div>
          <p className="section-label !text-[#ff6b7f]">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/jobs" className="hover:text-white">
                Browse jobs
              </Link>
            </li>
            <li>
              <Link href="/resumes" className="hover:text-white">
                Job wanted / resumes
              </Link>
            </li>
            <li>
              <Link href="/housing" className="hover:text-white">
                Housing
              </Link>
            </li>
            <li>
              <Link href="/directory" className="hover:text-white">
                Business directory
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="section-label !text-[#ff6b7f]">Employers</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/jobs/post" className="hover:text-white">
                Post a listing
              </Link>
            </li>
            <li>
              <a href="mailto:hello@armjob.example" className="hover:text-white">
                hello@armjob.example
              </a>
            </li>
            <li>(818) 555-1200</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-shell flex flex-col gap-2 py-4 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} ArmJob. Built for the LA Armenian community.</p>
          <p>Demo product — sample listings only.</p>
        </div>
      </div>
    </footer>
  );
}
