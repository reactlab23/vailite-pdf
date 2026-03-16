import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Генератор КП для психологов | AI-powered Proposal Generator",
  description: "Автоматическая генерация персонализированных коммерческих предложений для психологов. AI анализирует профиль и создаёт готовый PDF за 30 секунд.",
  keywords: ["коммерческое предложение", "психолог", "AI", "генератор КП", "PDF", "маркетинг психологов"],
  authors: [{ name: "Content-Zavod" }],
  icons: {
    icon: "/vailite-logo.jpeg",
  },
  openGraph: {
    title: "Генератор КП для психологов",
    description: "AI генератор коммерческих предложений для психологов",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
