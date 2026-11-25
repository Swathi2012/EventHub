"use client";

import {
  useActionState,
  useState,
} from "react";

import {
  signInAction,
} from "../actions/sign-in.action";

import type {
  SignInActionResult,
} from "../actions/sign-in.action";

type SignInFormState =
  SignInActionResult | null;

const INITIAL_STATE:
  SignInFormState = null;

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
      {messages.map(
        (message) => (
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

            <span>
              {message}
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

export function SignInForm() {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    result,
    formAction,
    isPending,
  ] = useActionState<
    SignInFormState,
    FormData
  >(
    async (
      _previousState,
      formData,
    ) =>
      signInAction(
        formData,
      ),

    INITIAL_STATE,
  );

  const fieldErrors =
    result && !result.ok
      ? result.error.fieldErrors
      : undefined;

  const emailErrors =
    fieldErrors?.email ?? [];

  const passwordErrors =
    fieldErrors?.password ?? [];

  if (result?.ok) {
    return (
      <section
        aria-live="polite"
        className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
      >
        <div className="p-6 text-center">
          <div
            aria-hidden="true"
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-2xl font-black text-white shadow-lg shadow-emerald-200"
          >
            ✓
          </div>

          <h2 className="mt-5 text-xl font-black tracking-tight text-slate-950">
            Signed in successfully
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Welcome back,{" "}

            <span className="font-bold text-slate-950">
              {result.data.name}
            </span>
            .
          </p>

          <a
            href="/account"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-violet-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Continue to your account
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
      {result &&
      !result.ok ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 font-black text-red-700"
            >
              !
            </span>

            <div>
              <p className="font-bold">
                {
                  result.error
                    .message
                }
              </p>

              {result.error
                .correlationId ? (
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
          htmlFor="email"
          className="block text-sm font-bold text-slate-800"
        >
          Email address
        </label>

        <div className="relative mt-2">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base font-bold text-slate-400"
          >
            @
          </span>

          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={191}
            placeholder="you@example.com"
            aria-invalid={
              emailErrors.length >
              0
            }
            aria-describedby={
              emailErrors.length >
              0
                ? "email-error"
                : undefined
            }
            className="block w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <FieldErrors
          id="email-error"
          messages={
            emailErrors
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="block text-sm font-bold text-slate-800"
          >
            Password
          </label>

          <span className="text-xs font-medium text-slate-500">
            Password reset coming later
          </span>
        </div>

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
            autoComplete="current-password"
            required
            maxLength={128}
            placeholder="Enter your password"
            aria-invalid={
              passwordErrors.length >
              0
            }
            aria-describedby={
              passwordErrors.length >
              0
                ? "password-error"
                : undefined
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
            className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-xs font-black text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>

        <FieldErrors
          id="password-error"
          messages={
            passwordErrors
          }
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={
          isPending
        }
        className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 via-blue-700 to-violet-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
      >
        {isPending
          ? "Signing you in..."
          : "Sign in to EventHub"}
      </button>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="h-px flex-1 bg-slate-200" />

        <span>
          Secure database session
        </span>

        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="text-center text-xs leading-5 text-slate-500">
        Your password is verified
        securely and is never stored
        in plain text.
      </p>
    </form>
  );
}
