/**
 * Structured connection values required by the Prisma MySQL adapter.
 */
export type DatabaseConnectionOptions = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

/**
 * Converts EventHub's MySQL DATABASE_URL into structured values.
 *
 * Example:
 * mysql://user:password@localhost:3306/eventhub
 *
 * The real connection URL remains inside `.env.local`.
 */
export function parseDatabaseUrl(
  databaseUrl: string,
): DatabaseConnectionOptions {
  const parsedUrl = new URL(databaseUrl);

  if (parsedUrl.protocol !== "mysql:") {
    throw new Error("EventHub database must use MySQL.");
  }

  const database = parsedUrl.pathname.replace(/^\//, "");

  if (!database) {
    throw new Error("EventHub database name is missing from DATABASE_URL.");
  }

  const port = parsedUrl.port ? Number(parsedUrl.port) : 3306;

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("EventHub database port is invalid.");
  }

  return {
    host: parsedUrl.hostname,
    port,
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database,
  };
}
