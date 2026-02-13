import { NextRequest, NextResponse } from "next/server";
import { getLeadCollection, LeadInput } from "@/models/Lead";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const body: LeadInput = await request.json();

    const { nome, email, telefone, valorDesejado, parcelas, valorParcela, valorTotal, userEmail } = body;

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
      valorParcela: valorParcela || 0,
      valorTotal: valorTotal || 0,
      userEmail: userEmail || email,
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("email");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const collection = await getLeadCollection();
    
    if (userEmail) {
      const lead = await collection.findOne(
        { userEmail },
        { sort: { createdAt: -1 } }
      );
      
      if (!lead) {
        return NextResponse.json(null);
      }
      
      return NextResponse.json(lead);
    }

    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { telefone: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [leads, total] = await Promise.all([
      collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);

    return NextResponse.json({
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Erro ao buscar leads:", error);
    return NextResponse.json(
      { error: "Erro ao buscar leads" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do lead é obrigatório" },
        { status: 400 }
      );
    }

    const collection = await getLeadCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Lead não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Lead excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir lead:", error);
    return NextResponse.json(
      { error: "Erro ao excluir lead" },
      { status: 500 }
    );
  }
}
