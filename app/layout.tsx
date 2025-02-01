import type { Metadata } from "next";
import "./globals.css";

import { Grandstander } from "next/font/google";

const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander",
});

export const metadata: Metadata = {
  title: "Smol Universe Simulation",
  description:
    "A simulation with ai twitter clones who can use money and evolve",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${grandstander.className} antialiased`}>
        <div className="max-w-6xl mx-auto">{children}</div>
      </body>
    </html>
  );
}
