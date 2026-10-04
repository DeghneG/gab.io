import type { Metadata } from "next";
import { Shrikhand, Special_Elite } from "next/font/google";
import "./globals.css";

/* Shrikhand: chunky retro display face for headings */
const shrikhand = Shrikhand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shrikhand",
  display: "swap",
});

/* Special Elite: typewriter feel for body and typed text */
const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deghne Gabriel Agana | Front-end Developer",
  description:
    "Personal portfolio of Deghne Gabriel Agana (gabz.io). Front-end developer building intentional, alive interfaces with React, Next.js, and TypeScript.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${shrikhand.variable} ${specialElite.variable} h-full`}
    >
      <body className="min-h-dvh flex flex-col antialiased">
        {/* Film grain / paper texture overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
