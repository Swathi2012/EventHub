import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  SignInForm,
} from "./sign-in-form";

vi.mock(
  "../actions/sign-in.action",
  () => ({
    signInAction: vi.fn(),
  }),
);

describe(
  "SignInForm",
  () => {
    it(
      "renders accessible credential fields",
      () => {
        render(
          <SignInForm />,
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                "Email address",
            },
          ),
        ).toBeRequired();

        expect(
          screen.getByLabelText(
            "Password",
          ),
        ).toBeRequired();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Sign in to EventHub",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "uses the correct autocomplete values",
      () => {
        render(
          <SignInForm />,
        );

        expect(
          screen.getByLabelText(
            "Email address",
          ),
        ).toHaveAttribute(
          "autocomplete",
          "email",
        );

        expect(
          screen.getByLabelText(
            "Password",
          ),
        ).toHaveAttribute(
          "autocomplete",
          "current-password",
        );
      },
    );

    it(
      "uses a password input by default",
      () => {
        render(
          <SignInForm />,
        );

        expect(
          screen.getByLabelText(
            "Password",
          ),
        ).toHaveAttribute(
          "type",
          "password",
        );
      },
    );

    it(
      "toggles password visibility",
      async () => {
        const user =
          userEvent.setup();

        render(
          <SignInForm />,
        );

        const password =
          screen.getByLabelText(
            "Password",
          );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Show password",
            },
          ),
        );

        expect(
          password,
        ).toHaveAttribute(
          "type",
          "text",
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Hide password",
            },
          ),
        ).toHaveAttribute(
          "aria-pressed",
          "true",
        );
      },
    );

    it(
      "does not expose privileged or session controls",
      () => {
        render(
          <SignInForm />,
        );

        expect(
          screen.queryByLabelText(
            /role/i,
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByLabelText(
            /status/i,
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByLabelText(
            /session token/i,
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "shows the session-security message",
      () => {
        render(
          <SignInForm />,
        );

        expect(
          screen.getByText(
            /secure database session/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /never stored in plain text/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
