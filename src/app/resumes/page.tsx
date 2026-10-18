import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { resumes } from "@/data/listings";
import { formatPostedDate } from "@/lib/format";

export const metadata = {
  title: "Resumes / Job wanted",
  description: "Job seekers posting resumes on ArmJob.",
};

export default function ResumesPage() {
  return (
    <>
      <PageHero
        eyebrow="Job wanted"
        title="Resumes from the community"
        description="People looking for office, care, kitchen, and trade roles — bilingual candidates ready to work."
        action={
          <Link href="/jobs" className="btn btn-primary">
            Hire from jobs board
          </Link>
        }
      />
      <section className="site-shell py-10 md:py-14">
        {resumes.map((resume) => (
          <article key={resume.id} className="listing-row">
            <div>
              <p className="text-xs text-muted">{formatPostedDate(resume.postedAt)}</p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-tight">
                {resume.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {resume.name} · {resume.location}
              </p>
              <p className="mt-3 text-sm text-ink/80">{resume.experience}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {resume.languages.map((lang) => (
                  <span key={lang} className="rounded bg-accent-soft px-2 py-1 text-accent">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm font-semibold text-brand">Contact via ArmJob</p>
          </article>
        ))}
      </section>
    </>
  );
}
