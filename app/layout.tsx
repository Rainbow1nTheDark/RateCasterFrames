import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "RateCaster",
  description: "Check your knowledge and Rate",
  icons: {
    icon: [{ url: "/logo.jpg", sizes: "32x32", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
