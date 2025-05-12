import Image from "next/image";
import Link from "next/link";
import { satoshi } from "@/fonts/satoshi";

export default function Header() {
  return (
    <header className={`${satoshi.className} fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 py-3 px-4`}>
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Auraah Logo" 
            width={32} 
            height={32}
            className="mr-2"
          />
          <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Auraah
          </span>
        </Link>
      </div>
    </header>
  );
}