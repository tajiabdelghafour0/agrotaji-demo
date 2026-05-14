import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "agrotaji",
  description: "AI Plant Disease Diagnosis & B2B E-Commerce Platform",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  );
}
