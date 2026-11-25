import {
  PrismaAdapter,
} from "@auth/prisma-adapter";

import NextAuth from "next-auth";

import {
  prisma,
} from "./server/db/prisma";

const authSecret =
  process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error(
    "AUTH_SECRET is required.",
  );
}

export const {
  auth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(
    prisma,
  ),

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/sign-in",
  },

  providers: [],

  secret: authSecret,
});
