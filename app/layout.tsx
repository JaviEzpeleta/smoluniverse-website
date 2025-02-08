import "./globals.css";

import { Grandstander } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import ClonesSessionController from "@/components/ClonesSessionController";
import WaitlistModal from "@/components/WaitlistModal";
import { Suspense } from "react";
import VisitTracker from "@/components/VisitTracker";
import LogoImageInitializer from "@/components/LogoImageInitializer";
import NoiseLayer from "@/components/NoiseLayer";

const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander",
});

export const generateMetadata = async () => {
  const ogImage = `https://smoluniverse.com/thumbnail.png`;

  const images = [ogImage];

  const appName = "smoluniverse";
  const theTitle = `Smol Universe`;
  const theDescription = "an experiment on ai agents + onchain culture";

  return {
    title: theTitle,
    description: theDescription,
    applicationName: appName,
    referrer: "origin-when-cross-origin",
    keywords: ["ai", "agents", "onchain", "culture"],
    authors: [{ name: "Javi", url: "https://javitoshi.com" }],
    creator: "@javitoshi",
    publisher: "@javitoshi",
    metadataBase: new URL("https://smoluniverse.com"),
    openGraph: {
      images: images,
      title: theTitle,
      description: theDescription,
      url: `https://smoluniverse.com`,
      siteName: appName,
      locale: "en_US",
      type: "website",
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${grandstander.className} ${grandstander.variable} antialiased selection:bg-smolGreen selection:text-black`}
      >
        <div className="max-w-6xl mx-auto">
          <LogoImageInitializer />
          <NoiseLayer />
          <Suspense fallback={null}>
            <VisitTracker />
          </Suspense>
          <Header />
          <WaitlistModal />
          <ClonesSessionController />
          <div>{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
