import type { Metadata } from "next";
import "./globals.css";

import { Grandstander } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import ClonesSessionController from "@/components/ClonesSessionController";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${grandstander.className} antialiased`}>
        <div className="max-w-6xl mx-auto">
          <Header />
          <ClonesSessionController />
          <div>{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
