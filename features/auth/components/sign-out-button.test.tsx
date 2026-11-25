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
  SignOutButton,
} from "./sign-out-button";

vi.mock(
  "../actions/sign-out.action",
  () => ({
    signOutAction:
      vi.fn(),
  }),
);

describe(
  "SignOutButton",
  () => {
    it(
      "renders an accessible sign-out button",
      () => {
        render(
          <SignOutButton />,
        );

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

    it(
      "submits through a form",
      () => {
        render(
          <SignOutButton />,
        );

        const button =
          screen.getByRole(
            "button",
            {
              name:
                "Sign out",
            },
          );

        expect(button).toHaveAttribute(
          "type",
          "submit",
        );

        expect(
          button.closest("form"),
        ).not.toBeNull();
      },
    );
  },
);
