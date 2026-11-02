import { PageHero } from "@/components/PageHero";
import { PostJobForm } from "@/components/PostJobForm";

export const metadata = {
  title: "Post a job",
  description: "Post a job listing to ArmJob for the LA Armenian community.",
};

export default function PostJobPage() {
  return (
    <>
      <PageHero
        eyebrow="Employers"
        title="Post a job on ArmJob"
        description="Share the role, location, languages, and how candidates should apply. Listings are reviewed before going live in production."
      />
      <section className="site-shell py-10 md:py-14">
        <PostJobForm />
      </section>
    </>
  );
}
