import { headers } from "next/headers";

export function currentURL(pathname: string): URL {
  try {
    const headersList = headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";

    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    console.error(error);
    return new URL(pathname, appURL());
  }
}

// export function appURL(): string {
//   if (process.env.APP_URL) {
//     return process.env.APP_URL;
//   }
  
//   const url = vercelURL() || "http://localhost:3000";
//   console.warn(
//     `Warning: APP_URL environment variable is not set. Falling back to ${url}.`
//   );
//   return url;
// }

export function appURL(): string {
  return process.env.APP_URL || `https://${headers().get('host')}`;
}

export function createExampleURL(path: string): string {
  return new URL(path, appURL()).toString();
}

export function vercelURL(): string | undefined {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
}
