import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LangProvider } from "./lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RedNote — Таны амьдралын сонирхлын нийгэмлэг",
  description:
    "RedNote бол залуучуудын амьдрах хэв маягийн платформ. 200 саяны хэрэглэгч өөрсдийн амьдралаа RedNote дээр хуваалцаж байна.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-foreground">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
