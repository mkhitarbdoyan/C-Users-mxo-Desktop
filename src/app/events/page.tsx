import { PageHero } from "@/components/PageHero";
import { events } from "@/data/listings";
import { formatEventDate } from "@/lib/format";

export const metadata = {
  title: "Events",
  description: "Community events for Armenians in Los Angeles.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="What’s happening locally"
        description="Cultural nights, networking breakfasts, and career workshops — community gatherings across Los Angeles."
      />
      <section className="site-shell py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="border-t border-line pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {formatEventDate(event.date)}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-tight">
                {event.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{event.location}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">{event.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
