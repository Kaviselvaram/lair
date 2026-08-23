import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

// Luxury editorial display — high contrast, optical sizing, soft/wonk character.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

// Technical / aviation labels.
const mono = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE = "https://lair.flights";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "L/Air — Above the Weather",
    template: "%s — L/Air",
  },
  description:
    "Private aviation, elevated beyond the expected. L/Air is on-demand and members-only global access for a new generation of travel.",
  keywords: [
    "L/Air",
    "private jet",
    "private aviation",
    "luxury travel",
    "on-demand flights",
    "jet membership",
  ],
  authors: [{ name: "L/Air" }],
  openGraph: {
    type: "website",
    url: SITE,
    title: "L/Air — Above the Weather",
    description:
      "Private aviation, elevated beyond the expected. Every flight begins with a different sky.",
    siteName: "L/Air",
  },
  twitter: {
    card: "summary_large_image",
    title: "L/Air — Above the Weather",
    description: "Private aviation, elevated beyond the expected.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${body.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
