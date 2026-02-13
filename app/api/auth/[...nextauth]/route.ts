import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session }: { session: Session }) {
      return session;
    }
  },
});

export { handler as GET, handler as POST };

export const dynamic = 'force-dynamic';