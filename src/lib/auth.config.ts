import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const path = request.nextUrl.pathname;
      const isPostingPage =
        path === "/jobs/post" ||
        path.startsWith("/housing/post") ||
        path.startsWith("/cars/post") ||
        path.startsWith("/events/post") ||
        path.startsWith("/directory/post") ||
        path.startsWith("/resumes/post");
      if (isPostingPage) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
