"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Header from "@/components/Header";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogin = (provider: string) => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      signIn(provider, { callbackUrl: "/dashboard" });
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">

          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Entre na Rovera
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Escolha como deseja simular seu consórcio
            </p>
          </div>

          <div className="mt-8 space-y-4">

            <button
              onClick={() => handleLogin("google")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
            >
              <FcGoogle className="h-6 w-6" />
              Continuar com Google
            </button>

            <button
              onClick={() => handleLogin("github")}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292F] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#24292F]/90 focus:outline-none focus:ring-2 focus:ring-[#24292F]/50 focus:ring-offset-2 transition-all"
            >
              <FaGithub className="h-6 w-6" />
              Continuar com GitHub
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Ou entre com e-mail</span>
              </div>
            </div>

            <button
              onClick={() => alert("Para usar email, precisamos configurar o banco de dados!")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
            >
              <MdOutlineEmail className="h-6 w-6 text-gray-500" />
              Entrar com E-mail
            </button>
          </div>
        </div>
      </div>
    </>
  );
}