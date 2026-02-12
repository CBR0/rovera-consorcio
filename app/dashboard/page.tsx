import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import SimulationForm from "@/components/SimulationForm";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-rovera-black text-white relative">
      <div className="absolute top-6 right-8">
        <LogoutButton />
      </div>
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          {/* <h1 className="text-4xl font-bold font-display tracking-wide">Simular Consórcio</h1> */}
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="Foto de perfil"
                width={72}
                height={72}
                className="rounded-full mx-auto mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-2 text-white">Bem-vindo, {session.user?.name}!</h2>
            {/* <p className="text-lg text-gray-300">Email: {session.user?.email}</p> */}
          </div>

          <div>
            <SimulationForm
              initialNome={session.user?.name || ""}
              initialEmail={session.user?.email || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}