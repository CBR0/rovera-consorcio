import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      href="/login"
      className="group flex items-center gap-3 px-8 py-3 rounded-[10px] h-[40px] -skew-x-12 border border-rovera-primary text-rovera-primary tracking-wider hover:bg-rovera-primary hover:text-black transition-all duration-300"
    >
      <span className="skew-x-12 font-display text-xl">simule agora</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 group-hover:translate-x-1 transition-transform skew-x-12"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </Link>
  );
}