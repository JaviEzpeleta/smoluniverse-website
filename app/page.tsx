import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <Title>Hello World!!!</Title>
      <div className="flex flex-col gap-2 items-start">
        <Link href="/new-clone">
          <Button>New clone</Button>
        </Link>

        <Button variant="outline">Click me!</Button>
      </div>
    </div>
  );
}
