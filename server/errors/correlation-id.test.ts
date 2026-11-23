import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createCorrelationId,
  isCorrelationId,
} from "./correlation-id";

describe("correlation identifiers", () => {
  it("creates a valid UUID", () => {
    const correlationId =
      createCorrelationId();

    expect(
      isCorrelationId(correlationId),
    ).toBe(true);
  });

  it("creates a different identifier for each call", () => {
    const firstCorrelationId =
      createCorrelationId();

    const secondCorrelationId =
      createCorrelationId();

    expect(firstCorrelationId).not.toBe(
      secondCorrelationId,
    );
  });

  it("rejects invalid identifiers", () => {
    expect(
      isCorrelationId("error-123"),
    ).toBe(false);

    expect(
      isCorrelationId(""),
    ).toBe(false);

    expect(
      isCorrelationId(
        "550e8400-e29b-41d4-a716",
      ),
    ).toBe(false);
  });
});
