"use client";

import { useState } from "react";
import Link from "next/link";
import { jobCategories, locations } from "@/data/jobs";

export function PostJobForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded border border-line bg-surface px-6 py-12 text-center">
        <p className="section-label">Listing received</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-ink">
          Your job is ready for review
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          In this demo, listings are not saved to a database. In production,
          ArmJob would publish after a quick moderation check.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/jobs" className="btn btn-primary">
            Browse jobs
          </Link>
          <button type="button" className="btn btn-outline" onClick={() => setSubmitted(false)}>
            Post another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 rounded border border-line bg-surface p-5 md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
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
      <button type="submit" className="btn btn-primary w-full md:w-auto md:justify-self-start">
        Publish listing
      </button>
    </form>
  );
}
