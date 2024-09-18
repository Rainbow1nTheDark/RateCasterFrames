/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    minimumCacheTTL: 1,
    remotePatterns: [
      {
        hostname: "*",
        protocol: "http",
      },
      {
        hostname: "*",
        protocol: "https",
      },
      {
        hostname: new URL(process.env.APP_URL || 'https://frames.ratecaster.xyz').hostname,
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;