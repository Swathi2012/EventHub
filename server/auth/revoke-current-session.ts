import "server-only";

import {
  clearSessionCookie,
  getSessionCookie,
} from "./session-cookie";

import {
  deleteSession,
} from "./delete-session";

export async function revokeCurrentSession():
  Promise<void> {
  const sessionToken =
    await getSessionCookie();

  try {
    if (sessionToken) {
      await deleteSession(
        sessionToken,
      );
    }
  } finally {
    await clearSessionCookie();
  }
}
