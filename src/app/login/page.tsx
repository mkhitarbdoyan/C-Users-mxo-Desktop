import { PageHero } from "@/components/PageHero";
import { LoginForm } from "@/components/AuthForms";

export const metadata = {
  title: "Sign in",
  description: "Sign in to ArmJob to post listings.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Sign in to ArmJob"
        description="Post jobs and other listings once you’re signed in. Demo accounts are available for local testing."
      />
      <section className="site-shell max-w-xl py-10 md:py-14">
        <LoginForm callbackUrl={params.callbackUrl || "/jobs/post"} />
      </section>
    </>
  );
}
