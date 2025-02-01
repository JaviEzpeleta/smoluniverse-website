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
      <Link href={ERC20TokenContractAddress} draggable={false} target="_blank">
        <div className="bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-50 transition-all duration-150 active:opacity-40 text-zinc-200 font-bold rounded-full p-1.5 pr-3 flex items-center justify-center gap-2">
          <Image
            src="/images/etherscan-logo.png"
            alt="Etherscan"
            className="bg-white rounded-full p-[1px]"
            width={32}
            height={32}
          />
          <div className="translate-y-0.5">$SMOL Contract</div>
        </div>
      </Link>
    </div>
  );
};

export default Header;
