import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Todo Board",
  description: "User-based Todo Board with CRUD using Next.js + MongoDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Header />
        <main className="pt-16 min-h-screen">{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
