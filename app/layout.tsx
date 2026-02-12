import type { Metadata } from "next";
import { Goldman } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

const goldman = Goldman({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-goldman",
});

export const metadata: Metadata = {
  title: "Rovera Consórcio",
  description: "O futuro é elétrico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${goldman.variable}`}>
      <Providers>
        <body className={`${GeistSans.className} antialiased`}>
          <Header/>
          {children}
        </body>
      </Providers>
    </html>
  );
}