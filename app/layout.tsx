import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git Commit Search",
  description: "Search commit history with natural language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
