import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHero({ eyebrow, title, description, action }: PageHeroProps) {
  return (
    <section className="border-b border-line bg-[linear-gradient(180deg,#f7f9fb_0%,rgba(238,242,245,0)_100%)]">
      <div className="site-shell py-12 md:py-16">
        <p className="section-label animate-rise">{eyebrow}</p>
        <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl animate-rise-delay">
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-ink md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted md:text-lg">{description}</p>
          </div>
          {action ? <div className="animate-rise-delay-2 shrink-0">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
