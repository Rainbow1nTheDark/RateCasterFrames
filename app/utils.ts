

export function appURL() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  } else {
    const url = process.env.APP_URL || vercelURL() || "http://localhost:3000";
    console.warn(
      `Warning (examples): APP_URL environment variable is not set. Falling back to ${url}.`
    );
    return url;
  }
}

export function vercelURL() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
}

export function createExampleURL(path: string) {
  const baseUrl = appURL();
  console.log('Base URL:', baseUrl);
  const fullUrl = new URL(path, baseUrl).toString();
  console.log('Full URL:', fullUrl);
  return fullUrl;
}
