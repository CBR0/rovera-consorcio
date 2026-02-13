"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Lead {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  valorDesejado: number;
  parcelas: number;
  createdAt: string;
}

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchLeads() {
      try {
        const response = await fetch("/api/leads");
        if (!response.ok) {
          throw new Error("Erro ao carregar leads");
        }
        const data = await response.json();
        setLeads(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [status]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rovera-black text-white">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rovera-black text-white">
        <p className="text-xl text-red-500">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rovera-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-8">Leads</h1>

        {leads.length === 0 ? (
          <p className="text-gray-400">Nenhum lead encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Nome</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Email</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Telefone</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Valor</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Parcelas</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Data</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                    <td className="py-3 px-4">{lead.nome}</td>
                    <td className="py-3 px-4">{lead.email}</td>
                    <td className="py-3 px-4">{lead.telefone || "-"}</td>
                    <td className="py-3 px-4">{formatCurrency(lead.valorDesejado)}</td>
                    <td className="py-3 px-4">{lead.parcelas}x</td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500">Total: {leads.length} leads</p>
      </div>
    </div>
  );
}
