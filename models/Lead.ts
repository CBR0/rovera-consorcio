import { Collection, ObjectId } from "mongodb";

export interface Lead {
  _id?: ObjectId;
  nome: string;
  email: string;
  telefone: string;
  valorDesejado: number;
  parcelas: number;
  valorParcela?: number;
  valorTotal?: number;
  userEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadInput {
  nome: string;
  email: string;
  telefone: string;
  valorDesejado: number;
  parcelas: number;
  valorParcela?: number;
  valorTotal?: number;
  userEmail?: string;
}

let leadCollection: Collection<Lead> | null = null;

export async function getLeadCollection(): Promise<Collection<Lead>> {
  if (leadCollection) {
    return leadCollection;
  }

  const client = await import("@/lib/mongodb").then((m) => m.default);
  const db = (await client).db();
  leadCollection = db.collection<Lead>("leads");
  return leadCollection;
}
