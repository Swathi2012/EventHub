import "server-only";

import {
  cookies,
} from "next/headers";

import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "./session-token";

export async function setSessionCookie(
  sessionToken: string,
  expires: Date,
): Promise<void> {
  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    sessionToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      expires,
      maxAge:
        SESSION_DURATION_SECONDS,
      priority: "high",
    },
  );
}

export async function getSessionCookie():
  Promise<string | null> {
  const cookieStore =
    await cookies();

  return (
    cookieStore.get(
      SESSION_COOKIE_NAME,
    )?.value ?? null
  );
}

export async function clearSessionCookie():
  Promise<void> {
  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
      priority: "high",
    },
  );
}
