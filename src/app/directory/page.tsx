import { PageHero } from "@/components/PageHero";
import { businesses } from "@/data/listings";

export const metadata = {
  title: "Business directory",
  description: "Armenian business directory for Los Angeles on ArmJob.",
};

export default function DirectoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Directory"
        title="Local businesses"
        description="Construction, insurance, plumbing, markets, and more — phone numbers, hours, and short descriptions in one place."
      />
      <section className="site-shell py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2">
          {businesses.map((business) => (
            <article key={business.id} className="border-t border-line pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {business.category}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-tight">
                {business.name}
              </h2>
              {business.nameHy ? (
                <p className="mt-1 text-sm text-muted">{business.nameHy}</p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{business.description}</p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted">Location</dt>
                  <dd className="font-medium">{business.location}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Phone</dt>
                  <dd className="font-medium">
                    <a href={`tel:${business.phone}`} className="text-brand hover:underline">
                      {business.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Hours</dt>
                  <dd className="font-medium">{business.hours}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
