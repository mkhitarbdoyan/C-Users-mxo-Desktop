import { Suspense } from "react";
import Link from "next/link";
import { JobFilters } from "@/components/JobFilters";
import { JobList } from "@/components/JobList";
import { PageHero } from "@/components/PageHero";
import { filterJobs } from "@/data/jobs";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
    type?: string;
  }>;
};

export const metadata = {
  title: "Jobs",
  description: "Browse Armenian community jobs across Los Angeles on ArmJob.",
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const results = filterJobs(params);

  return (
    <>
      <PageHero
        eyebrow="Jobs"
        title="Find work in the community"
        description="Daily-updated roles from Armenian-owned businesses and bilingual workplaces across Glendale, the Valley, and greater LA."
        action={
          <Link href="/jobs/post" className="btn btn-primary">
            Post a job
          </Link>
        }
      />
      <section className="site-shell py-10 md:py-14">
        <Suspense fallback={<div className="h-40 rounded border border-line bg-surface" />}>
          <JobFilters />
        </Suspense>
        <p className="mt-6 text-sm text-muted">
          Showing <span className="font-semibold text-ink">{results.length}</span> listings
        </p>
        <div className="mt-2">
          <JobList jobs={results} />
        </div>
      </section>
    </>
  );
}
