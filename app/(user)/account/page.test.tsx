import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  requireActiveUser,
} from "../../../server/auth/require-active-user";

import AccountPage from "./page";

vi.mock(
  "../../../server/auth/require-active-user",
  () => ({
    requireActiveUser:
      vi.fn(),
  }),
);

vi.mock(
  "../../../features/auth/components/sign-out-button",
  () => ({
    SignOutButton: () => (
      <button type="button">
        Sign out
      </button>
    ),
  }),
);

vi.mock(
  "next/navigation",
  () => ({
    redirect:
      vi.fn(),
  }),
);

const requireActiveUserMock =
  vi.mocked(
    requireActiveUser,
  );

describe(
  "AccountPage",
  () => {
    it(
      "renders the authenticated user",
      async () => {
        requireActiveUserMock
          .mockResolvedValue({
            userId: "user-123",
            name: "Test User",
            email:
              "test@example.com",
            role: "USER",
            status: "ACTIVE",

            expires:
              new Date(
                "2026-12-02T00:00:00.000Z",
              ),
          });

        render(
          await AccountPage(),
        );

        expect(
          screen.getByRole(
            "heading",
            {
              level: 1,
              name:
                /welcome back, test user/i,
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "test@example.com",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "USER",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "ACTIVE",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Sign out",
            },
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
