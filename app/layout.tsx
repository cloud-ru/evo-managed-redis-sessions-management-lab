import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Managed Redis Session Management Lab",
  description: "A cloud platform session management system with Redis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1A1A1A] text-white">
        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
} 