import { PageHero } from "@/components/PageHero";
import { RegisterForm } from "@/components/AuthForms";

export const metadata = {
  title: "Create account",
  description: "Create an ArmJob account to post listings.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Create your ArmJob account"
        description="Employers and community members can sign up to publish jobs, housing, and directory listings."
      />
      <section className="site-shell max-w-xl py-10 md:py-14">
        <RegisterForm />
      </section>
    </>
  );
}
