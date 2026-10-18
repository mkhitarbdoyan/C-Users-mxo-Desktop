import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById, jobs } from "@/data/jobs";
import { formatJobType, formatPostedDate } from "@/lib/format";

type JobDetailProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: JobDetailProps) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return { title: "Job not found" };
  return {
    title: job.title,
    description: job.description.slice(0, 140),
  };
}

export default async function JobDetailPage({ params }: JobDetailProps) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) notFound();

  return (
    <article>
      <section className="border-b border-line bg-surface-soft">
        <div className="site-shell py-10 md:py-14">
          <Link href="/jobs" className="text-sm font-semibold text-brand">
            ← Back to jobs
          </Link>
          <p className="mt-6 text-sm text-muted">Posted {formatPostedDate(job.postedAt)}</p>
          <h1 className="mt-2 max-w-3xl font-[family-name:var(--font-display)] text-4xl tracking-tight text-ink md:text-5xl">
            {job.title}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {job.company} · {job.location}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded bg-accent-soft px-3 py-1.5 text-accent">
              {formatJobType(job.type)}
            </span>
            {job.salary ? (
              <span className="rounded bg-surface px-3 py-1.5 ring-1 ring-line">{job.salary}</span>
            ) : null}
            {job.languages.map((lang) => (
              <span key={lang} className="rounded bg-surface px-3 py-1.5 ring-1 ring-line">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell grid gap-10 py-12 md:grid-cols-[1.5fr_0.9fr] md:py-16">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            About the role
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/85">{job.description}</p>
          {job.descriptionHy ? (
            <p className="mt-4 border-l-2 border-brand/40 pl-4 text-base leading-relaxed text-muted">
              {job.descriptionHy}
            </p>
          ) : null}

          <h3 className="mt-10 font-[family-name:var(--font-display)] text-xl tracking-tight">
            Requirements
          </h3>
          <ul className="mt-4 space-y-2 text-base text-ink/85">
            {job.requirements.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded border border-line bg-surface p-6">
          <p className="section-label">Apply / contact</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-tight">
            Reach the employer
          </h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-muted">Company</dt>
              <dd className="mt-1 font-semibold">{job.company}</dd>
            </div>
            <div>
              <dt className="text-muted">Location</dt>
              <dd className="mt-1 font-semibold">{job.location}</dd>
            </div>
            {job.contactPhone ? (
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-1 font-semibold">
                  <a href={`tel:${job.contactPhone}`} className="text-brand hover:underline">
                    {job.contactPhone}
                  </a>
                </dd>
              </div>
            ) : null}
            {job.contactEmail ? (
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 font-semibold">
                  <a href={`mailto:${job.contactEmail}`} className="text-brand hover:underline">
                    {job.contactEmail}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
          <Link href="/jobs/post" className="btn btn-outline mt-8 w-full">
            Post a similar job
          </Link>
        </aside>
      </section>
    </article>
  );
}
