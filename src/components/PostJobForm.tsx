"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jobCategories, locations } from "@/lib/listings";

export function PostJobForm() {
  const router = useRouter();
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (submittedId) {
    return (
      <div className="rounded border border-line bg-surface px-6 py-12 text-center">
        <p className="section-label">Listing published</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink">
          Your job is live on ArmJob
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          The listing was saved to the database and linked to your account.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/jobs/${submittedId}`} className="btn btn-primary">
            View listing
          </Link>
          <Link href="/jobs" className="btn btn-outline">
            Browse jobs
          </Link>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setSubmittedId(null);
              setError("");
            }}
          >
            Post another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 rounded border border-line bg-surface p-5 md:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const payload = {
          title: String(form.get("title") ?? ""),
          company: String(form.get("company") ?? ""),
          location: String(form.get("location") ?? ""),
          category: String(form.get("category") ?? ""),
          type: String(form.get("type") ?? ""),
          salary: String(form.get("salary") ?? ""),
          phone: String(form.get("phone") ?? ""),
          description: String(form.get("description") ?? ""),
        };

        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        setPending(false);

        if (response.status === 401) {
          router.push("/login?callbackUrl=/jobs/post");
          return;
        }
        if (!response.ok) {
          setError(data.error || "Unable to publish job.");
          return;
        }

        setSubmittedId(data.job.id);
        router.refresh();
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Job title
          </span>
          <input className="field" name="title" required placeholder="e.g. Intake Coordinator" />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Company
          </span>
          <input className="field" name="company" required placeholder="Business name" />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Location
          </span>
          <select className="field" name="location" required defaultValue="">
            <option value="" disabled>
              Select location
            </option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Category
          </span>
          <select className="field" name="category" required defaultValue="office">
            {jobCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Job type
          </span>
          <select className="field" name="type" required defaultValue="full-time">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="live-in">Live-in</option>
            <option value="contract">Contract</option>
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Pay (optional)
          </span>
          <input className="field" name="salary" placeholder="$20/hr or DOE" />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Phone
          </span>
          <input className="field" name="phone" placeholder="(818) 555-0000" />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Description
          </span>
          <textarea
            className="field min-h-36"
            name="description"
            required
            placeholder="Describe the role, schedule, languages, and how to apply…"
          />
        </label>
      </div>
      {error ? <p className="text-sm text-brand">{error}</p> : null}
      <button
        type="submit"
        className="btn btn-primary w-full md:w-auto md:justify-self-start"
        disabled={pending}
      >
        {pending ? "Publishing…" : "Publish listing"}
      </button>
    </form>
  );
}
