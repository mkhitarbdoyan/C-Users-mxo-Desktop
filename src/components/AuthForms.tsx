"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid gap-4 rounded border border-line bg-surface p-5 md:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const result = await signIn("credentials", {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
          redirect: false,
        });
        setPending(false);
        if (result?.error) {
          setError("Invalid email or password.");
          return;
        }
        router.push(callbackUrl);
        router.refresh();
      }}
    >
      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Email
        </span>
        <input className="field" name="email" type="email" required placeholder="you@email.com" />
      </label>
      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Password
        </span>
        <input className="field" name="password" type="password" required minLength={8} />
      </label>
      {error ? <p className="text-sm text-brand">{error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-sm text-muted">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-brand">
          Create one
        </Link>
      </p>
      <p className="text-xs text-muted">
        Demo: demo@armjob.local / password123
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid gap-4 rounded border border-line bg-surface p-5 md:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const payload = {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        };
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          setPending(false);
          setError(data.error || "Unable to create account.");
          return;
        }
        const result = await signIn("credentials", {
          email: payload.email,
          password: payload.password,
          redirect: false,
        });
        setPending(false);
        if (result?.error) {
          router.push("/login");
          return;
        }
        router.push("/jobs/post");
        router.refresh();
      }}
    >
      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Name
        </span>
        <input className="field" name="name" required placeholder="Your name" />
      </label>
      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Email
        </span>
        <input className="field" name="email" type="email" required placeholder="you@email.com" />
      </label>
      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Password
        </span>
        <input className="field" name="password" type="password" required minLength={8} />
      </label>
      {error ? <p className="text-sm text-brand">{error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand">
          Sign in
        </Link>
      </p>
    </form>
  );
}
