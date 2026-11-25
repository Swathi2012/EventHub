import "server-only";

import {
  getSessionCookie,
} from "./session-cookie";

import {
  readSession,
} from "./read-session";

import type {
  SessionUser,
} from "./read-session";

export async function currentUser():
  Promise<SessionUser | null> {
  const sessionToken =
    await getSessionCookie();

  if (!sessionToken) {
    return null;
  }

  return readSession(
    sessionToken,
  );
}
