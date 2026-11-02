import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { formatPostedDate } from "@/lib/format";
import { listHousing } from "@/lib/listings";

export const metadata = {
  title: "Housing",
  description: "Apartments, ADUs, and rentals for the LA Armenian community.",
};

export const dynamic = "force-dynamic";

export default async function HousingPage() {
  const housing = await listHousing();

  return (
    <>
      <PageHero
        eyebrow="Housing"
        title="Apartments & rentals"
        description="Find places near Glendale, NoHo, and the Valley — ADUs, apartments, and roommate-friendly units from community listings."
        action={
          <Link href="/login?callbackUrl=/jobs/post" className="btn btn-outline">
            Sign in to post
          </Link>
        }
      />
      <section className="site-shell py-10 md:py-14">
        <div>
          {housing.map((home) => (
            <article key={home.id} className="listing-row">
              <div>
                <p className="text-xs text-muted">{formatPostedDate(home.postedAt)}</p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-tight text-ink">
                  {home.title}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {home.location} · {home.beds} bd / {home.baths} ba
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80">
                  {home.description}
                </p>
              </div>
              <p className="font-[family-name:var(--font-display)] text-2xl text-brand">
                {home.price}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
