"use client";

import {
  useActionState,
  useState,
} from "react";

import {
  registerAction,
} from "../actions/register.action";

import type {
  RegistrationActionResult,
} from "../actions/register.action";

type RegistrationFormState =
  RegistrationActionResult | null;

const INITIAL_STATE:
  RegistrationFormState = null;

function getFieldErrorId(
  field: string,
): string {
  return `${field}-error`;
}

type FieldErrorsProps = {
  id: string;
  messages: string[];
};

function FieldErrors({
  id,
  messages,
}: FieldErrorsProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <ul
      id={id}
      className="mt-2 space-y-1 text-sm font-medium text-red-600"
    >
      {messages.map((message) => (
        <li
          key={message}
          className="flex items-start gap-2"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 text-red-500"
          >
            •
          </span>

          <span>{message}</span>
        </li>
      ))}
    </ul>
  );
}

export function RegistrationForm() {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  const [
    result,
    formAction,
    isPending,
  ] = useActionState<
    RegistrationFormState,
    FormData
  >(
    async (
      _previousState,
      formData,
    ) => registerAction(formData),

    INITIAL_STATE,
  );

  const fieldErrors =
    result && !result.ok
      ? result.error.fieldErrors
      : undefined;

  const getFieldErrors = (
    field: string,
  ): string[] =>
    fieldErrors?.[field] ?? [];

  const nameErrors =
    getFieldErrors("name");

  const emailErrors =
    getFieldErrors("email");

  const passwordErrors =
    getFieldErrors("password");

  const confirmationErrors =
    getFieldErrors(
      "confirmPassword",
    );

  if (result?.ok) {
    return (
      <section
        aria-live="polite"
        className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
      >
        <div className="p-6 text-center">
          <div
            aria-hidden="true"
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-200"
          >
            ✓
          </div>

          <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">
            Account created successfully
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Welcome,{" "}
            <span className="font-semibold text-slate-900">
              {result.data.name}
            </span>
            . Your EventHub account is
            ready for its first experience.
          </p>

          <a
            href="/sign-in"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Continue to sign in
          </a>
        </div>
      </section>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5"
      noValidate
    >
      {result && !result.ok ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 font-bold text-red-700"
            >
              !
            </span>

            <div>
              <p className="font-bold">
                {result.error.message}
              </p>

              {result.error.correlationId ? (
                <p className="mt-2 text-xs text-red-700">
                  Reference:{" "}
                  {
                    result.error
                      .correlationId
                  }
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-bold text-slate-800"
        >
          Full name
        </label>

        <div className="relative mt-2">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
          >
            ●
          </span>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your full name"
            aria-invalid={
              nameErrors.length > 0
            }
            aria-describedby={
              nameErrors.length > 0
                ? getFieldErrorId(
                    "name",
                  )
                : undefined
            }
            className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <FieldErrors
          id={getFieldErrorId(
            "name",
          )}
          messages={nameErrors}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-slate-800"
        >
          Email address
        </label>

        <div className="relative mt-2">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base text-slate-400"
          >
            @
          </span>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={191}
            placeholder="you@example.com"
            aria-invalid={
              emailErrors.length > 0
            }
            aria-describedby={
              emailErrors.length > 0
                ? getFieldErrorId(
                    "email",
                  )
                : undefined
            }
            className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <FieldErrors
          id={getFieldErrorId(
            "email",
          )}
          messages={emailErrors}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-bold text-slate-800"
        >
          Password
        </label>

        <div className="relative mt-2">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
          >
            ◆
          </span>

          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
            placeholder="Create a strong password"
            aria-invalid={
              passwordErrors.length > 0
            }
            aria-describedby={
              passwordErrors.length > 0
                ? "password-help password-error"
                : "password-help"
            }
            className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-16 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            aria-pressed={
              showPassword
            }
            onClick={() => {
              setShowPassword(
                (current) =>
                  !current,
              );
            }}
            className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>

        <div
          id="password-help"
          className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500"
        >
          <span
            aria-hidden="true"
            className="font-bold text-emerald-600"
          >
            ✓
          </span>

          Use between 12 and 128
          characters. A memorable phrase
          works well.
        </div>

        <FieldErrors
          id={getFieldErrorId(
            "password",
          )}
          messages={passwordErrors}
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-bold text-slate-800"
        >
          Confirm password
        </label>

        <div className="relative mt-2">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
          >
            ◆
          </span>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type={
              showConfirmation
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            required
            maxLength={128}
            placeholder="Repeat your password"
            aria-invalid={
              confirmationErrors.length >
              0
            }
            aria-describedby={
              confirmationErrors.length >
              0
                ? getFieldErrorId(
                    "confirmPassword",
                  )
                : undefined
            }
            className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-16 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            aria-label={
              showConfirmation
                ? "Hide password confirmation"
                : "Show password confirmation"
            }
            aria-pressed={
              showConfirmation
            }
            onClick={() => {
              setShowConfirmation(
                (current) =>
                  !current,
              );
            }}
            className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          >
            {showConfirmation
              ? "Hide"
              : "Show"}
          </button>
        </div>

        <FieldErrors
          id={getFieldErrorId(
            "confirmPassword",
          )}
          messages={
            confirmationErrors
          }
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 via-blue-700 to-violet-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
      >
        <span className="relative">
          {isPending
            ? "Creating your account..."
            : "Create my EventHub account"}
        </span>
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Your password is secured using
        modern one-way password hashing.
      </p>
    </form>
  );
}
