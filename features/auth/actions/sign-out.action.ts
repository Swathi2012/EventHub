"use server";

import {
  redirect,
} from "next/navigation";

import {
  revokeCurrentSession,
} from "../../../server/auth/revoke-current-session";

export async function signOutAction():
  Promise<never> {
  await revokeCurrentSession();

  redirect("/");
}
