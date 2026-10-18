import Image from "next/image";
import Link from "next/link";
import { JobList } from "@/components/JobList";
import { jobs } from "@/data/jobs";
import { businesses, events, housing } from "@/data/listings";
import { formatEventDate } from "@/lib/format";

const categories = [
  {
    href: "/jobs",
    title: "Jobs",
    copy: "Office, kitchen, care, trades, and driving roles across Glendale and the Valley.",
  },
  {
    href: "/housing",
    title: "Housing",
    copy: "Apartments, ADUs, and roommate listings near Armenian neighborhoods.",
  },
  {
    href: "/cars",
    title: "Cars",
    copy: "Cars for sale and rideshare rentals from local owners and shops.",
  },
  {
    href: "/directory",
    title: "Directory",
    copy: "Find plumbers, markets, insurers, and Armenian-owned businesses.",
  },
];

export default function Home() {
  const latestJobs = jobs.slice(0, 5);

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Los Angeles city lights at dusk"
            fill
            priority
            className="hero-media object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,146,42,0.18),transparent_35%)]" />
        </div>

        <div className="site-shell relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:pb-20">
          <p className="animate-fade text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
            Los Angeles · Armenian community
          </p>
          <h1 className="animate-rise mt-4 max-w-3xl font-[family-name:var(--font-display)] text-6xl leading-[0.95] tracking-tight md:text-8xl">
            Arm<span className="text-[#ff6b7f]">Job</span>
          </h1>
          <p className="animate-rise-delay mt-5 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
            Find work closer to home — jobs, housing, and local businesses for
            Armenian families across Los Angeles.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="/jobs" className="btn btn-primary">
              Browse jobs
            </Link>
            <Link href="/jobs/post" className="btn btn-secondary">
              Post a listing
            </Link>
          </div>
        </div>
      </section>

      <section className="site-shell py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="section-label">Where to start</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink md:text-4xl">
            One board for everyday LA needs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Modeled after the usefulness of ArmenianBD — jobs first, with the
            classifieds people actually check every week.
          </p>
        </div>
        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="group block">
              <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-ink group-hover:text-brand">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{category.copy}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="site-shell py-16 md:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label">Fresh listings</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink md:text-4xl">
                Latest jobs
              </h2>
            </div>
            <Link href="/jobs" className="btn btn-outline">
              View all jobs
            </Link>
          </div>
          <div className="mt-8">
            <JobList jobs={latestJobs} />
          </div>
        </div>
      </section>

      <section className="site-shell grid gap-12 py-16 md:grid-cols-2 md:py-20">
        <div>
          <p className="section-label">Housing</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Places near the community
          </h2>
          <ul className="mt-6 divide-y divide-line">
            {housing.slice(0, 3).map((home) => (
              <li key={home.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{home.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {home.location} · {home.beds} bd / {home.baths} ba
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-brand">{home.price}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/housing" className="mt-4 inline-block text-sm font-semibold text-brand">
            Browse housing →
          </Link>
        </div>

        <div>
          <p className="section-label">This month</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Community events
          </h2>
          <ul className="mt-6 divide-y divide-line">
            {events.map((event) => (
              <li key={event.id} className="py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {formatEventDate(event.date)}
                </p>
                <p className="mt-1 font-semibold text-ink">{event.title}</p>
                <p className="mt-1 text-sm text-muted">{event.location}</p>
              </li>
            ))}
          </ul>
          <Link href="/events" className="mt-4 inline-block text-sm font-semibold text-brand">
            See all events →
          </Link>
        </div>
      </section>

      <section className="border-t border-line bg-[linear-gradient(135deg,#1b3a6b_0%,#7a0c1f_100%)] text-white">
        <div className="site-shell flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              For employers
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
              Hire people who already speak your language
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/80">
              Reach bilingual candidates in Glendale, NoHo, Burbank, and across
              the Valley — the same audience that checks community boards daily.
            </p>
          </div>
          <Link href="/jobs/post" className="btn btn-primary bg-white !text-brand hover:!bg-white/90">
            Post a job free
          </Link>
        </div>
      </section>

      <section className="site-shell py-16 md:py-20">
        <p className="section-label">Directory spotlight</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Local businesses people call
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {businesses.slice(0, 4).map((business) => (
            <div key={business.id} className="border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {business.category}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-ink">
                {business.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{business.description}</p>
              <p className="mt-3 text-sm text-ink">
                {business.location} · {business.phone}
              </p>
            </div>
          ))}
        </div>
        <Link href="/directory" className="mt-8 inline-block text-sm font-semibold text-brand">
          Open directory →
        </Link>
      </section>
    </>
  );
}
