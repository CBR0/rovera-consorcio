"use client";

import { useEffect, useState, useRef } from "react";
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

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const formatPhone = (phone: string): string => {
  if (!phone) return "-";
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length === 0) return "-";
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export default function LeadsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchLeads() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", "10");
        if (search) {
          params.set("search", search);
        }

        const response = await fetch(`/api/leads?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar leads");
        }
        const data: LeadsResponse = await response.json();
        setLeads(data.leads);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchLeads();
      return;
    }

    const debounce = setTimeout(fetchLeads, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [status, page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir lead");
      }

      setLeads(leads.filter((lead) => lead._id !== id));
      setTotal(total - 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir lead");
    } finally {
      setDeletingId(null);
    }
  };

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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rovera-black text-white">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-rovera-black text-white p-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold font-display">Leads</h1>
        <p className="mb-10 text-lg">Aqui você pode gerenciar melhor os leads, visualizar suas informações e realizar ações como exclusão.</p>

        <div className="mb-6">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-md px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rovera-primary"
          />
        </div>

        {error && (
          <p className="text-red-500 mb-4">Erro: {error}</p>
        )}

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
                <th className="py-3 px-4 text-sm font-semibold text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Nenhum lead encontrado.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                    <td className="py-3 px-4">{lead.nome}</td>
                    <td className="py-3 px-4">{lead.email}</td>
                    <td className="py-3 px-4">{formatPhone(lead.telefone)}</td>
                    <td className="py-3 px-4">{formatCurrency(lead.valorDesejado)}</td>
                    <td className="py-3 px-4">{lead.parcelas}x</td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        disabled={deletingId === lead._id}
                        className="text-red-500 hover:text-red-400 text-sm disabled:opacity-50"
                      >
                        {deletingId === lead._id ? "Excluindo..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {loading && leads.length > 0 && (
          <div className="mt-2 text-center text-gray-400 text-sm">
            Atualizando...
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 rounded bg-zinc-800 border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700"
            >
              Anterior
            </button>
            <span className="text-gray-400">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 rounded bg-zinc-800 border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700"
            >
              Próxima
            </button>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500">Total: {total} leads</p>
      </div>
    </div>
  );
}
