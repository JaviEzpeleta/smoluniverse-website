import Title from "@/components/Title";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-4">
      <Title>Hello World!!!</Title>
      <div className="flex flex-col gap-2 items-start text-yellow-200">
        <Button>Click me!</Button>

        <Button variant="outline">Click me!</Button>
      </div>
    </div>
  );
}
