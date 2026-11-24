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

import RegisterPage from "./page";

vi.mock(
  "../../../features/auth/components/registration-form",
  () => ({
    RegistrationForm: () => (
      <div data-testid="registration-form">
        Registration form
      </div>
    ),
  }),
);

describe("RegisterPage", () => {
  it("renders the premium registration experience", () => {
    render(
      <RegisterPage />,
    );

    expect(
      screen.getByRole(
        "heading",
        {
          level: 1,
          name:
            /discover moments worth remembering/i,
        },
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "heading",
        {
          level: 2,
          name:
            "Create your account",
        },
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "registration-form",
      ),
    ).toBeInTheDocument();
  });

  it("provides working navigation destinations", () => {
    render(
      <RegisterPage />,
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
          name: "Explore events",
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
            "Sign in from the EventHub registration page",
        },
      ),
    ).toHaveAttribute(
      "href",
      "/sign-in",
    );
  });

  it("explains the core EventHub benefits", () => {
    render(
      <RegisterPage />,
    );

    expect(
      screen.getByRole(
        "heading",
        {
          name: "Discover",
        },
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "heading",
        {
          name: "Book",
        },
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "heading",
        {
          name: "Experience",
        },
      ),
    ).toBeInTheDocument();
  });
});
