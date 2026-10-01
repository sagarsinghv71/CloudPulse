import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudPulse | AI-Powered Developer Observability & Incident Command Center",
  description:
    "Single-pane developer platform for monitoring services, deployments, logs, telemetry, and automated AI root-cause investigation.",
  keywords: [
    "observability",
    "incident management",
    "telemetry",
    "devops",
    "metrics",
    "logs",
    "ai incident copilot",
    "cloud infrastructure",
  ],
  authors: [{ name: "CloudPulse Engineering" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#08090d] text-[#f1f3f9] selection:bg-cyan-500/20 selection:text-cyan-300">
        {children}
      </body>
    </html>
  );
}
