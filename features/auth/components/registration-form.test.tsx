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
  RegistrationForm,
} from "./registration-form";

vi.mock(
  "../actions/register.action",
  () => ({
    registerAction: vi.fn(),
  }),
);

describe(
  "RegistrationForm",
  () => {
    it(
      "renders the required accessible fields",
      () => {
        render(
          <RegistrationForm />,
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name: "Full name",
            },
          ),
        ).toBeRequired();

        expect(
          screen.getByRole(
            "textbox",
            {
              name: "Email address",
            },
          ),
        ).toBeRequired();

        expect(
          screen.getByLabelText(
            "Password",
          ),
        ).toBeRequired();

        expect(
          screen.getByLabelText(
            "Confirm password",
          ),
        ).toBeRequired();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Create my EventHub account",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "uses secure password input defaults",
      () => {
        render(
          <RegistrationForm />,
        );

        const password =
          screen.getByLabelText(
            "Password",
          );

        const confirmation =
          screen.getByLabelText(
            "Confirm password",
          );

        expect(password).toHaveAttribute(
          "type",
          "password",
        );

        expect(
          confirmation,
        ).toHaveAttribute(
          "type",
          "password",
        );

        expect(password).toHaveAttribute(
          "autocomplete",
          "new-password",
        );

        expect(
          confirmation,
        ).toHaveAttribute(
          "autocomplete",
          "new-password",
        );
      },
    );

    it(
      "allows the password visibility to be toggled",
      async () => {
        const user =
          userEvent.setup();

        render(
          <RegistrationForm />,
        );

        const password =
          screen.getByLabelText(
            "Password",
          );

        const toggle =
          screen.getByRole(
            "button",
            {
              name:
                "Show password",
            },
          );

        await user.click(toggle);

        expect(password).toHaveAttribute(
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
      "allows password-confirmation visibility to be toggled independently",
      async () => {
        const user =
          userEvent.setup();

        render(
          <RegistrationForm />,
        );

        const confirmation =
          screen.getByLabelText(
            "Confirm password",
          );

        const toggle =
          screen.getByRole(
            "button",
            {
              name:
                "Show password confirmation",
            },
          );

        await user.click(toggle);

        expect(
          confirmation,
        ).toHaveAttribute(
          "type",
          "text",
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
      "does not render role or account-status controls",
      () => {
        render(
          <RegistrationForm />,
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
          screen.queryByRole(
            "combobox",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "shows clear password guidance",
      () => {
        render(
          <RegistrationForm />,
        );

        expect(
          screen.getByText(
            /use between 12 and 128 characters/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /modern one-way password hashing/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
