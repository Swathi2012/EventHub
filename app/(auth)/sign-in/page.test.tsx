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

import SignInPage from "./page";

vi.mock(
  "../../../features/auth/components/sign-in-form",
  () => ({
    SignInForm: () => (
      <div data-testid="sign-in-form">
        Sign-in form
      </div>
    ),
  }),
);

describe(
  "SignInPage",
  () => {
    it(
      "renders the premium sign-in experience",
      () => {
        render(
          <SignInPage />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              level: 1,

              name:
                "Step back into experiences worth remembering.",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              level: 2,
              name: "Sign in",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "sign-in-form",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "links to home, events, and registration",
      () => {
        render(
          <SignInPage />,
        );

        expect(
          screen.getByRole(
            "link",
            {
              name:
                "Go to the EventHub home page",
            },
          ),
        ).toHaveAttribute(
          "href",
          "/",
        );

        expect(
          screen.getByRole(
            "link",
            {
              name:
                "Explore events",
            },
          ),
        ).toHaveAttribute(
          "href",
          "/events",
        );

        expect(
          screen.getByRole(
            "link",
            {
              name:
                "Create an account",
            },
          ),
        ).toHaveAttribute(
          "href",
          "/register",
        );
      },
    );

    it(
      "explains the sign-in benefits",
      () => {
        render(
          <SignInPage />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Discover",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Manage",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Return",
            },
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
