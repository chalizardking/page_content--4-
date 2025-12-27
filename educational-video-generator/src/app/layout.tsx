import type { Metadata } from "next";
import { Instrument_Sans, Indie_Flower } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const indieFlower = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-indie-flower",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Video Generator from Text & Image",
  description:
    "Generate animated educational videos in 30 seconds from any text prompt or image. Try free now!",
  keywords: [
    "AI video generator",
    "text to video",
    "educational videos",
    "AI tutor",
    "video lessons",
  ],
  authors: [{ name: "AIPrep Clone" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${instrumentSans.variable} ${indieFlower.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="antialiased" suppressHydrationWarning>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
