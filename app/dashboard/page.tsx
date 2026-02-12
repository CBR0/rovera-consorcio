import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo, {session.user?.name}!</h1>
      <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="rounded-full mx-auto mb-4"
          />
        )}
        <p className="text-lg">Email: {session.user?.email}</p>
        <p className="text-sm text-gray-500 mt-4">Dados recuperados do GitHub</p>
      </div>
    </div>
  );
}