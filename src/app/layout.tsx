// app/layout.tsx (or wherever RootLayout is defined)

import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Merriweather can have multiple weights: 400, 700, etc.
// Adjust as needed for normal & bold text in paragraphs
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"], // can add 300, 600, 900 if desired
});

export const metadata: Metadata = {
  title: "About Taylor Buley",
  description: "Taylor Buley is a systematic problem solver.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Include Merriweather variable */}
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${merriweather.variable} 
          antialiased
        `}
      >
        <GoogleAnalytics gaId="G-58S0CLSPM7" />
        {children}
      </body>
    </html>
  );
}
