"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import SimulationForm, { SimulationResult } from "@/components/SimulationForm";

interface SavedSimulation {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  valorDesejado: number;
  parcelas: number;
  valorParcela: number;
  valorTotal: number;
  createdAt: string;
}

const formatPhone = (phone: string): string => {
  if (!phone) return "-";
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length === 0) return "-";
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loadingSimulation, setLoadingSimulation] = useState(true);

  useEffect(() => {
    console.log("Status de autenticação:", status);
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchLastSimulation() {
      if (status !== "authenticated" || !session?.user?.email) return;

      try {
        const response = await fetch(`/api/leads?email=${encodeURIComponent(session.user.email)}`);
        if (response.ok) {
          const data: SavedSimulation | null = await response.json();
          if (data) {
            setSimulationResult({
              nome: data.nome,
              email: data.email,
              telefone: data.telefone,
              valorDesejado: data.valorDesejado,
              parcelas: data.parcelas,
              valorParcela: data.valorParcela,
              valorTotal: data.valorTotal,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar simulação:", error);
      } finally {
        setLoadingSimulation(false);
      }
    }

    fetchLastSimulation();
  }, [session, status]);

  if (status === "loading" || loadingSimulation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-rovera-black text-white">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const handleNewSimulation = () => {
    setSimulationResult(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-rovera-black text-white relative">
      <div className="absolute top-6 right-8">
        <LogoutButton />
      </div>
      <div className="w-full max-w-4xl">
        <div className="mb-16" />

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="Foto de perfil"
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <h2 className="text-xl font-bold text-white">
              <span className="">Bem-vindo!</span>
              <br />{session?.user?.name}!<br />
              <span className="text-gray-400 text-sm font-normal">{session?.user?.email}</span>
            </h2>
          </div>

          {simulationResult ? (
            <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-zinc-900/80 border border-zinc-800">
              <h2 className="text-2xl mb-3 font-bold text-center text-white font-display tracking-wide">
                Simulação Concluída
              </h2>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between border-b border-zinc-700 pb-2">
                  <span className="text-gray-400">Nome</span>
                  <span className="font-medium">{simulationResult.nome}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-2">
                  <span className="text-gray-400">Telefone</span>
                  <span className="font-medium">{formatPhone(simulationResult.telefone)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-2">
                  <span className="text-gray-400">Valor do crédito</span>
                  <span className="font-medium text-rovera-primary">
                    {formatCurrency(simulationResult.valorDesejado)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-2">
                  <span className="text-gray-400">Parcelas</span>
                  <span className="font-medium">{simulationResult.parcelas}x</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-2">
                  <span className="text-gray-400">Valor da parcela</span>
                  <span className="font-medium text-rovera-primary">
                    {formatCurrency(simulationResult.valorParcela)}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-400 font-semibold">Total a pagar</span>
                  <span className="font-bold text-xl text-rovera-primary">
                    {formatCurrency(simulationResult.valorTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleNewSimulation}
                className="mt-6 group flex items-center justify-center gap-3 px-8 py-3 rounded-[10px] h-[40px] -skew-x-12 border border-rovera-primary text-rovera-primary tracking-wider hover:bg-rovera-primary hover:text-black transition-all duration-300 w-full font-display text-md md:text-xl"
              >
                <span className="skew-x-12">nova simulação</span>
              </button>
            </div>
          ) : (
            <SimulationForm
              initialNome={session?.user?.name || ""}
              initialEmail={session?.user?.email || ""}
              onSuccess={setSimulationResult}
            />
          )}
        </div>
      </div>
    </div>
  );
}
