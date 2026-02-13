import { NextRequest, NextResponse } from "next/server";
import { getLeadCollection, LeadInput } from "@/models/Lead";

export async function POST(request: NextRequest) {
  try {
    const body: LeadInput = await request.json();

    const { nome, email, telefone, valorDesejado, parcelas } = body;

    if (!nome || !email || !valorDesejado || !parcelas) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const lead = {
      nome,
      email,
      telefone: telefone || "",
      valorDesejado,
      parcelas,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const collection = await getLeadCollection();
    const result = await collection.insertOne(lead);

    return NextResponse.json(
      { message: "Lead salvo com sucesso", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return NextResponse.json(
      { error: "Erro ao salvar lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const collection = await getLeadCollection();
    const leads = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erro ao buscar leads:", error);
    return NextResponse.json(
      { error: "Erro ao buscar leads" },
      { status: 500 }
    );
  }
}
