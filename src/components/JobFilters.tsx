"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { jobCategories, locations } from "@/data/jobs";

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form
      className="grid gap-3 rounded border border-line bg-surface p-4 md:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        for (const key of ["q", "location", "category", "type"]) {
          const value = String(form.get(key) ?? "").trim();
          if (value) params.set(key, value);
        }
        router.push(`/jobs?${params.toString()}`);
      }}
    >
      <label className="md:col-span-2">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Search
        </span>
        <input
          className="field"
          name="q"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="Title, company, keyword…"
        />
      </label>
      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Location
        </span>
        <select
          className="field"
          name="location"
          defaultValue={searchParams.get("location") ?? ""}
          onChange={(event) => update("location", event.target.value)}
        >
          <option value="">All locations</option>
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
        <select
          className="field"
          name="category"
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(event) => update("category", event.target.value)}
        >
          <option value="">All categories</option>
          {jobCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end gap-2 md:col-span-4">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Type
          </span>
          <select
            className="field"
            name="type"
            defaultValue={searchParams.get("type") ?? ""}
            onChange={(event) => update("type", event.target.value)}
          >
            <option value="">Any type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="live-in">Live-in</option>
            <option value="contract">Contract</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary">
          Find jobs
        </button>
      </div>
    </form>
  );
}
