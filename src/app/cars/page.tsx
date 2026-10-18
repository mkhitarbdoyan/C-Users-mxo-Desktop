import { PageHero } from "@/components/PageHero";
import { cars } from "@/data/listings";
import { formatPostedDate } from "@/lib/format";

export const metadata = {
  title: "Cars",
  description: "Cars for sale and rideshare rentals on ArmJob.",
};

export default function CarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Cars"
        title="Cars for sale & rent"
        description="Local vehicles, dealer inventory, and Uber/Lyft rentals shared across the Armenian community board."
      />
      <section className="site-shell py-10 md:py-14">
        {cars.map((car) => (
          <article key={car.id} className="listing-row">
            <div>
              <p className="text-xs text-muted">{formatPostedDate(car.postedAt)}</p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-tight">
                {car.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {car.location}
                {car.mileage ? ` · ${car.mileage}` : ""} · {car.year}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80">
                {car.description}
              </p>
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl text-brand">
              {car.price}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
