"use client";

import BigTitle from "@/components/BigTitle";
import BlurryEntrance from "@/components/BlurryEntrance";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { ACTIONS_OBJECT } from "@/lib/actions-catalog";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="py-8 px-4">
        <div className="w-full flex justify-center items-center">
          <BlurryEntrance delay={0.1}>
            <Title>Explore By type of content</Title>
          </BlurryEntrance>
        </div>
        <div className="flex flex-wrap gap-2 justify-center items-center p-4 max-w-5xl mx-auto">
          {ACTIONS_OBJECT.map((action) => (
            <Link
              key={action.code}
              href={`/explore/${action.code}`}
              //   className="w-full"
            >
              <Button size="sm" variant="outlineGray" className="w-full">
                <div className="flex items-center gap-2 text-lg">
                  <div>{action.emoji}</div>
                  <div>{action.shortName}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
