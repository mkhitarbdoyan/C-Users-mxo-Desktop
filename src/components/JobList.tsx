import Link from "next/link";
import type { Job } from "@/lib/types";
import { formatJobType, formatPostedDate } from "@/lib/format";

export function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded border border-dashed border-line bg-surface px-6 py-12 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl text-ink">
          No jobs match these filters
        </p>
        <p className="mt-2 text-sm text-muted">
          Try a broader search or clear a location/category filter.
        </p>
      </div>
    );
  }

  return (
    <div>
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`} className="listing-row group">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {job.featured ? (
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold">
                  Featured
                </span>
              ) : null}
              <span className="text-xs text-muted">{formatPostedDate(job.postedAt)}</span>
            </div>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl tracking-tight text-ink group-hover:text-brand">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {job.company} · {job.location}
            </p>
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink/80">
              {job.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
              <span className="rounded bg-accent-soft px-2 py-1 text-accent">
                {formatJobType(job.type)}
              </span>
              {job.salary ? (
                <span className="rounded bg-surface px-2 py-1 ring-1 ring-line">{job.salary}</span>
              ) : null}
              {job.languages.slice(0, 2).map((lang) => (
                <span key={lang} className="rounded bg-surface px-2 py-1 ring-1 ring-line">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div className="text-sm font-semibold text-brand md:pt-6">View role →</div>
        </Link>
      ))}
    </div>
  );
}
