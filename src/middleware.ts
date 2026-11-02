import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/jobs/post",
    "/housing/post",
    "/cars/post",
    "/events/post",
    "/directory/post",
    "/resumes/post",
  ],
};
