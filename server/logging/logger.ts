import {
  redactSensitiveData,
} from "./redact-sensitive-data";

import {
  serializeLogValue,
} from "./serialize-log-value";

export const LOG_LEVELS = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

export type LogLevel =
  (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

export type LogMetadata =
  Record<string, unknown>;

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  metadata?: LogMetadata;
};

export type CreateLogEntryOptions = {
  level: LogLevel;
  message: string;
  correlationId?: string;
  metadata?: LogMetadata;
};

export type LoggerOptions = {
  correlationId?: string;
  metadata?: LogMetadata;
};

export function createLogEntry(
  options: CreateLogEntryOptions,
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: options.level,
    message: options.message,
  };

  if (options.correlationId) {
    entry.correlationId =
      options.correlationId;
  }

  if (options.metadata) {
    const serializedMetadata =
      serializeLogValue(
        options.metadata,
      );

    entry.metadata =
      redactSensitiveData(
        serializedMetadata,
      ) as LogMetadata;
  }

  return entry;
}

export const logger = {
  info(
    message: string,
    options: LoggerOptions = {},
  ): void {
    const entry = createLogEntry({
      level: LOG_LEVELS.INFO,
      message,
      ...options,
    });

    console.info(entry);
  },

  warn(
    message: string,
    options: LoggerOptions = {},
  ): void {
    const entry = createLogEntry({
      level: LOG_LEVELS.WARN,
      message,
      ...options,
    });

    console.warn(entry);
  },

  error(
    message: string,
    options: LoggerOptions = {},
  ): void {
    const entry = createLogEntry({
      level: LOG_LEVELS.ERROR,
      message,
      ...options,
    });

    console.error(entry);
  },
};
