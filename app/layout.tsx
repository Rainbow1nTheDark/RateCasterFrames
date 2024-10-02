import type { Metadata } from "next";
import "./globals.css";
import { Frame } from "frames.js";

const initialFrame: Frame = {
  image: "/base_screen.png",
  version: "vNext",
  buttons: [
    {
      label: "Start Quiz",
      action: "post"
    },
  ],
  postUrl: `${process.env.APP_URL}/frames`,
};

export const metadata: Metadata = {
  title: "RateCaster",
  description: "Check your knowledge and Rate",
  openGraph: {
    title: "RateCaster",
    description: "Check your knowledge and Rate Apps",
  },
  other: Object.fromEntries(
    Object.entries(initialFrame).map(([key, value]) => [key, value?.toString() ?? ''])
  ),
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