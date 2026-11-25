import "server-only";

import {
  createHash,
  randomBytes,
} from "node:crypto";

export const SESSION_COOKIE_NAME =
  "eventhub_session";

export const SESSION_DURATION_SECONDS =
  7 * 24 * 60 * 60;

export const SESSION_DURATION_MILLISECONDS =
  SESSION_DURATION_SECONDS * 1000;

export function createSessionToken():
  string {
  return randomBytes(32)
    .toString("base64url");
}

export function hashSessionToken(
  sessionToken: string,
): string {
  return createHash("sha256")
    .update(sessionToken)
    .digest("hex");
}

export function createSessionExpiry(
  currentTime: number =
    Date.now(),
): Date {
  return new Date(
    currentTime +
      SESSION_DURATION_MILLISECONDS,
  );
}
