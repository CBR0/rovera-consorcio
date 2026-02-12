import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12">
            <div >
                <Link href="/" className="flex flex-col flex-end items-end leading-none">
                    <span className="font-display font-black text-xl text-[32.81px]  leading-none">rovera</span>
                    <span className="font-display text-rovera-primary">consórcio</span>
                </Link>
            </div>
        </header>
    );
}