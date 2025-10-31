// app/layout.tsx (or wherever RootLayout is defined)

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
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

// Local fonts
const hedvig = localFont({
  src: '../../public/fonts/Hedvig_Letters_Serif/static/HedvigLettersSerif_18pt-Regular.ttf',
  variable: '--font-hedvig',
});

const nothingYouCouldDo = localFont({
  src: '../../public/fonts/Nothing_You_Could_Do/NothingYouCouldDo-Regular.ttf',
  variable: '--font-nothing',
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
          ${hedvig.variable}
          ${nothingYouCouldDo.variable}
          antialiased
        `}
      >
        <GoogleAnalytics gaId="G-58S0CLSPM7" />
        {children}
      </body>
    </html>
  );
}
