import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HungryDB - The database that eats your chaos.",
  description:
    "Drop your spreadsheets, scans, and legacy exports. Walk away with a queryable database.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-ink bg-bg overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
