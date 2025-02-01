import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const Header = () => {
  const ERC20TokenContractAddress = `https://sepolia.basescan.org/token/${process.env.ERC20_TOKEN_CONTRACT_ADDRESS}`;
  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <Button className="flex items-center gap-1 pb-2" variant="ghost">
          <Image src="/logo.png" alt="Smol Universe" width={32} height={32} />
          <div className="text-2xl tracking-tighter translate-y-0.5 font-bold">
            Smol Universe
          </div>
        </Button>
      </Link>
      <Link href={ERC20TokenContractAddress}>
        <Image src="/logo.png" alt="Smol Universe" width={32} height={32} />
      </Link>
    </div>
  );
};

export default Header;
