"use client";

import { signOut } from "next-auth/react";
import { IoIosLogOut } from "react-icons/io";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-gray-400 hover:text-rovera-primary hover:border-rovera-primary transition-all duration-300 relative z-50"
      title="Sair"
    >
      <IoIosLogOut size={20} />
    </button>
  );
}
